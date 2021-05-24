import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    wallet: String,
    amount: Number,
    creation: String,
  });
  
  export default mongoose.model("users_inis_ecosystem", userSchema);