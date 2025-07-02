package backend.com.eatease.controller;

import backend.com.eatease.entity.Menu;
import backend.com.eatease.entity.Restaurant;
import backend.com.eatease.request.FoodRequest;
import backend.com.eatease.response.MessageResponse;
import backend.com.eatease.service.MenuService;
import backend.com.eatease.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class MenuAdminController {

    @Autowired
    private MenuService menuService;
    @Autowired
    private RestaurantService restaurantService;

    @PostMapping("/{restaurantId}/add-food")
    public ResponseEntity<Menu> addFoodToMenu(@RequestHeader("Authorization") String jwt,
                                              @ModelAttribute FoodRequest request,
                                              @PathVariable Long restaurantId
    ) throws Exception {
        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
        Menu menu = menuService.addFood(request, restaurant);

        return new ResponseEntity<>(menu, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<MessageResponse> deleteFood(@RequestHeader("Authorization") String jwt,
                                                      @PathVariable Long id
    ) throws Exception {
        menuService.deleteFood(id);
        MessageResponse msg = new MessageResponse();
        msg.setMessage("Food deleted successfully");
        return ResponseEntity.ok().body(msg);
    }

    @GetMapping("/menu/{id}")
    public ResponseEntity<List<Menu>> getFoodsByRestaurantId(
            @PathVariable Long id
    ) throws Exception {
        List<Menu> menus = menuService.getAllFoods(id);
        return ResponseEntity.ok().body(menus);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Menu>> searchMenu(@RequestHeader("Authorization") String jwt,
                                                 @RequestParam("keyword") String keyword
    ) throws Exception {
        List<Menu> menus = menuService.searchFood(keyword);
        return ResponseEntity.ok().body(menus);
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<Menu> updateAvailableStatus(@RequestHeader("Authorization")String jwt,
                                                      @PathVariable Long id
                                                      ) throws Exception {
        Menu menu = menuService.updateAvailableStatus(id);
        return ResponseEntity.ok().body(menu);
    }
}
