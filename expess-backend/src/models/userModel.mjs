import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Address Schema
const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zip: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    profileImage: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    addresses: {
      type: [addressSchema],
      required: false,
    },
    role: {
      // User Roles and Permissions
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER',
    },
    deviceType: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save hook to hash the password before saving the user document.
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Function to verify the password using bcrypt compare method
userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Mongoose model for User.
const User = mongoose.model('User', userSchema);

export default User;
