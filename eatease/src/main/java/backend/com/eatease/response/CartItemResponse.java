package backend.com.eatease.response;

import backend.com.eatease.dto.ExtrasDto;
import lombok.Data;

import java.util.List;

@Data
public class CartItemResponse {
    private Long id;
    private String foodName;
    private ImageResponse image;
    private int quantity;
    private double pricePerUnit;
    private double totalPrice;
    private Long restaurantId;
    private List<ExtrasDto> extras;
}
