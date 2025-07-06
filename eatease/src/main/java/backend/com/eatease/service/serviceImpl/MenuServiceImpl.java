package backend.com.eatease.service.serviceImpl;

import backend.com.eatease.entity.*;
import backend.com.eatease.repository.CategoryRepository;
import backend.com.eatease.repository.ExtrasRepository;
import backend.com.eatease.repository.ImageRepository;
import backend.com.eatease.repository.MenuRepository;
import backend.com.eatease.request.FoodRequest;
import backend.com.eatease.service.MenuService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

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

        // Save images
        imageRepository.saveAll(images);
        savedMenu.setImagesList(images);

        return savedMenu;
    }

    @Override
    public void deleteFood(Long id) throws Exception {
       Menu menu = menuRepository.findById(id).orElseThrow(() -> new RuntimeException("Menu not found with id "+id));
       menuRepository.deleteById(menu.getId());
    }

    @Override
    public Menu getFoodById(Long id) throws Exception {
        return menuRepository.findById(id).orElseThrow(() -> new RuntimeException("Menu not found with id "+id));
    }

    @Override
    public List<Menu> getAllFoods(Long restaurantId) throws Exception {
        return menuRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public List<Menu> searchFood(String keyword) throws Exception {
        return menuRepository.searchFood(keyword);
    }

    @Override
    public Menu updateAvailableStatus(Long id) throws Exception {
        Menu menu = menuRepository.findById(id).orElseThrow(() -> new RuntimeException("Menu not found"));
        menu.setAvailable(!menu.isAvailable());
        return menuRepository.save(menu);
    }
}
