import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { AllProductsView } from './components/AllProductsView';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { AboutContactPage } from './components/AboutContactPage';
import { OrderTrackingSearch } from './components/OrderTrackingSearch';
import { AdminPanel } from './components/Admin/AdminPanel';
import { CartDrawer } from './components/CartDrawer';
import { NotificationsModal } from './components/NotificationsModal';
import { VideoModal } from './components/VideoModal';
import { FloatingContactButtons } from './components/FloatingContactButtons';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

const StoreContent: React.FC = () => {
  const { currentView, businessInfo, selectedProduct } = useStore();

  // Dynamic Browser Tab Title and Favicon Sync
  useEffect(() => {
    if (currentView === 'admin') {
      document.title = `Admin Portal | ${businessInfo.name}`;
    } else if (currentView === 'product-detail' && selectedProduct) {
      document.title = `${selectedProduct.name} | ${businessInfo.name}`;
    } else if (currentView === 'checkout') {
      document.title = `Express Checkout | ${businessInfo.name}`;
    } else if (currentView === 'order-confirmation') {
      document.title = `Order Receipt Confirmed | ${businessInfo.name}`;
    } else if (currentView === 'all-products') {
      document.title = `Hardware Catalog | ${businessInfo.name}`;
    } else if (currentView === 'track-order') {
      document.title = `Track Shipment | ${businessInfo.name}`;
    } else if (currentView === 'about') {
      document.title = `About Us | ${businessInfo.name}`;
    } else if (currentView === 'contact') {
      document.title = `Contact & Location | ${businessInfo.name}`;
    } else {
      document.title = `${businessInfo.name} | Professional High-Performance Electronics`;
    }
  }, [currentView, businessInfo.name, selectedProduct]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-stone-900 selection:text-white">
      {/* Top Header Announcement Bar */}
      <AnnouncementBar />

      {/* Main Customer Header Navigation (Hidden in Admin Console) */}
      {currentView !== 'admin' && <Navbar />}

      {/* Dynamic View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'all-products' && <AllProductsView />}
        {currentView === 'product-detail' && <ProductDetailPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-confirmation' && <OrderConfirmationPage />}
        {currentView === 'about' && <AboutContactPage initialSection="about" />}
        {currentView === 'contact' && <AboutContactPage initialSection="contact" />}
        {currentView === 'track-order' && <OrderTrackingSearch />}
        {currentView === 'admin' && <AdminPanel />}
      </main>

      {/* Customer Footer (Hidden in Admin Console) */}
      {currentView !== 'admin' && <Footer />}

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <NotificationsModal />
      <VideoModal />
      <FloatingContactButtons />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
