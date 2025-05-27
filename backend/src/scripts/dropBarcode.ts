import mongoose from 'mongoose';

async function dropBarcodeIndex() {
  try {
    await mongoose.connect('mongodb://localhost:27017/clothes-exchange');
    console.log('Connected to MongoDB');

    const collections = await mongoose.connection.db.collections();
    const itemsCollection = collections.find(c => c.collectionName === 'items');

    if (itemsCollection) {
      await itemsCollection.dropIndex('barcode_1');
      console.log('Successfully dropped barcode index');
    } else {
      console.log('Items collection not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

dropBarcodeIndex(); 