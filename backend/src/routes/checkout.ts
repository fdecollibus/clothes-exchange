import express from 'express';
import Item from '../models/Item';
import { User } from '../models/User';
import PDFDocument from 'pdfkit';
import { IItem } from '../models/Item';

const router = express.Router();

// Get all sellers
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await User.find({}, 'sellerNumber name');
    res.json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

// Get items for a seller
router.get('/sellers/:sellerId/items', async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    // Find the seller by _id
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Verkäufer nicht gefunden' });
    }

    // Find all available items for this seller
    const items = await Item.find({ 
      userId: seller._id,
      status: 'available'
    }).select('_id itemNumber title price');

    res.json(items);
  } catch (error) {
    console.error('Error fetching seller items:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

// Get item details for checkout
router.get('/:sellerId/:itemNumber', async (req, res) => {
  try {
    const { sellerId, itemNumber } = req.params;
    
    // Find the seller by seller number
    const seller = await User.findOne({ sellerNumber: sellerId });
    if (!seller) {
      return res.status(404).json({ message: 'Verkäufer nicht gefunden' });
    }

    // Find the item
    const item = await Item.findOne({ 
      userId: seller._id,
      itemNumber: parseInt(itemNumber),
      status: 'available'
    });

    if (!item) {
      return res.status(404).json({ message: 'Artikel nicht gefunden' });
    }

    // Return item details with seller name
    res.json({
      _id: item._id,
      itemNumber: item.itemNumber,
      title: item.title,
      price: item.price,
      seller: {
        _id: seller._id,
        name: seller.name,
        sellerNumber: seller.sellerNumber
      }
    });
  } catch (error) {
    console.error('Error in checkout item lookup:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

// Add item to cart
router.post('/items', async (req, res) => {
  try {
    const { sellerId, itemId } = req.body;

    // Find the seller by _id
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Verkäufer nicht gefunden' });
    }

    // Find the item
    const item = await Item.findOne({ 
      _id: itemId,
      userId: seller._id,
      status: 'available'
    });

    if (!item) {
      return res.status(404).json({ message: 'Artikel nicht gefunden oder nicht verfügbar' });
    }

    // Return item details
    res.json({
      _id: item._id,
      itemNumber: item.itemNumber,
      title: item.title,
      price: item.price,
      seller: {
        _id: seller._id,
        name: seller.name,
        sellerNumber: seller.sellerNumber
      }
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

// Process checkout (mark all items as sold)
router.post('/process', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Keine Artikel zum Verkauf angegeben' });
    }

    // Update all items to sold status
    const result = await Item.updateMany(
      { _id: { $in: items } },
      { $set: { status: 'sold' } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Keine Artikel gefunden' });
    }

    // Generate receipt URL
    const receiptUrl = `/api/checkout/receipt?items=${items.join(',')}`;

    res.json({ 
      message: 'Verkauf erfolgreich abgeschlossen',
      receiptUrl 
    });
  } catch (error) {
    console.error('Error in checkout process:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

// Generate receipt
router.get('/receipt', async (req, res) => {
  try {
    const { items } = req.query;
    if (!items) {
      return res.status(400).json({ message: 'No items provided for receipt' });
    }

    // Decode and split the items string
    const itemIds = decodeURIComponent(items as string).split(',');

    // Get all items with their seller information
    const itemsData = await Item.find({ _id: { $in: itemIds } })
      .populate('userId', 'name sellerNumber');

    if (itemsData.length === 0) {
      return res.status(404).json({ message: 'No items found for receipt' });
    }

    // Create PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=receipt.pdf');
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text('Kinderkleiderbörse - Kassenbon', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Datum: ${new Date().toLocaleDateString('de-DE')}`);
    doc.moveDown();

    // Add items
    let total = 0;
    itemsData.forEach((item: IItem) => {
      const seller = item.userId as any; // Type assertion for populated field
      doc.text(`Artikel ${item.itemNumber} - ${item.title}`);
      doc.text(`Verkäufer: ${seller.name} (${seller.sellerNumber})`);
      doc.text(`${item.price.toFixed(2)} CHF`, { align: 'right' });
      doc.moveDown();
      total += item.price;
    });

    doc.moveDown();
    doc.text('----------------------------------------');
    doc.text(`Gesamtbetrag: ${total.toFixed(2)} CHF`, { align: 'right' });
    doc.moveDown();
    doc.text('Vielen Dank für Ihren Einkauf!');

    doc.end();
  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

export default router; 