'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import Label from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "./ui/button";
import { Filter } from "lucide-react";

const cuisines = ['Italian', 'Mexican', 'American', 'Chinese', 'Indian', 'French', 'Japanese', 'Thai', 'Spanish', 'Greek', 'Middle Eastern', 'Korean', 'Vietnamese', 'Mediterranean', 'Caribbean', 'German', 'British'];
const diets = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo'];
const mealTypes = ['main course', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert'];

export function RecipeFilters() {
  const router = useRouter();
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [cookingTime, setCookingTime] = useState(60);
  const [difficulty, setDifficulty] = useState('all');

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (selectedCuisines.length > 0) {
        params.set('cuisine', selectedCuisines.join(','));
    }
    if (selectedDiets.length > 0) {
        params.set('diet', selectedDiets.join(','));
    }
    if (selectedMealTypes.length > 0) {
        params.set('type', selectedMealTypes.join(','));
    }
    params.set('maxReadyTime', String(cookingTime));

    if(difficulty !== 'all') {
        // This is a client-side filter as Spoonacular doesn't directly support difficulty
        params.set('difficulty', difficulty);
    }
    
    router.push(`/recipes?${params.toString()}`);
  };

  const handleCuisineChange = (cuisine: string, checked: boolean | 'indeterminate') => {
    setSelectedCuisines(prev => 
      checked
        ? [...prev, cuisine] 
        : prev.filter(c => c !== cuisine)
    );
  };

  const handleDietChange = (diet: string, checked: boolean | 'indeterminate') => {
    setSelectedDiets(prev => 
      checked
        ? [...prev, diet]
        : prev.filter(d => d !== diet)
    );
  };

  const handleMealTypeChange = (type: string, checked: boolean | 'indeterminate') => {
    setSelectedMealTypes(prev =>
      checked
        ? [...prev, type]
        : prev.filter(t => t !== type)
    );
  };


  return (
    <Card className="shadow-none border-none">
      <CardHeader className="p-0">
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Filter className="h-6 w-6 text-primary"/>
            <span>Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <Accordion type="multiple" defaultValue={['cuisine', 'diet']} className="w-full">
          <AccordionItem value="cuisine">
            <AccordionTrigger className="font-headline">Cuisine</AccordionTrigger>
            <AccordionContent className="space-y-2">
              {cuisines.map((cuisine) => (
                <div key={cuisine} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cuisine-${cuisine}`}
                    onCheckedChange={(checked) => handleCuisineChange(cuisine, checked)}
                   />
                  <Label htmlFor={`cuisine-${cuisine}`}>{cuisine}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="diet">
            <AccordionTrigger className="font-headline">Diet</AccordionTrigger>
            <AccordionContent className="space-y-2">
              {diets.map((diet) => (
                <div key={diet} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`diet-${diet}`} 
                    onCheckedChange={(checked) => handleDietChange(diet, checked)}
                  />
                  <Label htmlFor={`diet-${diet}`}>{diet}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="meal-type">
            <AccordionTrigger className="font-headline">Meal Type</AccordionTrigger>
            <AccordionContent className="space-y-2">
              {mealTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2 capitalize">
                  <Checkbox 
                    id={`meal-${type}`} 
                    onCheckedChange={(checked) => handleMealTypeChange(type, checked)}
                  />
                  <Label htmlFor={`meal-${type}`}>{type}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="time">
            <AccordionTrigger className="font-headline">Cooking Time</AccordionTrigger>
            <AccordionContent className="p-2">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>10 min</span>
                <span>{cookingTime} min</span>
              </div>
              <Slider 
                defaultValue={[60]} 
                max={120} min={10} 
                step={5}
                onValueChange={(value) => setCookingTime(value[0])}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="difficulty">
            <AccordionTrigger className="font-headline">Difficulty</AccordionTrigger>
            <AccordionContent>
              <RadioGroup 
                defaultValue="all" 
                className="space-y-2"
                onValueChange={setDifficulty}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="r-all" />
                  <Label htmlFor="r-all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="r-easy" />
                  <Label htmlFor="r-easy">Easy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="r-medium" />
                  <Label htmlFor="r-medium">Medium</Label>
                </div>
                 <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="r-hard" />
                  <Label htmlFor="r-hard">Hard</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button className="w-full mt-6 bg-primary hover:bg-primary/90" onClick={handleApplyFilters}>Apply Filters</Button>
      </CardContent>
    </Card>
  );
}
