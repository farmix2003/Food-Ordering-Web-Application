package backend.com.eatease.controller;

import backend.com.eatease.dto.MenuDto;
import backend.com.eatease.dto.RestaurantDto;
import backend.com.eatease.entity.Menu;
import backend.com.eatease.entity.Restaurant;
import backend.com.eatease.entity.User;
import backend.com.eatease.service.MenuService;
import backend.com.eatease.service.RestaurantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/all")
public class MenuController {

    private final MenuService menuService;
    private final RestaurantService restaurantService;

    public MenuController(MenuService menuService, RestaurantService restaurantService) {
        this.menuService = menuService;
        this.restaurantService = restaurantService;
    }


    @GetMapping("/menu")
    public ResponseEntity<List<MenuDto>> getAllMenus(){
        return new ResponseEntity<>(menuService.getMenus(), HttpStatus.OK);
    }
    @GetMapping("/menu/search")
    public ResponseEntity<List<MenuDto>> searchMenu(@RequestParam("keyword") String keyword) throws Exception {
        List<MenuDto> menus = menuService.searchFood(keyword);
        return ResponseEntity.ok().body(menus);
    }

    @GetMapping("/menu/popular")
    public ResponseEntity<List<MenuDto>> getPopularFoods(){
       List<MenuDto> popularFoods = menuService.getPopularFoods();

       return ResponseEntity.ok(popularFoods);
    }

    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantDto>> getAllRestaurants() throws Exception {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }
    @GetMapping("/restaurants/search")
    public ResponseEntity<List<RestaurantDto>> searchRestaurants(@RequestParam("keyword") String key
    ) throws Exception {
        List<RestaurantDto> restaurants = restaurantService.searchRestaurants(key);
        return new ResponseEntity<>(restaurants, HttpStatus.OK);
    }
}
