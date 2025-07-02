package backend.com.eatease.service;

import org.springframework.stereotype.Service;

@Service
public class ImageService {

    private static final String BASE_URL = "http://localhost:8080/api/public/image/view";

    public static String generateURL(Long id){
        return BASE_URL + "/"+id;
    }
}
