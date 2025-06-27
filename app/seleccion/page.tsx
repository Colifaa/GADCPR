import { ContentGeneratorAdvanced } from '../../components/dashboard/ContentGeneratorAdvanced';
import NavbarUser from '@/components/dashboard/NavbarUser';

export default function SeleccionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarUser />
      <ContentGeneratorAdvanced />
    </div>
  );
} 