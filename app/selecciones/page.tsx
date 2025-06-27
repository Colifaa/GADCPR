import { PodcastSelection } from '@/components/dashboard/PodcastSelection';
import NavbarUser from '@/components/dashboard/NavbarUser';

export default function SeleccionesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarUser />
      <PodcastSelection />
    </div>
  );
} 