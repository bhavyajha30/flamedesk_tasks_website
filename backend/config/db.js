import mongoose from "mongoose";

export const connectDB = async function () {
  await mongoose
    .connect(
      "mongodb+srv://allhereatonce:taskflow7437@cluster0.q3byjrf.mongodb.net/Taskflow"
    )
    .then(() => console.log("DB CONNECTED"));
};
