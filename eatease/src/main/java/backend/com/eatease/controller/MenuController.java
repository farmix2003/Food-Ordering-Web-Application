package backend.com.eatease.controller;

import backend.com.eatease.dto.MenuDto;
import backend.com.eatease.dto.RestaurantDto;
import backend.com.eatease.service.MenuService;
import backend.com.eatease.service.RestaurantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantDto>> getAllRestaurants() throws Exception {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }
}
