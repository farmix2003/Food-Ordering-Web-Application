package backend.com.eatease.response;

import lombok.Data;

@Data
public class RestaurantSimpleResponse {
    private Long id;
    private String name;
    private String cuisineType;
    private String openingHours;
    private String closingHours;
}

