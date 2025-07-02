package backend.com.eatease.request;

import backend.com.eatease.entity.Address;
import lombok.Data;


@Data
public class OrderRequest {
    private Long restaurantId;
    private Address shippingAddress;
}
