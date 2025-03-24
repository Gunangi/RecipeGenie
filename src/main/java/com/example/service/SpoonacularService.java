package com.example.service;

import com.example.model.Recipe;
import com.example.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SpoonacularService {
    private final RestTemplate restTemplate;
    private final RecipeRepository recipeRepository;

    public SpoonacularService(RestTemplate restTemplate, RecipeRepository recipeRepository) {
        this.restTemplate = restTemplate;
        this.recipeRepository = recipeRepository;
    }

    public List<Recipe> getAndSaveRecipes(List<String> ingredients) {
        String url = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" + String.join(",", ingredients) + "&number=5&apiKey=YOUR_API_KEY";

        URI uri = UriComponentsBuilder.fromHttpUrl(url).build().toUri();
        Map<String, Object>[] responseArray = restTemplate.getForObject(uri, Map[].class);
        List<Map<String, Object>> response = responseArray != null ? Arrays.asList(responseArray) : new ArrayList<>();

        List<Recipe> recipes = response.stream().map(data -> {
            Recipe recipe = new Recipe();
            recipe.setTitle((String) data.get("title"));
            recipe.setImage((String) data.get("image"));

            // Used Ingredients
            Object usedIngredientsObj = data.get("usedIngredients");
            List<String> usedIngredients = new ArrayList<>();
            if (usedIngredientsObj instanceof List<?>) {
                usedIngredients = ((List<?>) usedIngredientsObj).stream()
                        .filter(Map.class::isInstance)
                        .map(i -> ((Map<String, Object>) i).get("name").toString())
                        .collect(Collectors.toList());
            }
            recipe.setUsedIngredients(usedIngredients);

            // Missed Ingredients
            Object missedIngredientsObj = data.get("missedIngredients");
            List<String> missedIngredients = new ArrayList<>();
            if (missedIngredientsObj instanceof List<?>) {
                missedIngredients = ((List<?>) missedIngredientsObj).stream()
                        .filter(Map.class::isInstance)
                        .map(i -> ((Map<String, Object>) i).get("name").toString())
                        .collect(Collectors.toList());
            }
            recipe.setMissedIngredients(missedIngredients);

            return recipe;
        }).collect(Collectors.toList());

        return recipeRepository.saveAll(recipes);
    }
}
