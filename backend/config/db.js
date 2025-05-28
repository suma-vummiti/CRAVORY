import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sumavummiti:29suma@cluster0.nzvlegp.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}