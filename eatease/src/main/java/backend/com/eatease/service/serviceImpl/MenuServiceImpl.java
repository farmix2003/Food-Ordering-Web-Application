package backend.com.eatease.service.serviceImpl;

import backend.com.eatease.dto.ExtrasDto;
import backend.com.eatease.dto.MenuDto;
import backend.com.eatease.entity.*;
import backend.com.eatease.repository.*;
import backend.com.eatease.request.FoodRequest;
import backend.com.eatease.request.UpdateTextBasedMenuItemRequest;
import backend.com.eatease.response.ImageResponse;
import backend.com.eatease.service.MenuService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ExtrasRepository extrasRepository;

    @Autowired
    private OrderedFoodRepository orderedFoodRepository;

    @Override
    @Transactional
    public Menu addFood(FoodRequest req, Restaurant restaurant) {
        if (req.getFoodName() == null || req.getFoodName().isEmpty()) {
            throw new IllegalArgumentException("Food name must not be null or empty.");
        }

        Menu newFood = new Menu();
        newFood.setFoodName(req.getFoodName());
        newFood.setRestaurant(restaurant);
        newFood.setDescription(req.getDescription());
        newFood.setPrice(req.getPrice());
        newFood.setAvailable(true);
        newFood.setCreationDate(new Date());

        if (req.getCategoryId() != null) {
            Category category = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found with id " + req.getCategoryId()));
            newFood.setCategory(category);
        }

        if (req.getExtrasIds() != null && !req.getExtrasIds().isEmpty()) {
            List<Extras> extras = extrasRepository.findAllById(req.getExtrasIds());
            newFood.setExtrasList(extras);
        } else {
            newFood.setExtrasList(new ArrayList<>());
        }

        Menu savedMenu = menuRepository.save(newFood);

        List<Image> images = new ArrayList<>();
        for (MultipartFile file : req.getImages()) {
            if (!file.isEmpty()) {
                try {
                    Image image = new Image();
                    image.setFileName(UUID.randomUUID() + file.getOriginalFilename());
                    image.setFileType(file.getContentType());
                    image.setData(file.getBytes());
                    image.setCreatedAt(LocalDateTime.now());

                    image.setMenu(savedMenu);
                    image.setRestaurant(null);

                    images.add(image);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to process image", e);
                }
            }
        }

        imageRepository.saveAll(images);
        savedMenu.setImagesList(images);

        return savedMenu;
    }

    @Override
    @Transactional
    public void deleteFood(Long id) throws Exception {
       Menu menu = menuRepository.findById(id).orElseThrow(() -> new RuntimeException("Menu not found with id "+id));
       imageRepository.deleteByMenuId(id);
       menu.setCategory(null);
       orderedFoodRepository.deleteByFoodId(id);
       menuRepository.deleteById(menu.getId());
    }

    @Override
    public MenuDto viewFoodById(Long id) throws Exception {
        Menu menu = menuRepository.findById(id).orElseThrow(() -> new RuntimeException("Menu not found with id "+id));
       return toDto(menu);
    }

    public Menu getFoodById(Long id) {
        return menuRepository.findById(id).orElseThrow();
    }

    @Override
    public List<MenuDto> getAllFoods(Long restaurantId) throws Exception {
        List<Menu> menus = menuRepository.findAllByRestaurantId(restaurantId);
        return menus.stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<MenuDto> searchFood(String keyword) throws Exception {
        List<Menu> menus = menuRepository.searchFood(keyword);
        return menus.stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public Menu updateAvailableStatus(Long id) throws Exception {
        Menu menu = menuRepository.findById(id).orElseThrow(() -> new RuntimeException("Menu not found"));
        menu.setAvailable(!menu.isAvailable());
        return menuRepository.save(menu);
    }

    @Override
    @Transactional
    public Menu updateTextBasedMenuItem(Long id, UpdateTextBasedMenuItemRequest req) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Menu not found"));

        menu.setFoodName(req.getFoodName());
        menu.setDescription(req.getDescription());
        menu.setPrice(req.getPrice());

        if (req.getCategoryId() != null) {
            Category category = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            menu.setCategory(category);
        }

        if (req.getExtrasIds() != null) {
            List<Extras> extras = extrasRepository.findAllById(req.getExtrasIds());
            menu.setExtrasList(extras);
        }

        return menuRepository.save(menu);
    }


    public MenuDto toDto(Menu menu) {
        List<ImageResponse> imageUrls = menu.getImagesList().stream()
                .map(image -> {
                    ImageResponse imageResponse = new ImageResponse();
                    imageResponse.setUrl("http://localhost:8080/api/public/images/"+image.getId());
                    imageResponse.setFileName(image.getFileName());
                    imageResponse.setId(image.getId());
                    return imageResponse;
                }).toList();


        List<ExtrasDto> extraDtos = menu.getExtrasList().stream()
                .map(extra -> new ExtrasDto(extra.getId(), extra.getName(), extra.getPrice()))
                .collect(Collectors.toList());
       Long restaurantId = menu.getRestaurant().getId();
        return new MenuDto(
                menu.getId(),
                menu.getFoodName(),
                menu.getDescription(),
                menu.getPrice(),
                menu.isAvailable(),
                menu.getCategory() != null ? menu.getCategory().getCategoryName() : null,
                imageUrls,
                extraDtos,
                restaurantId
                );
    }

    @Override
    public List<MenuDto> getMenus() {
        List<Menu> menus = menuRepository.findAll();
        return menus.stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public void addImage(Long menuId, MultipartFile file) throws IOException {
        Menu menu = menuRepository.findById(menuId).orElseThrow();

        if(file == null || file.isEmpty()){
            throw new IllegalArgumentException("Image file is missing");
        }
        Image newImage = new Image();
        newImage.setRestaurant(null);
        newImage.setMenu(menu);
        newImage.setFileName(file.getOriginalFilename());
        newImage.setData(file.getBytes());
        newImage.setFileType(file.getContentType());
        newImage.setCreatedAt(LocalDateTime.now());
        imageRepository.save(newImage);
        menu.setImagesList(Collections.singletonList(newImage));
    }

    @Override
    public void deleteImages(Long menuId, List<Long> imageIds) {
      Menu menu = menuRepository.findById(menuId).orElseThrow();
        if (imageIds == null || imageIds.isEmpty()) {
            throw new IllegalArgumentException("No image id is provided");
        }
        List<Image> imagesToDelete = menu.getImagesList().stream()
                .filter(image -> image.getMenu().getId().equals(menuId))
                .toList();
        imagesToDelete.forEach(image -> image.setMenu(null));
        imageRepository.deleteAll(imagesToDelete);
    }

    @Override
    public List<MenuDto> getPopularFoods() {
        List<OrderedFood> orderedFoods = orderedFoodRepository.findAll();
        Map<Menu, Long> foodCounts = orderedFoods.stream()
                .collect(Collectors.groupingBy(OrderedFood::getFood, Collectors.counting()));

        return foodCounts.entrySet().stream()
                .sorted(Map.Entry.<Menu, Long>comparingByValue().reversed())
                .limit(10)
                .map(Map.Entry::getKey)
                .map(this::toDto)
                .toList();
    }



}
