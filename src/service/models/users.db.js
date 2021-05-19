import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    wallet: String,
    amount: Number,
    creation: String,
    dateNowClick: String,
    referralLink: String,
    referralLider: String,
    referralCount: Number,
  });
  
  export default mongoose.model("users", userSchema);