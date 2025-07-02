package backend.com.eatease.controller;

import backend.com.eatease.entity.Category;
import backend.com.eatease.entity.Restaurant;
import backend.com.eatease.response.MessageResponse;
import backend.com.eatease.service.CategoryService;
import backend.com.eatease.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping("/{id}/add")
    public ResponseEntity<Category> addCategory(@RequestHeader("Authorization")String jwt,
                                                @PathVariable Long id,
                                                @RequestBody Category category
                                                ) throws Exception {
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        Category newCategory = categoryService.addCategory(category, restaurant);
        return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<Category>> getCategoriesByRestaurantId(@RequestHeader("Authorization")String jwt,
                                                                      @PathVariable Long id
                                                                      ){
        List<Category> categories = categoryService.getCategoriesByRestaurantId(id);
        return ResponseEntity.ok().body(categories);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Category> editCategory(@RequestHeader("Authorization")String jwt,
                                                 @PathVariable Long id,
                                                 @RequestBody Category category
                                                 ){
        Category updatedCategory = categoryService.editCategory(id, category);
        return ResponseEntity.ok().body(updatedCategory);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<MessageResponse> deleteCategory(@RequestHeader("Authorization")String jwt,
                                                          @PathVariable Long id
                                                          ){
        categoryService.deleteCategory(id);
        MessageResponse msg = new MessageResponse();
        msg.setMessage("Category deleted successfully");
        return ResponseEntity.ok().body(msg);
    }

}
