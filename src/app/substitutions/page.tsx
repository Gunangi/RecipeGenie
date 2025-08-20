import { Header } from '@/components/header';
import { SubstitutionForm } from './substitution-form';

export default function SubstitutionPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <SubstitutionForm />
        </div>
      </main>
    </div>
  );
}