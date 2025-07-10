package backend.com.eatease.response;

import lombok.Data;

@Data
public class OrderedFoodResponse {
    private Long id;
    private int quantity;
    private double totalPrice;
    private FoodResponse food;
}

