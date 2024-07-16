import Footer from '@/components/core/Footer';
import Navbar from '@/components/core/Navbar';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
