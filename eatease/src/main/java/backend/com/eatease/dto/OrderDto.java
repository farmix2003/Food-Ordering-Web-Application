package backend.com.eatease.dto;


import backend.com.eatease.entity.User;
import backend.com.eatease.response.OrderedFoodResponse;
import backend.com.eatease.response.RestaurantSimpleResponse;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class OrderDto {
    private Long id;
    private String orderStatus;
    private Date createdAt;
    private double totalPrice;
    private int totalOfOrder;
    private User user;
    private RestaurantSimpleResponse restaurant;
    private List<OrderedFoodResponse> orderedFoodList;
}
