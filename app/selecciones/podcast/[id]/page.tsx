import { PodcastSelection } from '@/components/dashboard/PodcastSelection';
import NavbarUser from '@/components/dashboard/NavbarUser';

interface PodcastPageProps {
  params: {
    id: string;
  };
}

export default function PodcastPage({ params }: PodcastPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarUser />
      <PodcastSelection />
    </div>
  );
} 