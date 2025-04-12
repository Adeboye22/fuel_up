// src/layouts/MainLayout.jsx
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;