package backend.com.eatease.service;

import backend.com.eatease.dto.RestaurantDto;
import backend.com.eatease.entity.Restaurant;
import backend.com.eatease.entity.User;
import backend.com.eatease.request.RestaurantRequest;
import backend.com.eatease.request.UpdateTextBasedRestaurantRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RestaurantService {

    Restaurant createRestaurant(RestaurantRequest restaurant, User user) throws Exception;

    Restaurant updateRestaurant(Long id, UpdateTextBasedRestaurantRequest restaurant) throws Exception;

    Restaurant getRestaurantById(Long id) throws Exception;

    List<RestaurantDto> getAllRestaurants() throws Exception;

    void deleteRestaurant(Long id) throws Exception;

    List<Restaurant> searchRestaurants(String keyword) throws Exception;

    RestaurantDto getRestaurantByUserId(Long id) throws Exception;

    RestaurantDto addToFavourites(Long id, User user) throws Exception;

    Restaurant updateRestaurantStatus(Long id) throws Exception;

    void removeImages(Long restaurantId, List<Long> imageIds) throws Exception;

    void addImage(Long restaurantId, MultipartFile image) throws Exception;
}
