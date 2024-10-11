import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useUserStore } from "./stores/useUserStore.js";
import { useCartStore } from "./stores/useCartStore.js";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage.jsx";
import PurchaseCancelPage from "./pages/PurchaseCancelPage.jsx";

import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartitems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
    getCartitems();
  }, [getCartitems, user]);

  if (checkingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className="bg-gray-900 min-h-screen text-white overflow-y-auto
    relative"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-1/2 w-full h-full
          bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)] 
          -translate-x-1/2"
          />
        </div>
      </div>

      <div className="absolute z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to={`/`} />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to={`/`} />}
          />
          <Route
            path="/secret-dashboard"
            element={
              user?.role === "admin" ? (
                <AdminPage />
              ) : (
                <Navigate to={`/login`} />
              )
            }
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to={`/login`} />}
          />
          <Route
            path="/purchase-success"
            element={
              user ? <PurchaseSuccessPage /> : <Navigate to={`/login`} />
            }
          />
          <Route
            path="/purchase-cancel"
            element={user ? <PurchaseCancelPage /> : <Navigate to={`/login`} />}
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;