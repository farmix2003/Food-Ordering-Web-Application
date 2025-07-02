package backend.com.eatease.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class ContactInfo {

    private String email;
    private String phone;
    private String whatsApp;
    private String instagram;
}