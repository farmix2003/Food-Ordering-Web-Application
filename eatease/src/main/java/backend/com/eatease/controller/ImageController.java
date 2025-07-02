package backend.com.eatease.controller;

import backend.com.eatease.entity.Image;
import backend.com.eatease.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/public/images")
public class ImageController {

    @Autowired
    private ImageRepository imageRepository;

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        Optional<Image> imageOpt = imageRepository.findById(id);
        if (imageOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Image image = imageOpt.get();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + image.getFileName() + "\"")
                .body(image.getData());
    }
}
