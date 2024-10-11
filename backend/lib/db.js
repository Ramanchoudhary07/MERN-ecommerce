import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB is connected: ${conn}`);
  } catch (error) {
    console.log(`error connecting mongoDb`, error.message);
    process.exit(1);
  }
};

// async function updateCartItems() {
//   try {
//     const result = await mongoose.connection.db
//       .collection("users")
//       .updateMany({ cartItems: { $type: "object" } }, [
//         { $set: { cartItems: ["$cartItems"] } },
//       ]);
//     console.log(`Updated ${result.modifiedCount} documents`);
//   } catch (error) {
//     console.error("Error updating documents:", error);
//   }
// }
