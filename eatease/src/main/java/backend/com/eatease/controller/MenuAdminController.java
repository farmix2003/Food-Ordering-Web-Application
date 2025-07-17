package backend.com.eatease.controller;

import backend.com.eatease.dto.MenuDto;
import backend.com.eatease.entity.Menu;
import backend.com.eatease.entity.Restaurant;
import backend.com.eatease.request.FoodRequest;
import backend.com.eatease.request.UpdateTextBasedMenuItemRequest;
import backend.com.eatease.response.MessageResponse;
import backend.com.eatease.service.MenuService;
import backend.com.eatease.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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


    @PutMapping("/status/{id}")
    public ResponseEntity<Menu> updateAvailableStatus(@RequestHeader("Authorization")String jwt,
                                                      @PathVariable Long id
                                                      ) throws Exception {
        Menu menu = menuService.updateAvailableStatus(id);
        return ResponseEntity.ok().body(menu);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Menu> updateMenuItem(@PathVariable Long id,
                                               @RequestBody UpdateTextBasedMenuItemRequest request,
                                               @RequestHeader("Authorization") String jwt
                                               ){
        Menu updatedMenuItem = menuService.updateTextBasedMenuItem(id,request);
        return ResponseEntity.ok(updatedMenuItem);
    }
    @PostMapping("/add/{id}/image")
    public ResponseEntity<String> addImage(@PathVariable Long id,
                                           @RequestParam("image")MultipartFile img,
                                           @RequestHeader("Authorization") String jwt
                                           ) throws IOException {
        menuService.addImage(id, img);

        return ResponseEntity.ok("Image added successfully");
    }

    @DeleteMapping("/images/delete/{id}")
    public ResponseEntity<String> deleteImages(@PathVariable Long id,
                                               @RequestParam("ids") List<Long> imageIds,
                                               @RequestHeader("Authorization") String jwt
                                               ){
        menuService.deleteImages(id, imageIds);
        return ResponseEntity.ok("Images deleted successfully");
    }
}
