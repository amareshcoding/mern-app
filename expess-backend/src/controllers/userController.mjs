import User from '../models/userModel.mjs';

// Get user profile
export const getUserProfile = async (req, res) => {
     try {
          const user = await User.findById(req.params.id);
          if (!user) {
               return res.status(404).json({ message: 'User not found' });
          }
          res.json(user);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
};

// Update user details
export const updateUserDetails = async (req, res) => {
     try {
          const user = await User.findById(req.params.id);
          if (!user) {
               return res.status(404).json({ message: 'User not found' });
          }

          user.name = req.body.name || user.name;
          user.email = req.body.email || user.email;
          // Add other fields as necessary

          const updatedUser = await user.save();
          res.json(updatedUser);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
};

// Delete user
export const deleteUser = async (req, res) => {
     try {
          const user = await User.findById(req.params.id);
          if (!user) {
               return res.status(404).json({ message: 'User not found' });
          }

          await user.remove();
          res.json({ message: 'User deleted' });
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
};