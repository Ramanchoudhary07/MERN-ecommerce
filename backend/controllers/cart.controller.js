import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const user = req.user;
    const products = await Product.find({
      _id: { $in: user.cartItems.map((item) => item.product) },
    });
    const cartItems = products.map((product) => {
      const item = user.cartItems.find(
        (cartItem) => cartItem.product?.toString() === product._id.toString()
      );
      return {
        ...product.toJSON(),
        quantity: item.quantity,
      };
    });

    res.json(cartItems);
  } catch (error) {
    console.log("error in getCartProducts", error);
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log("productId: ", productId);
    const user = req.user;
    const existingItems = user.cartItems.find(
      (item) => item.product?.toString() === productId
    );
    if (existingItems) {
      existingItems.quantity += 1;
    } else {
      user.cartItems.push({ product: productId });
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("error in addToCart", error);
    res.status(500).json({ error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("error in removeAllFromCart", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const user = req.user;
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const existingItem = user.cartItems.find(
      (item) => item.product?.toString() === productId
    );
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      return res.status(400).json({ message: "product not found" });
    }
  } catch (error) {
    console.log("error in updating quantity", error);
    res.status(500).json({ message: error.message });
  }
};
