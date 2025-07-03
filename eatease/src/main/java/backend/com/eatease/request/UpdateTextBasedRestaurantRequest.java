package backend.com.eatease.request;

import backend.com.eatease.entity.Address;
import backend.com.eatease.entity.ContactInfo;
import lombok.Data;

@Data
public class UpdateTextBasedRestaurantRequest {

    private String name;
    private String description;
    private String cuisineType;
    private Address address;
    private ContactInfo contactInfo;
    private String openingHours;
    private String closingHours;
}
