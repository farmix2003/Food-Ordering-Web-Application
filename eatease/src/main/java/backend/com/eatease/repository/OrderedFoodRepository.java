package backend.com.eatease.repository;

import backend.com.eatease.entity.OrderedFood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderedFoodRepository extends JpaRepository<OrderedFood, Long> {
    void deleteByFoodId(Long foodId);
}
