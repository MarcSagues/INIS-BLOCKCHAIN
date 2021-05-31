import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    wallet: String,
    amount: Number,
    referralLink: String,
    referralLider: String,
    referralCount: Number,
    creation: String,
  });
  
  export default mongoose.model("users", userSchema);