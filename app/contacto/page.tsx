import Navbar from '@/components/landing/navbar/navbar';
import Footer from '@/components/landing/footer/footer';
import { ContactForm } from '@/components/landing/contact/ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto - GADCPR',
  description: 'Ponte en contacto con nuestro equipo de soporte. Te ayudamos con problemas técnicos, configuración y consultas generales.',
  keywords: 'contacto, soporte, ayuda, consultas, GADCPR',
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
} 