package backend.com.eatease.service;


import backend.com.eatease.dto.MenuDto;
import backend.com.eatease.entity.Menu;
import backend.com.eatease.entity.Restaurant;
import backend.com.eatease.request.FoodRequest;
import backend.com.eatease.request.UpdateTextBasedMenuItemRequest;

import java.util.List;

public interface MenuService {
     Menu addFood(FoodRequest req, Restaurant restaurant);
     void deleteFood(Long id) throws Exception;
     MenuDto viewFoodById(Long id) throws Exception;
     Menu getFoodById(Long id);
     List<MenuDto> getAllFoods(Long restaurantId) throws Exception;
     List<MenuDto> searchFood(String keyword) throws Exception;
     Menu updateAvailableStatus(Long id) throws Exception;
     Menu updateTextBasedMenuItem(Long id, UpdateTextBasedMenuItemRequest request);
     MenuDto toDto(Menu menu);

}
