package backend.com.eatease.controller;

import backend.com.eatease.dto.RestaurantDto;
import backend.com.eatease.entity.Restaurant;
import backend.com.eatease.entity.User;
import backend.com.eatease.service.RestaurantService;
import backend.com.eatease.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<List<RestaurantDto>> getAllRestaurants() throws Exception {
        return new ResponseEntity<>(restaurantService.getAllRestaurants(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDto> getRestaurantById(@PathVariable Long id,
                                                        @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(restaurantService.viewRestaurantById(id), HttpStatus.OK);
    }



    @PutMapping("/add-favourites/{id}")
    public ResponseEntity<RestaurantDto> addToFavourites(@PathVariable Long id,
                                                         @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        RestaurantDto restaurantDto = restaurantService.addToFavourites(id, user);
        return new ResponseEntity<>(restaurantDto, HttpStatus.OK);
    }

}
