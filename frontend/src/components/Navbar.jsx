import React from "react";
import { Link, Navigate } from "react-router-dom";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { useUserStore } from "../stores/useUserStore.js";
import { useCartStore } from "../stores/useCartStore.js";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout();
    Navigate("/login");
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-40 bg-gray-900 bg-opacity-90
    backdrop-blur-md shadow-lg transition-all duration-300 border-b border-emerald-800"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link
            to={"/"}
            className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
          >
            E-commerce
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={"/"}
              className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              Home
            </Link>

            {user && (
              <Link
                to={`/cart`}
                className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-emerald-00 "
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -left-2 text-xs bg-emerald-500 text-white rounded-full px-2 py-0.5 group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link
                to={`/secret-dashboard`}
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-out"
              >
                <LogOut size={18} />
                <span className="ml-2 hidden sm:inline">Log out</span>
              </button>
            ) : (
              <>
                <Link
                  to={`/signup`}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-md  py-2 px-4 flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  <span className="ml-2 hidden sm:inline">Sign Up</span>
                </Link>
                <Link
                  to={`/login`}
                  className="bg-gray-700 hover:bg-gray-600 text-white rounded-md  py-2 px-4 flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  <span className="ml-2 hidden sm:inline">Login</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
