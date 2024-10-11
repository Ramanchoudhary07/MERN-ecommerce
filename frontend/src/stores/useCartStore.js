import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subTotal: 0,
  isCouponApplied: false,

  getCartitems: async () => {
    try {
      const response = await axios.get(`/cart`);
      console.log("cart item:", response.data);
      set({ cart: response.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message || "An error occured");
    }
  },

  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subTotal: 0 });
  },

  addToCart: async (product) => {
    try {
      const response = await axios.post(`/cart`, { productId: product._id });
      toast.success("Product added to cart");
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.error || "An error occured");
    }
  },

  removeFromCart: async (productId) => {
    try {
      const response = await axios.delete(`/cart`, { productId });
      toast.success("Product removed from cart");
      set((prevState) => {
        const newCart = prevState.cart.filter((item) => item._id !== productId);
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.error || "An error occured");
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      if (quantity === 0) {
        get().removeFromCart(productId);
        return;
      } else {
        const response = await axios.put(`/cart/${productId}`, { quantity });
        set((prevState) => {
          const newCart = prevState.cart.map((item) =>
            item._id === productId ? { ...item, quantity: quantity } : item
          );
          return { cart: newCart };
        });
        get().calculateTotals();
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.message || "An error occured");
    }
  },

  getMyCoupon: async () => {
    try {
      const response = await axios.get(`/coupons`);
      set({ coupon: response.data });
    } catch (error) {
      console.log("Error fetching coupons:", error);
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axios.post(`/coupons/validate`, { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied");
    } catch (error) {
      console.log("Error applying coupon:", error);
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },

  removeCoupon: async () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subTotal;
    if (coupon) {
      const discount = (subTotal * coupon.discount) / 100;
      total = subTotal - discount;
    }
    set({ total, subTotal });
  },
}));
