package backend.com.eatease.controller;

import backend.com.eatease.entity.Extras;
import backend.com.eatease.entity.Restaurant;
import backend.com.eatease.response.MessageResponse;
import backend.com.eatease.service.ExtrasService;
import backend.com.eatease.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/extras")
public class ExtrasAdminController {

    @Autowired
    private ExtrasService extrasService;

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping("/{restaurantId}/add")
    public ResponseEntity<Extras> addExtra(@RequestHeader("Authorization") String jwt,
                                           @RequestBody Extras extras,
                                           @PathVariable Long restaurantId
                                           ) throws Exception {
        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
        Extras newExtra = extrasService.addExtra(extras, restaurant);

        return new ResponseEntity<>(newExtra, HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    public ResponseEntity<List<Extras>> getExtras(@PathVariable Long id){

        List<Extras> extras = extrasService.getExtras(id);

        return new ResponseEntity<>(extras, HttpStatus.OK);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Extras> updateExtra(@RequestHeader("Authorization")String jwt,
                                              @PathVariable Long id,
                                              @RequestBody Extras extras
                                              ){
        Extras updatedExtra = extrasService.editExtra(id, extras);
        return ResponseEntity.ok().body(updatedExtra);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<MessageResponse> deleteExtra(@RequestHeader("Authorization") String jwt,
                                                       @PathVariable Long id
                                                       ){
        extrasService.deleteExtras(id);
        MessageResponse msg = new MessageResponse();
        msg.setMessage("Extra deleted successfully");
        return ResponseEntity.ok().body(msg);
    }

}
