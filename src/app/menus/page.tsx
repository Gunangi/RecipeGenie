import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PartyPopper } from 'lucide-react';
import Link from 'next/link';

const occasionMenus = [
    { name: "Dinner Party", description: "Impress your guests with these elegant multi-course menus.", query: { type: 'main course' } },
    { name: "Holiday Feasts", description: "Complete menus for holidays like Thanksgiving and Christmas.", query: { type: 'main course,dessert' } },
    { name: "Romantic Dinner for Two", description: "Create a special night with these intimate meal ideas.", query: { type: 'main course', number: '2' }},
    { name: "Summer BBQ", description: "Fire up the grill with these crowd-pleasing barbecue menus.", query: { cuisine: 'American', type: 'main course' } }
]

export default function MenusPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
         <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center gap-2 mb-2 justify-center">
                 <PartyPopper className="w-8 h-8 text-primary" />
                 <h1 className="font-headline text-4xl font-bold">Occasion-Based Menus</h1>
              </div>
            <p className="text-muted-foreground text-lg">
                Perfectly planned menus for your next dinner party, holiday, or special event.
            </p>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {occasionMenus.map(menu => (
                <Link key={menu.name} href={`/recipes?${new URLSearchParams(menu.query).toString()}`}>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow h-full">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{menu.name}</CardTitle>
                            <CardDescription>{menu.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-primary font-semibold">Explore Menus &rarr;</p>
                        </CardContent>
                    </Card>
                 </Link>
            ))}
        </div>
      </main>
    </div>
  );
}