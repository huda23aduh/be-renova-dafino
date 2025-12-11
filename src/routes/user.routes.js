import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  getUserStats
} from '../controllers/user.controller.js';

const router = express.Router();

// Get all users
router.get('/', getUsers);

// Get user stats
router.get('/stats', getUserStats);

// Get single user
router.get('/:id', getUserById);

// Create new user
router.post('/', createUser);

// Update user
router.put('/:id', updateUser);

// Update user password
router.put('/:id/password', updateUserPassword);

// Delete user
router.delete('/:id', deleteUser);

export default router;