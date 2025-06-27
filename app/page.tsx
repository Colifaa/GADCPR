import Navbar from '@/components/landing/navbar/navbar';
import Footer from '@/components/landing/footer/footer';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center w-full space-y-12 py-8 mb-40">
        <Image
          src="/images/landing/landing.png"
          alt="Landing 1"
          width={1200}
          height={800}
          className="mx-auto mb-40"
        />
        <Image
          src="/images/landing/landing2.png"
          alt="Landing 2"
          width={1200}
          height={800}
          className="mx-auto mb-40"
        />
        <Image
          src="/images/landing/landing3.png"
          alt="Landing 3"
          width={1200}
          height={800}
          className="mx-auto mb-40"
        />
        <Image
          src="/images/landing/landing4.png"
          alt="Landing 4"
          width={1200}
          height={800}
          className="mx-auto mb-40"
        />
        <Image
          src="/images/landing/landing5.png"
          alt="Landing 5"
          width={1200}
          height={800}
          className="mx-auto"
        />
      </main>
      <Footer />
    </div>
  );
}