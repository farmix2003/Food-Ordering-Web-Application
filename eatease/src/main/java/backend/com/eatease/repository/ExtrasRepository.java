package backend.com.eatease.repository;

import backend.com.eatease.entity.Extras;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExtrasRepository extends JpaRepository<Extras, Long>{
 List<Extras> findByRestaurantId(Long id);

    List<Extras> findAllByRestaurantId(Long id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM menu_extras_list WHERE extras_list_id = :extrasId", nativeQuery = true)
    void deleteFromMenuExtrasList(@Param("extrasId") Long extrasId);
}
