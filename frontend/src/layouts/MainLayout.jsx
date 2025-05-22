// src/layouts/MainLayout.jsx
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import Navbar from '@/components/navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Suspense>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;