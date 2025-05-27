import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { auth, requireAdmin } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Register a new user
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Das Passwort muss mindestens 6 Zeichen lang sein'),
    body('name').notEmpty().withMessage('Name ist erforderlich'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, role } = req.body;

      // Prüfen, ob Benutzer bereits existiert
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Benutzer existiert bereits' });
      }

      // Neuen Benutzer erstellen
      const user = new User({
        email,
        password,
        name,
        role: role || 'user',
      });

      await user.save();

      // Token generieren
      const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET || 'your-secret-key',
        {
          expiresIn: '7d',
        }
      );

      res.status(201).json({ user, token });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server-Fehler' });
    }
  }
);

// Create admin user
router.post('/create-admin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new admin user
    const user = new User({
      email,
      password,
      isAdmin: true,
      role: 'admin'
    });

    await user.save();

    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ message: 'Error creating admin user' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Get current user
router.get('/me', auth, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Update user profile
router.patch('/profile', auth, async (req: any, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'street', 'city', 'iban'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    updates.forEach((update) => {
      if (update in user) {
        (user as any)[update] = req.body[update];
      }
    });
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Update user by ID (admin only)
router.patch('/:id', auth, requireAdmin, async (req: any, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'street', 'city', 'iban'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    updates.forEach((update) => {
      if (update in user) {
        (user as any)[update] = req.body[update];
      }
    });
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

export default router; 