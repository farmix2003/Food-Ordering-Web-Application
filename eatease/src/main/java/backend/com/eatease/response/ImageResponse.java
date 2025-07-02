package backend.com.eatease.response;

import lombok.Data;

@Data
public class ImageResponse {
    private Long id;
    private String fileName;
    private String url;
    // getters, setters
}
