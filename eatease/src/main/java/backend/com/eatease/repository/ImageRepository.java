package backend.com.eatease.repository;

import backend.com.eatease.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    void deleteByMenuId(Long id);
}
