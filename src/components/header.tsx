import Link from 'next/link';
import { Sparkles, Calendar, Utensils, PartyPopper, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"


export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex h-20 items-center justify-between p-4 md:p-8">
        <Link href="/" className="flex items-center gap-3">
          <h1 className="text-3xl font-bold font-headline text-foreground tracking-tight">
            RecipeGenie
          </h1>
        </Link>
        <nav className="flex items-center gap-1">
           <Button asChild variant="ghost">
            <Link href="/">Recipes</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/favorites">
              <Heart className="mr-2 h-4 w-4 text-accent" />
              Favorites
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/planner">
              <Calendar className="mr-2 h-4 w-4 text-accent" />
              Meal Planner
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">More</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/diets">
                  <Utensils className="mr-2 h-4 w-4 text-accent" />
                  Special Diets
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href="/menus">
                    <PartyPopper className="mr-2 h-4 w-4 text-accent" />
                    Occasion Menus
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                 <Link href="/substitutions">
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                    Substitutions
                 </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}


