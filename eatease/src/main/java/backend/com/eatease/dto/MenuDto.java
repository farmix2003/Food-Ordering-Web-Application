package backend.com.eatease.dto;

import backend.com.eatease.response.ImageResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuDto {
        private Long id;
        private String foodName;
        private String description;
        private Double price;
        private boolean available;
        private String categoryName;
        private List<ImageResponse> images;
        private List<ExtrasDto> extrasList;
        private Long restaurantId;

    public MenuDto(Long id, String foodName, String description, Double price, boolean available, String s, List<ImageResponse> imageUrls, List<ExtrasDto> extraDtos, Long restaurantId, Object o) {
    }
}

