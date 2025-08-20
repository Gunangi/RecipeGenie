'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getIngredientSubstitutions } from '@/lib/spoonacular';
import type { IngredientSubstitution } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';

const formSchema = z.object({
  ingredient: z.string().min(2, 'Please enter an ingredient.'),
});

type FormValues = z.infer<typeof formSchema>;

export function SubstitutionForm() {
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<IngredientSubstitution | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredient: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setResult(null);
    setError(null);
    setIsPending(true);
    try {
      const res = await getIngredientSubstitutions(values.ingredient);
      setResult(res);
    } catch (e) {
      setError('An error occurred. Please try again.');
      console.error(e);
    } finally {
        setIsPending(false);
    }
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
             <Sparkles className="w-8 h-8 text-primary" />
             <CardTitle className="font-headline text-3xl">Ingredient Substitution Finder</CardTitle>
          </div>
          <CardDescription>
            Out of an ingredient? Tell us what you need to replace, and we'll suggest some alternatives!
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="ingredient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-headline">Ingredient to Substitute</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., butter" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending} className="w-full bg-accent hover:bg-accent/90">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding Substitutions...
                  </>
                ) : (
                  'Find Substitutions'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {isPending && (
         <Card className="mt-8 text-center">
            <CardContent className="p-8">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Our genie is thinking...</p>
            </CardContent>
         </Card>
      )}

      {error && (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Substitution Suggestions</CardTitle>
            <CardDescription>{result.message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {result.substitutes.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                    {result.substitutes.map((sub, index) => (
                    <li key={index} className="capitalize">{sub}</li>
                    ))}
                </ul>
             ) : (
                <p className="text-muted-foreground">No substitutions were found for this ingredient.</p>
             )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
