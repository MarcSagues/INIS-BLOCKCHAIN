import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: String,
    dateNowClick: String,
    referralLink: String,
    referralLider: String,
    referralCount: Number,
  });
  
  export default mongoose.model("users", userSchema);