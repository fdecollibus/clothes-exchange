import express, { Router, Response } from 'express';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/auth';
import { User, IUser } from '../models/User';
import Item from '../models/Item';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { getCategoryLabel, getStatusLabel, getSellerColor } from '../utils/labels';

const router = Router();

// Middleware to check if user is admin
const isAdmin = async (req: AuthRequest, res: Response, next: Function) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all sellers with their item counts and total values
router.get('/sellers', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const sellers = await User.find({ sellerNumber: { $exists: true } })
      .select('-password')
      .lean();

    const sellersWithStats = await Promise.all(sellers.map(async (seller) => {
      const items = await Item.find({ userId: seller._id });
      const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);
      
      return {
        _id: seller._id,
        name: seller.name,
        sellerNumber: seller.sellerNumber,
        email: seller.email,
        street: seller.street,
        city: seller.city,
        iban: seller.iban,
        itemCount: items.length,
        totalValue
      };
    }));

    res.json(sellersWithStats);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get items for a specific seller
router.get('/sellers/:sellerId/items', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const items = await Item.find({ userId: req.params.sellerId })
      .sort({ itemNumber: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Download seller's items as PDF
router.get('/sellers/:sellerId/items/download', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const seller = await User.findById(req.params.sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const items = await Item.find({ userId: req.params.sellerId })
      .sort({ category: 1, itemNumber: 1 });

    // Create PDF document
    const doc = new PDFDocument();
    const filename = `artikel-liste-${seller.sellerNumber}.pdf`;

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add title
    doc.fontSize(20).text(`Artikel von ${seller.name}`, { align: 'center' });
    doc.moveDown();

    // Add seller information
    doc.fontSize(12);
    doc.text(`Verkäufer-Nr.: ${seller.sellerNumber || 'Nicht zugewiesen'}`);
    doc.text(`Name: ${seller.name}`);
    if (seller.street) doc.text(`Straße: ${seller.street}`);
    if (seller.city) doc.text(`Stadt: ${seller.city}`);
    if (seller.iban) doc.text(`IBAN: ${seller.iban}`);
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
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      // Add category header
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
      categoryItems.forEach((item: any) => {
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

      y += 20;
    });

    // Add summary
    doc.moveDown();
    doc.text(`Gesamtanzahl der Artikel: ${items.length}`);
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    doc.text(`Gesamtwert: ${totalValue.toFixed(2)} CHF`);

    // Finalize PDF
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Consolidated list of all items organized by sellers
router.get('/items/consolidated', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Get all sellers with a sellerNumber
    const sellers = await User.find({ sellerNumber: { $exists: true } })
      .select('-password')
      .lean();

    // Get all items
    const items = await Item.find({});

    // Group items by seller
    const result = sellers.map((seller: IUser) => {
      const sellerItems = items.filter(item => item.userId?.toString() === seller._id.toString());
      return {
        seller: {
          id: seller._id,
          name: seller.name,
          sellerNumber: seller.sellerNumber,
          email: seller.email,
          city: seller.city,
          street: seller.street,
          iban: seller.iban
        },
        items: sellerItems
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Download consolidated list of all items as PDF
router.get('/items/consolidated/download', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Get all sellers with a sellerNumber
    const sellers = await User.find({ sellerNumber: { $exists: true } })
      .select('-password')
      .lean();

    // Get all items
    const items = await Item.find({});

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

    // Group items by seller
    const itemsBySeller = sellers.map((seller: IUser) => {
      const sellerItems = items.filter(item => item.userId?.toString() === seller._id.toString());
      return {
        seller,
        items: sellerItems
      };
    });

    // Add items grouped by seller
    let y = doc.y;
    itemsBySeller.forEach(({ seller, items: sellerItems }) => {
      if (sellerItems.length === 0) return;

      // Check if we need a new page
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      // Add seller header
      doc.font('Helvetica-Bold').fontSize(14);
      doc.text(`${seller.name} (Verkäufer-Nr.: ${seller.sellerNumber || 'Nicht zugewiesen'})`, 50, y);
      doc.font('Helvetica').fontSize(12);
      y += 30;

      // Group items by category
      const itemsByCategory = sellerItems.reduce((acc: { [key: string]: typeof sellerItems }, item) => {
        const category = getCategoryLabel(item.category);
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      }, {});

      // Add items for each category
      Object.entries(itemsByCategory).forEach(([category, categoryItems]) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }

        // Add category header
        doc.font('Helvetica-Bold').fontSize(12);
        doc.text(category, 70, y);
        doc.font('Helvetica').fontSize(10);
        y += 20;

        // Add table headers
        doc.text('Nr.', 70, y);
        doc.text('Beschreibung', 120, y);
        doc.text('Größe', 350, y);
        doc.text('Preis', 450, y);
        y += 20;

        // Add items
        categoryItems.forEach((item: any) => {
          if (y > 700) {
            doc.addPage();
            y = 50;
          }

          doc.text(item.itemNumber.toString(), 70, y);
          doc.text(item.description, 120, y);
          doc.text(item.size, 350, y);
          doc.text(`${item.price.toFixed(2)} CHF`, 450, y);
          y += 20;
        });

        y += 10;
      });

      // Add seller summary
      const totalValue = sellerItems.reduce((sum, item) => sum + item.price, 0);
      doc.text(`Anzahl Artikel: ${sellerItems.length}`, 70, y);
      doc.text(`Gesamtwert: ${totalValue.toFixed(2)} CHF`, 70, y + 20);
      y += 40;

      // Add separator
      doc.moveTo(50, y).lineTo(550, y).stroke();
      y += 20;
    });

    // Add overall summary
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    doc.font('Helvetica-Bold').fontSize(12);
    doc.text(`Gesamtanzahl aller Artikel: ${totalItems}`, 50, y);
    doc.text(`Gesamtwert aller Artikel: ${totalValue.toFixed(2)} CHF`, 50, y + 20);

    // Finalize PDF
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Download consolidated labels for all items
router.get('/items/consolidated/labels', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Get all sellers with a sellerNumber
    const sellers = await User.find({ sellerNumber: { $exists: true } })
      .select('-password')
      .lean();

    // Get all non-sold items
    const items = await Item.find({ status: { $ne: 'sold' } });

    if (items.length === 0) {
      return res.status(404).json({ message: 'Keine verfügbaren Artikel zum Drucken' });
    }

    // Group items by seller
    const itemsBySeller = sellers.map((seller: IUser) => {
      const sellerItems = items.filter(item => item.userId?.toString() === seller._id.toString());
      return {
        seller,
        items: sellerItems
      };
    });

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
    
    const filename = 'alle-etiketten.pdf';

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

    // Generate labels for all items
    let labelIndex = 0;
    for (const { seller, items: sellerItems } of itemsBySeller) {
      for (const item of sellerItems) {
        // Calculate position for current label
        const pageIndex = Math.floor(labelIndex / LABELS_PER_PAGE);
        const labelIndexOnPage = labelIndex % LABELS_PER_PAGE;
        const row = Math.floor(labelIndexOnPage / LABELS_PER_ROW);
        const col = labelIndexOnPage % LABELS_PER_ROW;

        // Add new page if needed
        if (labelIndexOnPage === 0 && labelIndex > 0) {
          doc.addPage();
        }

        // Calculate position for current label
        const x = horizontalMargin + (col * LABEL_WIDTH);
        const y = verticalMargin + (row * LABEL_HEIGHT);

        // Get seller color and fill the label background
        const sellerColor = getSellerColor(String(seller.sellerNumber || ''));
        doc.rect(x, y, LABEL_WIDTH, LABEL_HEIGHT)
          .fillAndStroke(sellerColor, '#000000');

        // Add content to label with black text
        doc.fillColor('#000000');
        doc.font('Helvetica');
        doc.text(`Verkäufer: ${seller.sellerNumber || 'N/A'}`,
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

        labelIndex++;
      }
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Error generating labels:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item (admin only)
router.patch('/items/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['adminComment', 'status'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const item = await Item.findById(req.params.id);
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
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item (admin only)
router.delete('/items/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 