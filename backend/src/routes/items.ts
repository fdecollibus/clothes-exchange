import express, { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Item, { IItem } from '../models/Item';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import PDFDocument from 'pdfkit';
import { AuthRequest } from '../types/auth';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import QRCode from 'qrcode';
import { getCategoryLabel, getStatusLabel, getSellerColor } from '../utils/labels';

const router = Router();

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Get all items with filters
router.get('/', auth, async (req, res) => {
  try {
    const filters: any = {};
    
    if (req.query.category) filters.category = req.query.category;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.userId) filters.userId = req.query.userId;
    
    const items = await Item.find(filters)
      .sort({ createdAt: -1 });
      
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all items for the current user
router.get('/my-items', auth, async (req: AuthRequest, res: Response) => {
  try {
    const items = await Item.find({ userId: req.user!._id })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching items' });
  }
});

// Create a new item with optional image upload
router.post(
  '/',
  auth,
  upload.single('image'),
  [
    body('description').notEmpty().withMessage('Description is required'),
    body('size').notEmpty().withMessage('Size is required'),
    body('condition').notEmpty().withMessage('Condition is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response) => {
    try {
      // Create the new item and let the pre-save middleware handle the item number
      const item = new Item({
        ...req.body,
        userId: req.user!._id,
      });

      await item.save();
      res.status(201).json(item);
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({ error: 'Error creating item' });
    }
  }
);

// Get item by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item
router.patch('/:id', auth, async (req: AuthRequest, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'title',
    'description',
    'category',
    'size',
    'condition',
    'price',
    'status',
    'adminComment'
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const item = await Item.findOne({ _id: req.params.id, userId: req.user!._id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    updates.forEach((update) => {
      if (update in item) {
        (item as any)[update] = req.body[update];
      }
    });
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, userId: req.user!._id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search items by barcode
router.get('/search/barcode/:barcode', auth, async (req, res) => {
  try {
    const item = await Item.findOne({ barcode: req.params.barcode }).populate(
      'seller',
      'name email'
    );
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Download all items list as PDF
router.get('/my-items/download', auth, async (req: AuthRequest, res: Response) => {
  try {
    const items = await Item.find({ userId: req.user!._id })
      .sort({ category: 1, itemNumber: 1 });

    const user = req.user!;

    // Create PDF document
    const doc = new PDFDocument();
    const filename = 'alle-artikel.pdf';

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add title
    doc.fontSize(20).text('Alle Artikel', { align: 'center' });
    doc.moveDown();

    // Add profile information
    doc.fontSize(12);
    doc.text(`Verkäufer-Nr.: ${user.sellerNumber || 'Nicht zugewiesen'}`);
    doc.text(`Name: ${user.name}`);
    if (user.street) doc.text(`Straße: ${user.street}`);
    if (user.city) doc.text(`Stadt: ${user.city}`);
    if (user.iban) doc.text(`IBAN: ${user.iban}`);
    doc.moveDown();

    // Add separator line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Group items by category
    const itemsByCategory = items.reduce((acc: { [key: string]: typeof items }, item) => {
      const category = getCategoryLabel(item.category);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    // Add items grouped by category
    let y = doc.y;
    Object.entries(itemsByCategory).forEach(([category, categoryItems]) => {
      // Add category header
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      doc.font('Helvetica-Bold').fontSize(14);
      doc.text(category, 50, y);
      doc.font('Helvetica').fontSize(12);
      y += 30;

      // Add table headers
      doc.text('Nr.', 50, y);
      doc.text('Beschreibung', 100, y);
      doc.text('Größe', 350, y);
      doc.text('Preis', 450, y);
      doc.text('Status', 500, y);
      y += 20;

      // Add items for this category
      categoryItems.forEach((item: IItem) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }

        doc.text(item.itemNumber.toString(), 50, y);
        doc.text(item.description, 100, y);
        doc.text(item.size, 350, y);
        doc.text(`${item.price.toFixed(2)} CHF`, 450, y);
        doc.text(getStatusLabel(item.status), 500, y);

        y += 30;
      });

      // Add space between categories
      y += 20;
    });

    // Add summary at the bottom
    doc.moveDown();
    doc.text(`Gesamtanzahl der Artikel: ${items.length}`);
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    doc.text(`Gesamtwert: ${totalValue.toFixed(2)} CHF`);

    // Finalize PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Server-Fehler beim Erstellen der PDF' });
  }
});

// Download sold items list as PDF
router.get('/my-items/download/sold', auth, async (req: AuthRequest, res: Response) => {
  try {
    const items = await Item.find({ 
      userId: req.user!._id,
      status: 'sold'
    }).sort({ category: 1, itemNumber: 1 });

    const user = req.user!;

    // Create PDF document
    const doc = new PDFDocument();
    const filename = 'verkaufte-artikel.pdf';

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add title
    doc.fontSize(20).text('Verkaufte Artikel', { align: 'center' });
    doc.moveDown();

    // Add profile information
    doc.fontSize(12);
    doc.text(`Verkäufer-Nr.: ${user.sellerNumber || 'Nicht zugewiesen'}`);
    doc.text(`Name: ${user.name}`);
    if (user.street) doc.text(`Straße: ${user.street}`);
    if (user.city) doc.text(`Stadt: ${user.city}`);
    if (user.iban) doc.text(`IBAN: ${user.iban}`);
    doc.moveDown();

    // Add separator line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Group items by category
    const itemsByCategory = items.reduce((acc: { [key: string]: typeof items }, item) => {
      const category = getCategoryLabel(item.category);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    // Add items grouped by category
    let y = doc.y;
    Object.entries(itemsByCategory).forEach(([category, categoryItems]) => {
      // Add category header
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      doc.font('Helvetica-Bold').fontSize(14);
      doc.text(category, 50, y);
      doc.font('Helvetica').fontSize(12);
      y += 30;

      // Add table headers
      doc.text('Nr.', 50, y);
      doc.text('Beschreibung', 100, y);
      doc.text('Größe', 350, y);
      doc.text('Preis', 450, y);
      y += 20;

      // Add items for this category
      categoryItems.forEach((item: IItem) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }

        doc.text(item.itemNumber.toString(), 50, y);
        doc.text(item.description, 100, y);
        doc.text(item.size, 350, y);
        doc.text(`${item.price.toFixed(2)} CHF`, 450, y);

        y += 30;
      });

      // Add space between categories
      y += 20;
    });

    // Add summary at the bottom
    doc.moveDown();
    doc.text(`Anzahl verkaufter Artikel: ${items.length}`);
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    doc.text(`Gesamtwert verkaufter Artikel: ${totalValue.toFixed(2)} CHF`);

    // Finalize PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Server-Fehler beim Erstellen der PDF' });
  }
});

// Download unsold items list as PDF
router.get('/my-items/download/unsold', auth, async (req: AuthRequest, res: Response) => {
  try {
    const items = await Item.find({ 
      userId: req.user!._id,
      status: { $ne: 'sold' }
    }).sort({ category: 1, itemNumber: 1 });

    const user = req.user!;

    // Create PDF document
    const doc = new PDFDocument();
    const filename = 'unverkaufte-artikel.pdf';

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add title
    doc.fontSize(20).text('Unverkaufte Artikel', { align: 'center' });
    doc.moveDown();

    // Add profile information
    doc.fontSize(12);
    doc.text(`Verkäufer-Nr.: ${user.sellerNumber || 'Nicht zugewiesen'}`);
    doc.text(`Name: ${user.name}`);
    if (user.street) doc.text(`Straße: ${user.street}`);
    if (user.city) doc.text(`Stadt: ${user.city}`);
    if (user.iban) doc.text(`IBAN: ${user.iban}`);
    doc.moveDown();

    // Add separator line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Group items by category
    const itemsByCategory = items.reduce((acc: { [key: string]: typeof items }, item) => {
      const category = getCategoryLabel(item.category);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    // Add items grouped by category
    let y = doc.y;
    Object.entries(itemsByCategory).forEach(([category, categoryItems]) => {
      // Add category header
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      doc.font('Helvetica-Bold').fontSize(14);
      doc.text(category, 50, y);
      doc.font('Helvetica').fontSize(12);
      y += 30;

      // Add table headers
      doc.text('Nr.', 50, y);
      doc.text('Beschreibung', 100, y);
      doc.text('Größe', 350, y);
      doc.text('Preis', 450, y);
      doc.text('Status', 500, y);
      y += 20;

      // Add items for this category
      categoryItems.forEach((item: IItem) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }

        doc.text(item.itemNumber.toString(), 50, y);
        doc.text(item.description, 100, y);
        doc.text(item.size, 350, y);
        doc.text(`${item.price.toFixed(2)} CHF`, 450, y);
        doc.text(getStatusLabel(item.status), 500, y);

        y += 30;
      });

      // Add space between categories
      y += 20;
    });

    // Add summary at the bottom
    doc.moveDown();
    doc.text(`Anzahl unverkaufter Artikel: ${items.length}`);
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    doc.text(`Gesamtwert unverkaufter Artikel: ${totalValue.toFixed(2)} CHF`);

    // Finalize PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Server-Fehler beim Erstellen der PDF' });
  }
});

// Download items labels as PDF
router.get('/my-items/labels', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Only get non-sold items
    const items = await Item.find({ 
      userId: req.user!._id,
      status: { $ne: 'sold' }
    }).sort({ itemNumber: 1 });

    if (items.length === 0) {
      return res.status(404).json({ message: 'Keine verfügbaren Artikel zum Drucken' });
    }

    const user = req.user!;

    // Create PDF document with A4 size
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    });
    
    const filename = 'etiketten.pdf';

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Label dimensions in points (1 cm = 28.346 points)
    const LABEL_WIDTH = 113.385826772; // 4 cm
    const LABEL_HEIGHT = 85.039370079; // 3 cm
    
    // Calculate how many labels fit on a page
    const PAGE_WIDTH = 595.28; // A4 width in points
    const PAGE_HEIGHT = 841.89; // A4 height in points
    
    const LABELS_PER_ROW = Math.floor((PAGE_WIDTH - 20) / LABEL_WIDTH);
    const LABELS_PER_COL = Math.floor((PAGE_HEIGHT - 20) / LABEL_HEIGHT);
    const LABELS_PER_PAGE = LABELS_PER_ROW * LABELS_PER_COL;

    // Calculate margins to center the labels on the page
    const horizontalMargin = (PAGE_WIDTH - (LABELS_PER_ROW * LABEL_WIDTH)) / 2;
    const verticalMargin = (PAGE_HEIGHT - (LABELS_PER_COL * LABEL_HEIGHT)) / 2;

    // Set font size
    doc.fontSize(10);

    // Generate labels
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Calculate position for current label
      const pageIndex = Math.floor(i / LABELS_PER_PAGE);
      const labelIndex = i % LABELS_PER_PAGE;
      const row = Math.floor(labelIndex / LABELS_PER_ROW);
      const col = labelIndex % LABELS_PER_ROW;

      // Add new page if needed
      if (labelIndex === 0 && i > 0) {
        doc.addPage();
      }

      // Calculate position for current label
      const x = horizontalMargin + (col * LABEL_WIDTH);
      const y = verticalMargin + (row * LABEL_HEIGHT);

      // Get seller color and fill the label background
      const sellerColor = getSellerColor(String(user.sellerNumber || ''));
      doc.rect(x, y, LABEL_WIDTH, LABEL_HEIGHT)
        .fillAndStroke(sellerColor, '#000000');

      // Add content to label with black text
      doc.fillColor('#000000');
      doc.font('Helvetica');
      doc.text(`Verkäufer: ${user.sellerNumber || 'N/A'}`,
        x + 5, y + 5,
        { width: LABEL_WIDTH - 10, align: 'left' }
      );
      
      doc.moveDown(0.5);
      doc.text(`Nr. ${item.itemNumber}`,
        x + 5, y + 25,
        { width: LABEL_WIDTH - 10, align: 'left' }
      );
      
      doc.moveDown(0.5);
      doc.text(`Größe: ${item.size}`,
        x + 5, y + 45,
        { width: LABEL_WIDTH - 10, align: 'left' }
      );
      
      doc.font('Helvetica-Bold');
      doc.text(`${item.price.toFixed(2)} CHF`,
        x + 5, y + 65,
        { width: LABEL_WIDTH - 10, align: 'left' }
      );
    }

    // Finalize PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Server-Fehler beim Erstellen der Etiketten' });
  }
});

// Duplicate item
router.post('/:id/duplicate', auth, async (req: AuthRequest, res: Response) => {
  try {
    const originalItem = await Item.findOne({ _id: req.params.id, userId: req.user!._id });
    if (!originalItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Create a new item with the same data but without _id and itemNumber
    const newItem = new Item({
      userId: req.user!._id,
      title: originalItem.title,
      description: originalItem.description,
      size: originalItem.size,
      condition: originalItem.condition,
      category: originalItem.category,
      price: originalItem.price,
      status: 'available', // Reset status to available
      imageUrl: originalItem.imageUrl
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error duplicating item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 