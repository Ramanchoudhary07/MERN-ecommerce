import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  products: [],
  setProducts: (products) => set({ products }),
  loading: false,

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, response.data],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.delete(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId ? response.data : product
        ),
        loading: false,
      }));
      toast.success("Product featured status updated successfully");
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.log("Error fetching featured products:", error);
    }
  },
}));
