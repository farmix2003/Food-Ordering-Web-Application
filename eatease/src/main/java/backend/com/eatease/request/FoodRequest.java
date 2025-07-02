package backend.com.eatease.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class FoodRequest {
    private String foodName;
    private String description;
    private Double price;

    private Long categoryId;
    private List<MultipartFile> images;

    private Long restaurantId;
    private List<Long> extrasIds;
}
