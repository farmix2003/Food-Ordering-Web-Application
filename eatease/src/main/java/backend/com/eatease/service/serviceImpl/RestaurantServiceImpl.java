package backend.com.eatease.service.serviceImpl;

import backend.com.eatease.dto.MenuDto;
import backend.com.eatease.dto.RestaurantDto;
import backend.com.eatease.entity.*;
import backend.com.eatease.exception.RestaurantNotFoundException;
import backend.com.eatease.repository.*;
import backend.com.eatease.request.RestaurantRequest;
import backend.com.eatease.request.UpdateTextBasedRestaurantRequest;
import backend.com.eatease.response.ImageResponse;
import backend.com.eatease.service.MenuService;
import backend.com.eatease.service.RestaurantService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class RestaurantServiceImpl implements RestaurantService {

    private static final Logger logger = LoggerFactory.getLogger(RestaurantServiceImpl.class);

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired private CategoryRepository categoryRepository;

    @Autowired
    private ExtrasRepository extrasRepository;

    @Autowired
    private MenuService menuService;

    @Override
    @Transactional
    public Restaurant createRestaurant(RestaurantRequest restaurant, User user) throws Exception {

        if (restaurant == null) {
            logger.error("Restaurant request is null");
            throw new IllegalArgumentException();
        }
        logger.info("Received RestaurantRequest: name={}, address={}, images={}",
                restaurant.getName(), restaurant.getAddress(), restaurant.getImages());

        if (restaurant.getAddress() == null) {
            logger.error("Address is null in RestaurantRequest");
            throw new IllegalArgumentException("Address cannot be null");
        }

        if (restaurant.getAddress().getStreetName() == null || restaurant.getAddress().getCityName() == null) {
            logger.error("Invalid address: streetName={}, cityName={}",
                    restaurant.getAddress().getStreetName(), restaurant.getAddress().getCityName());
            throw new IllegalArgumentException("Address streetName and cityName must not be null");
        }
        if (restaurant.getName() == null) {
            logger.error("Restaurant name is null");
            throw new IllegalArgumentException("Restaurant name must not be null");
        }

        if (user == null) {
            logger.error("User is null");
            throw new IllegalArgumentException("User must not be null");
        }

        Address address;
        try {
            address = addressRepository.save(restaurant.getAddress());
            logger.info("Address saved: id={}", address.getId());
        } catch (Exception e) {
            logger.error("Error saving address for restaurant: {}", restaurant.getName(), e);
            throw new RuntimeException("Failed to save address: " + e.getMessage(), e);
        }

        Restaurant newRestaurant = new Restaurant();
        newRestaurant.setName(restaurant.getName());
        newRestaurant.setAddress(address);
        newRestaurant.setContactInfo(restaurant.getContactInfo());
        newRestaurant.setOpeningHours(restaurant.getOpeningHours());
        newRestaurant.setClosingHours(restaurant.getClosingHours());
        newRestaurant.setCuisineType(restaurant.getCuisineType());
        newRestaurant.setDescription(restaurant.getDescription());
        newRestaurant.setRegistrationDate(LocalDateTime.now());
        newRestaurant.setOpen(true);
        newRestaurant.setOwner(user);

        List<Image> images = new ArrayList<>();
        if (restaurant.getImages() != null && !restaurant.getImages().isEmpty()) {
            for (MultipartFile file : restaurant.getImages()) {
                if (file.isEmpty()) {
                    logger.warn("Empty file skipped for restaurant: {}", restaurant.getName());
                    continue;
                }
                try {
                    Image image = new Image();
                    image.setFileName(UUID.randomUUID()+file.getOriginalFilename());
                    image.setFileType(file.getContentType());
                    image.setData(file.getBytes());
                    image.setCreatedAt(LocalDateTime.now());
                    image.setRestaurant(newRestaurant);
                    images.add(image);
                } catch (IOException e) {
                    logger.error("Failed to process image for restaurant: {}", restaurant.getName(), e);
                    throw new RuntimeException("Failed to process image:" +e.getMessage(), e);
                }
            }
            if(!images.isEmpty()){
                imageRepository.saveAll(images);
            }

            newRestaurant.setImages(images);
        }

        logger.info("Saving new restaurant: name={}", newRestaurant.getName());
        try {
            return restaurantRepository.save(newRestaurant);
        } catch (Exception e) {
            logger.error("Failed to save restaurant: {}", newRestaurant, e);
            throw new RuntimeException("Failed to save restaurant:"+e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public Restaurant updateRestaurant(Long id, UpdateTextBasedRestaurantRequest restaurant) throws IOException {
        Restaurant updatedRestaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Restaurant not found with id " + id));

        Optional.ofNullable(restaurant.getName()).ifPresent(updatedRestaurant::setName);
        Optional.ofNullable(restaurant.getDescription()).ifPresent(updatedRestaurant::setDescription);
        Optional.ofNullable(restaurant.getOpeningHours()).ifPresent(updatedRestaurant::setOpeningHours);
        Optional.ofNullable(restaurant.getClosingHours()).ifPresent(updatedRestaurant::setClosingHours);
        Optional.ofNullable(restaurant.getContactInfo()).ifPresent(updatedRestaurant::setContactInfo);
        Optional.ofNullable(restaurant.getCuisineType()).ifPresent(updatedRestaurant::setCuisineType);
        Optional.ofNullable(restaurant.getAddress()).ifPresent(updatedRestaurant::setAddress);

        return restaurantRepository.save(updatedRestaurant);
    }

    @Override
    public RestaurantDto viewRestaurantById(Long id) throws Exception {

        Restaurant restaurant= restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant not found with id" +id));
     return mapToDto(restaurant);
    }
  public Restaurant getRestaurantById(Long id) throws RestaurantNotFoundException {
      return restaurantRepository.findById(id)
              .orElseThrow(() -> new RestaurantNotFoundException("Restaurant not found with id" +id));
  }
    @Override
    public List<RestaurantDto> getAllRestaurants() throws Exception {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        return restaurants.stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public void deleteRestaurant(Long id) throws Exception {
        Restaurant restaurant = getRestaurantById(id);

        List<Menu> menus = menuRepository.findAllByRestaurantId(restaurant.getId());
        for (Menu menu : menus) {
            menu.getImagesList().clear();
            menu.getExtrasList().clear();
            menuRepository.delete(menu);
        }

        List<Category> categories = categoryRepository.findAllByRestaurantId(restaurant.getId());
        for (Category category : categories) {
            categoryRepository.delete(category);
        }

        List<Extras> extras = extrasRepository.findAllByRestaurantId(restaurant.getId());
        for (Extras extra : extras) {
            extrasRepository.delete(extra);
        }

        restaurantRepository.delete(restaurant);
    }


    @Override
    public List<RestaurantDto> searchRestaurants(String keyword) throws Exception {
        List<Restaurant> restaurants = restaurantRepository.searchRestaurants(keyword);

        return  restaurants.stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public RestaurantDto getRestaurantByUserId(Long id) throws Exception {
         Restaurant restaurant = restaurantRepository.findByOwnerId(id);
         if (restaurant == null){
             throw new RestaurantNotFoundException("Restarant not found");
         }
         return mapToDto(restaurant);
    }

    @Override
    public RestaurantDto addToFavourites(Long id, User user) throws Exception {
//        Restaurant restaurant = getRestaurantById(id);
//
//        RestaurantDto dto = new RestaurantDto();
//        dto.setId(id);
//        dto.setName(restaurant.getName());
//        dto.setName(restaurant.getName());
//        dto.setDescription(restaurant.getDescription());
//        dto.setImages(restaurant.getImages());
//
//        if (user.getFavoriteFoodList().contains(dto)) {
//            user.getFavoriteFoodList().remove(dto);
//        } else {
//            user.getFavoriteFoodList().add(dto);
//        }
        return null;
    }

    @Override
    public Restaurant updateRestaurantStatus(Long id) throws Exception {
        Restaurant restaurant = getRestaurantById(id);
        restaurant.setOpen(!restaurant.isOpen());
        return restaurantRepository.save(restaurant);
    }

    @Override
    public void removeImages(Long restaurantId, List<Long> imageIds) throws Exception {
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow(() ->
                new EntityNotFoundException("Restaurant not found wiht id " + restaurantId)
        );

        if (imageIds == null || imageIds.isEmpty()) {
            throw new IllegalArgumentException("No image id is provided");
        }
        List<Image> imagesToDelete = imageRepository.findAllById(imageIds).stream()
                .filter(img -> img.getRestaurant().getId().equals(restaurantId))
                .toList();
        imagesToDelete.forEach(img -> img.setRestaurant(null));
        imageRepository.deleteAll(imagesToDelete);


    }

    @Override
    public void addImage(Long restaurantId, MultipartFile image) throws Exception {
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow(() ->
                new EntityNotFoundException("No Restaurant found with id " + restaurantId)
              );
        if(image == null || image.isEmpty()){
            throw new IllegalArgumentException("Image file is missing");
        }
        Image newImage = new Image();
        newImage.setRestaurant(restaurant);
        newImage.setFileName(image.getOriginalFilename());
        newImage.setData(image.getBytes());
        newImage.setFileType(image.getContentType());
        newImage.setCreatedAt(LocalDateTime.now());
        imageRepository.save(newImage);
        restaurant.setImages(Collections.singletonList(newImage));
    }
    public RestaurantDto mapToDto(Restaurant restaurant) {
        RestaurantDto dto = new RestaurantDto();

        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setDescription(restaurant.getDescription());
        dto.setCuisineType(restaurant.getCuisineType());
        dto.setOpen(restaurant.isOpen());
        dto.setOpeningHours(restaurant.getOpeningHours());
        dto.setClosingHours(restaurant.getClosingHours());
        dto.setRegistrationDate(restaurant.getRegistrationDate());
        dto.setContactInfo(restaurant.getContactInfo());
        dto.setAddress(restaurant.getAddress());

        if (restaurant.getOwner() != null) {
            dto.setOwnerId(restaurant.getOwner().getId());
            dto.setOwnerUsername(restaurant.getOwner().getUsername());
        }

        List<MenuDto> menuDtos = restaurant.getFoods()
                .stream()
                .map(menu -> menuService.toDto(menu))
                .toList();
        dto.setFoods(menuDtos);

        dto.setOrders(restaurant.getOrders());

        List<ImageResponse> imageResponses = restaurant.getImages().stream().map(image -> {
            ImageResponse res = new ImageResponse();
            res.setId(image.getId());
            res.setFileName(image.getFileName());
            res.setUrl("http://localhost:8080/api/public/images/" + image.getId());
            return res;
        }).toList();
        dto.setImages(imageResponses);

        return dto;
    }



}
