package backend.com.eatease.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String streetName;

    private String apartment;

    @Column(nullable = false)
    private String cityName;

}