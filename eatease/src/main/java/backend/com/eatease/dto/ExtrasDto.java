package backend.com.eatease.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

public class ExtrasDto {

    private Long id;
    private String name;
    private double price;

    public ExtrasDto(Long id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}
