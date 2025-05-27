import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Seller, ISeller } from '../models/Seller';
import { auth, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all sellers (protected, admin only)
router.get('/', auth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const sellers = await Seller.find({});
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new seller
router.post(
  '/',
  auth,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('address.street').notEmpty().withMessage('Street address is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.postalCode').notEmpty().withMessage('Postal code is required'),
    body('address.country').notEmpty().withMessage('Country is required'),
    body('bankInfo.accountHolder').notEmpty().withMessage('Account holder name is required'),
    body('bankInfo.iban').notEmpty().withMessage('IBAN is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const seller = new Seller(req.body);
      await seller.save();

      res.status(201).json(seller);
    } catch (error) {
      if (error instanceof Error && (error as any).code === 11000) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get seller by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update seller
router.patch('/:id', auth, async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'name',
    'phone',
    'address',
    'bankInfo',
    'isActive',
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    updates.forEach((update) => {
      if (update in seller) {
        (seller as any)[update] = req.body[update];
      }
    });
    await seller.save();

    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete seller (admin only)
router.delete('/:id', auth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json({ message: 'Seller deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 