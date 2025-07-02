package backend.com.eatease.request;

import lombok.Data;

import java.util.List;

@Data
public class CartItemReq {
    private Long foodId;
    private int quantity;
    private List<Long> extrasIds;
}
