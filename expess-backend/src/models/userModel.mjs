import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Address Schema
 * @typedef {Object} Address
 * @property {string} street - The street of the address.
 * @property {string} city - The city of the address.
 * @property {string} state - The state of the address.
 * @property {string} zip - The zip code of the address.
 */
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

/**
 * User Schema
 * @typedef {Object} User
 * @property {string} firstName - The first name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {string} email - The email address of the user. Must be unique.
 * @property {string} mobile - The mobile number of the user. Must be unique.
 * @property {Address[]} addresses - The addresses of the user.
 * @property {string} password - The hashed password of the user.
 * @property {string} deviceType - The type of device used for login.
 * @property {Date} lastLogin - The date and time of the last login.
 */

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
    lastLogin: {
      type: Date,
      required: false,
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

/**
 * Mongoose model for User.
 * @typedef {mongoose.Model<User>} UserModel
 */

const User = mongoose.model('User', userSchema);

export default User;
