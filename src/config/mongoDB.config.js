import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    mongoose.connect(
      "mongodb+srv://julitorb96:Y8nINGpQhMwjgmIF@proyectofinal.ref4y.mongodb.net/ecommerce"
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};
