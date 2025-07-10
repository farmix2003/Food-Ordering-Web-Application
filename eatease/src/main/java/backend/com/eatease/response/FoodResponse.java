package backend.com.eatease.response;

import backend.com.eatease.dto.ExtrasDto;
import lombok.Data;

import java.util.List;

@Data
public class FoodResponse {

    private Long id;

    private List<ExtrasDto> extrasList;

    private String foodName;

    private List<ImageResponse> imagesList;
    private double price;
}
