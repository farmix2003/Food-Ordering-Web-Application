package backend.com.eatease.service;

import backend.com.eatease.entity.Extras;
import backend.com.eatease.entity.Restaurant;

import java.util.List;

public interface ExtrasService {

    Extras addExtra(Extras extras, Restaurant restaurant);
    List<Extras> getExtras(Long id);
    Extras getExtraById(Long id);
    Extras editExtra(Long id, Extras extras);
    void deleteExtras(Long extraId);
    Extras updateInStock(Long id);


}
