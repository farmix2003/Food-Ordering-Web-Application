package backend.com.eatease.service;


import backend.com.eatease.entity.Category;
import backend.com.eatease.entity.Restaurant;

import java.util.List;

public interface CategoryService {

    Category addCategory(Category category, Restaurant restaurant);
    List<Category> getCategoriesByRestaurantId(Long id);
    Category editCategory(Long id, Category category);
    void deleteCategory(Long id);

}
