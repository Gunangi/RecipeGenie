import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Utensils } from 'lucide-react';
import Link from 'next/link';

const dietPlans = [
    { name: "Keto", description: "Low-carb, high-fat plans to help you stay in ketosis.", query: { diet: 'Keto' } },
    { name: "Vegan", description: "100% plant-based meal plans, rich in nutrients.", query: { diet: 'Vegan' } },
    { name: "Paleo", description: "Based on whole foods, lean proteins, and fresh vegetables.", query: { diet: 'Paleo' } },
    { name: "Gluten-Free", description: "Recipes carefully selected to exclude gluten.", query: { diet: 'Gluten-Free' } },
]

export default function DietsPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
         <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center gap-2 mb-2 justify-center">
                 <Utensils className="w-8 h-8 text-primary" />
                 <h1 className="font-headline text-4xl font-bold">Special Diet Plans</h1>
              </div>
            <p className="text-muted-foreground text-lg">
                Find curated meal plans for popular diets like Keto, Vegan, Paleo, and more.
            </p>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {dietPlans.map(plan => (
                <Link key={plan.name} href={`/recipes?${new URLSearchParams(plan.query).toString()}`}>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow h-full">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-primary font-semibold">View Plans &rarr;</p>
                        </CardContent>
                    </Card>
                 </Link>
            ))}
        </div>
      </main>
    </div>
  );
}
