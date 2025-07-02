package backend.com.eatease.controller;

import backend.com.eatease.dto.RestaurantDto;
import backend.com.eatease.entity.Restaurant;
import backend.com.eatease.entity.User;
import backend.com.eatease.request.RestaurantRequest;
import backend.com.eatease.request.UpdateTextBasedRestaurantRequest;
import backend.com.eatease.response.MessageResponse;
import backend.com.eatease.service.RestaurantService;
import backend.com.eatease.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/restaurant")
public class RestaurantAdminController {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;


    @PostMapping("/add-restaurant")
    public ResponseEntity<Restaurant> addRestaurant(@ModelAttribute RestaurantRequest request,
                                                    @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Restaurant restaurant = restaurantService.createRestaurant(request, user);
        return new ResponseEntity<>(restaurant, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable Long id,
                                                       @RequestHeader("Authorization") String jwt,
                                                       @ModelAttribute UpdateTextBasedRestaurantRequest request
    ) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Restaurant restaurant =  restaurantService.updateRestaurant(id, request);
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<MessageResponse> deleteRestaurant(@PathVariable Long id,
                                                            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        restaurantService.deleteRestaurant(id);
        MessageResponse msg = new MessageResponse();
        msg.setMessage("Restaurant deleted successfully");
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Restaurant> updateRestaurantStatus(@PathVariable Long id,
                                                             @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Restaurant res = restaurantService.updateRestaurantStatus(id);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<RestaurantDto> findRestaurantByUserId(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);


        return ResponseEntity.ok(restaurantService.getRestaurantByUserId(user.getId()));
    }
    @PostMapping("/{restaurantId}/add")
    public ResponseEntity<MessageResponse> addImage(@RequestHeader("Authorization") String jwt,
                                                    @PathVariable Long restaurantId,
                                                    @RequestParam("image")MultipartFile file
                                                    ) throws Exception {
        restaurantService.addImage(restaurantId, file);
        MessageResponse msg = new MessageResponse();
        msg.setMessage("Image added successfully");
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }
    @DeleteMapping("/{restaurantId}/delete")
    public ResponseEntity<MessageResponse> deleteImages(@RequestHeader("Authorization") String jwt,
                                                        @PathVariable Long restaurantId,
                                                        @RequestParam("ids") List<Long> imageIds
                                                        ) throws Exception {
        restaurantService.removeImages(restaurantId, imageIds);
        MessageResponse msg = new MessageResponse();
        msg.setMessage("Image removed successfully");
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }
}
