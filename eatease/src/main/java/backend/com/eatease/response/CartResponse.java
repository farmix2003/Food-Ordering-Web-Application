package backend.com.eatease.response;

import lombok.Data;

import java.util.List;

@Data
public class CartResponse {
    private Long cartId;
    private Long total;
    private List<CartItemResponse> items;
}
