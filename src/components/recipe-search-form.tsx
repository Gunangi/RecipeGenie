
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, X, ChefHat, Salad, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from './ui/badge';
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"


const cuisines = ['Italian', 'Mexican', 'American', 'Chinese', 'Indian', 'French', 'Japanese', 'Thai', 'Spanish', 'Greek', 'Middle Eastern', 'Korean', 'Vietnamese', 'Mediterranean', 'Caribbean', 'German', 'British'];
const diets = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo'];
const mealTypes = ['main course', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert'];


export function RecipeSearchForm() {
  const [query, setQuery] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['Tomatoes', 'Chicken']);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [activeTab, setActiveTab] = useState('name');
  const { toast } = useToast();
  const router = useRouter();

  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);

  const handleCheckboxChange = (
    value: string,
    checked: boolean | 'indeterminate',
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(prev =>
      checked
        ? [...prev, value]
        : prev.filter(item => item !== value)
    );
  };


  const handleAddIngredient = () => {
    const trimmedIngredient = currentIngredient.trim();
    if (trimmedIngredient && !ingredients.map(i => i.toLowerCase()).includes(trimmedIngredient.toLowerCase())) {
      setIngredients([...ingredients, trimmedIngredient]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
  };
  
  const handleSearch = () => {
    if (activeTab === 'name' && !query.trim()) {
        toast({
            title: "No Search Criteria",
            description: "Please enter a recipe name to search.",
            variant: "destructive"
        });
        return;
    }
     if (activeTab === 'ingredients' && ingredients.length === 0) {
        toast({
            title: "No Ingredients",
            description: "Please add some ingredients to search.",
            variant: "destructive"
        });
        return;
    }

    const params = new URLSearchParams();
    if (activeTab === 'name') {
        if (query) params.set('query', query);
    } else { // activeTab is 'ingredients'
        if (ingredients.length > 0) {
            params.set('includeIngredients', ingredients.join(','));
        }
        if (selectedCuisines.length > 0) {
            params.set('cuisine', selectedCuisines.join(','));
        }
        if (selectedDiets.length > 0) {
            params.set('diet', selectedDiets.join(','));
        }
        if (selectedMealTypes.length > 0) {
            params.set('type', selectedMealTypes.join(','));
        }
    }
    
    router.push(`/recipes?${params.toString()}`);
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Search className="w-6 h-6 text-primary" />
          Find Your Perfect Recipe
        </CardTitle>
        <CardDescription>
            Have some ingredients but not sure what to make? Or looking for a specific dish? Let the genie find recipes for you!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="name" className="w-full" onValueChange={(value) => {
            setActiveTab(value);
            if (value === 'name') {
                setIngredients([]);
                setSelectedCuisines([]);
                setSelectedDiets([]);
                setSelectedMealTypes([]);
            } else {
                setQuery('');
            }
        }}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="name">
                    <ChefHat className="mr-2 h-4 w-4" />
                    By Recipe Name
                </TabsTrigger>
                <TabsTrigger value="ingredients">
                    <Salad className="mr-2 h-4 w-4" />
                    By Ingredients
                </TabsTrigger>
            </TabsList>
            <TabsContent value="name" className="pt-4">
                <div className="flex gap-2">
                    <Input
                    type="text"
                    placeholder="e.g., 'Pasta Carbonara'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleSearch(); }}}
                    className="flex-grow"
                    />
                </div>
            </TabsContent>
            <TabsContent value="ingredients" className="pt-4 space-y-4">
                 <div className="flex gap-2">
                    <Input
                    type="text"
                    placeholder="Add an ingredient and press Enter..."
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddIngredient(); }}}
                    className="flex-grow"
                    />
                    <Button onClick={handleAddIngredient} size="icon" className="bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2.5rem] bg-muted/50 p-2 rounded-md border">
                    {ingredients.map(ingredient => (
                    <Badge key={ingredient} variant="secondary" className="text-lg py-1 px-3">
                        {ingredient}
                        <button onClick={() => handleRemoveIngredient(ingredient)} className="ml-2 text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                        </button>
                    </Badge>
                    ))}
                    {ingredients.length === 0 && (
                    <span className="text-sm text-muted-foreground self-center px-2">Add some ingredients to get started!</span>
                    )}
                </div>

                <Accordion type="multiple" className="w-full">
                    <AccordionItem value="filters">
                         <AccordionTrigger>
                            <div className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-primary" />
                                <span className="font-headline">Advanced Filters</span>
                            </div>
                         </AccordionTrigger>
                         <AccordionContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            <div className="space-y-2">
                                <Label className="font-semibold">Cuisine</Label>
                                {cuisines.slice(0, 5).map((cuisine) => (
                                    <div key={cuisine} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`form-cuisine-${cuisine}`}
                                        onCheckedChange={(checked) => handleCheckboxChange(cuisine, checked, setSelectedCuisines)}
                                    />
                                    <Label htmlFor={`form-cuisine-${cuisine}`} className="font-normal">{cuisine}</Label>
                                    </div>
                                ))}
                            </div>
                             <div className="space-y-2">
                                <Label className="font-semibold">Diet</Label>
                                {diets.map((diet) => (
                                    <div key={diet} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`form-diet-${diet}`} 
                                        onCheckedChange={(checked) => handleCheckboxChange(diet, checked, setSelectedDiets)}
                                    />
                                    <Label htmlFor={`form-diet-${diet}`} className="font-normal">{diet}</Label>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold">Meal Type</Label>
                                {mealTypes.map((type) => (
                                    <div key={type} className="flex items-center space-x-2 capitalize">
                                    <Checkbox 
                                        id={`form-meal-${type}`} 
                                        onCheckedChange={(checked) => handleCheckboxChange(type, checked, setSelectedMealTypes)}
                                    />
                                    <Label htmlFor={`form-meal-${type}`} className="font-normal">{type}</Label>
                                    </div>
                                ))}
                            </div>
                         </AccordionContent>
                    </AccordionItem>
                </Accordion>


            </TabsContent>
        </Tabs>
        <div className="flex gap-2 justify-end mt-6">
            <Button onClick={handleSearch} className="bg-accent hover:bg-accent/90 w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" /> Search Recipes
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
