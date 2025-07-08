    package backend.com.eatease.entity;

    import com.fasterxml.jackson.annotation.JsonBackReference;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.time.LocalDateTime;

    @Entity
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class Image {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String fileName;

        private String fileType;

        @Lob
        @Column(columnDefinition = "MEDIUMBLOB")
        private byte[] data;

        private String fileUrl;
        private LocalDateTime createdAt;

        @ManyToOne
        @JoinColumn(name = "restaurant_id")
        @JsonBackReference(value = "restaurant-images")
        private Restaurant restaurant;

        @ManyToOne
        @JoinColumn(name = "menu_id")
        @JsonBackReference(value = "menu-images")
        private Menu menu;
    }
