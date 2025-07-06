package backend.com.eatease.service;


import backend.com.eatease.dto.MenuDto;
import backend.com.eatease.entity.Menu;
import backend.com.eatease.entity.Restaurant;
import backend.com.eatease.request.FoodRequest;

import java.util.List;

public interface MenuService {
    public Menu addFood(FoodRequest req, Restaurant restaurant);
    public void deleteFood(Long id) throws Exception;
    public MenuDto viewFoodById(Long id) throws Exception;
    public Menu getFoodById(Long id);
    public List<MenuDto> getAllFoods(Long restaurantId) throws Exception;
    public List<MenuDto> searchFood(String keyword) throws Exception;
    public Menu updateAvailableStatus(Long id) throws Exception;
}
