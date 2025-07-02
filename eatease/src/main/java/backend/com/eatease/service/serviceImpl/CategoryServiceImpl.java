package backend.com.eatease.service.serviceImpl;


import backend.com.eatease.entity.Category;
import backend.com.eatease.entity.Restaurant;
import backend.com.eatease.repository.CategoryRepository;
import backend.com.eatease.service.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    @Transactional
    public Category addCategory(Category category, Restaurant restaurant) {

        Category newCategory = new Category();
        newCategory.setCategoryName(category.getCategoryName());
        newCategory.setRestaurant(restaurant);

        return categoryRepository.save(newCategory);
    }

    @Override
    @Transactional
    public List<Category> getCategoriesByRestaurantId(Long id) {
        return categoryRepository.findByRestaurantId(id);
    }

    @Override
    @Transactional
    public Category editCategory(Long id, Category category) {

        Category updatedCategory = categoryRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Category not found with id "+id)
        );
        updatedCategory.setCategoryName(category.getCategoryName());

        return categoryRepository.save(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        if(!categoryRepository.existsById(id)){
            throw new RuntimeException("Entity not found");
        }
      categoryRepository.deleteById(id);
    }
}
