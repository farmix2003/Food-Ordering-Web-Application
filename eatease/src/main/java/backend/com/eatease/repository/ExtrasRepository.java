package backend.com.eatease.repository;

import backend.com.eatease.entity.Extras;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExtrasRepository extends JpaRepository<Extras, Long>{
 List<Extras> findByRestaurantId(Long id);

    List<Extras> findAllByRestaurantId(Long id);
}
