import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  businessName: String,
  email: String,
  password: String,
  confirmPassword: String
});

const User = mongoose.model('User', userSchema);
export default User;
