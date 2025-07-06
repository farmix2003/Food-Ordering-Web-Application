package backend.com.eatease.repository;

import backend.com.eatease.entity.Menu;
import backend.com.eatease.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    @Query("SELECT f FROM Menu f WHERE f.foodName LIKE CONCAT('%', :keyword, '%') " +
            "OR f.category.categoryName LIKE CONCAT('%', :keyword, '%')")
    List<Menu> searchFood(@Param("keyword") String keyword);

    List<Menu> findByRestaurantId(Long restaurantId);

    List<Menu> findAllByRestaurantId(Long id);
}
