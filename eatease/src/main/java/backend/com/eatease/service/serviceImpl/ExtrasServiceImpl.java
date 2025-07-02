package backend.com.eatease.service.serviceImpl;

import backend.com.eatease.entity.Extras;
import backend.com.eatease.entity.Restaurant;
import backend.com.eatease.repository.ExtrasRepository;
import backend.com.eatease.service.ExtrasService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExtrasServiceImpl implements ExtrasService {

    @Autowired
    private ExtrasRepository extrasRepository;

    @Override
    @Transactional
    public Extras addExtra(Extras extras, Restaurant restaurant) {

        Extras newExtra = new Extras();
        newExtra.setRestaurant(restaurant);
        newExtra.setName(extras.getName());
        newExtra.setInStock(true);
        newExtra.setPrice(extras.getPrice());

        return extrasRepository.save(newExtra);
    }

    @Override
    @Transactional
    public List<Extras> getExtras(Long id) {
        return extrasRepository.findByRestaurantId(id);
    }

    @Override
    @Transactional
    public Extras getExtraById(Long id) {
        return extrasRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Extra not found with id "+id));
    }

    @Override
    @Transactional
    public Extras editExtra(Long id, Extras extras) {

        Extras updatedExtra = getExtraById(id);
        updatedExtra.setInStock(extras.isInStock());
        updatedExtra.setName(extras.getName());
        updatedExtra.setPrice(extras.getPrice());

        return extrasRepository.save(updatedExtra);
    }

    @Override
    @Transactional
    public void deleteExtras(Long extraId) {
       extrasRepository.deleteById(extraId);
    }

    @Override
    public Extras updateInStock(Long id) {
        return null;
    }
}
