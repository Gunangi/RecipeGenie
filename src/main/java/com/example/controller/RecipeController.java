package com.example.controller;

import com.example.model.Recipe;
import com.example.service.SpoonacularService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final SpoonacularService spoonacularService;

    public RecipeController(SpoonacularService spoonacularService) {
        this.spoonacularService = spoonacularService;
    }

    @PostMapping("/fetch")
    public List<Recipe> fetchAndStoreRecipes(@RequestBody List<String> ingredients) {
        return spoonacularService.getAndSaveRecipes(ingredients);
    }
}
