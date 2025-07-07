package backend.com.eatease.request;

import lombok.Data;

import java.util.List;

@Data
public class UpdateTextBasedMenuItemRequest {
    private String foodName;
    private String description;
    private Double price;
    private Long categoryId;
    private List<Long> extrasIds;
    private boolean available;
}
