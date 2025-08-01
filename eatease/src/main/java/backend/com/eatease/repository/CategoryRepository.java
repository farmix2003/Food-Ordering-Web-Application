package backend.com.eatease.repository;

import backend.com.eatease.entity.Category;
import backend.com.eatease.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByRestaurantId(Long id);

    List<Category> findAllByRestaurantId(Long id);
}
