package backend.com.eatease.service;


import backend.com.eatease.entity.Menu;
import backend.com.eatease.entity.Restaurant;
import backend.com.eatease.request.FoodRequest;

import java.util.List;

public interface MenuService {
    public Menu addFood(FoodRequest req, Restaurant restaurant);
    public void deleteFood(Long id) throws Exception;
    public Menu getFoodById(Long id) throws Exception;
    public List<Menu> getAllFoods(Long restaurantId) throws Exception;
    public List<Menu> searchFood(String keyword) throws Exception;
    public Menu updateAvailableStatus(Long id) throws Exception;
}
