package backend.com.eatease.dto;

import backend.com.eatease.entity.Address;
import backend.com.eatease.entity.ContactInfo;
import backend.com.eatease.entity.Menu;
import backend.com.eatease.entity.Order;
import backend.com.eatease.response.ImageResponse;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RestaurantDto {
    private Long id;
    private String name;
    private String description;
    private String cuisineType;

    private boolean isOpen;
    private String openingHours;
    private String closingHours;
    private LocalDateTime registrationDate;

    private ContactInfo contactInfo;
    private Address address;

    private Long ownerId;
    private String ownerUsername;

    private List<Menu> foods;         // Directly using entity
    private List<Order> orders;       // Directly using entity
    private List<ImageResponse> images;   // For frontend display
}
