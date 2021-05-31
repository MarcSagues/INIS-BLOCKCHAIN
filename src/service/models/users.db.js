import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    dateNowClick: String,
  });
  
  export default mongoose.model("users_", userSchema);