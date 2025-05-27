import mongoose from 'mongoose';
import Item from '../models/Item';
import dotenv from 'dotenv';

dotenv.config();

async function updateItemNumbers() {
  try {
    // Connect to MongoDB using the same configuration as the main server
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothes-exchange');
    console.log('Connected to MongoDB');

    // Get all items without item numbers, sorted by creation date
    const items = await Item.find({ itemNumber: { $exists: false } })
      .sort({ createdAt: 1 });

    console.log(`Found ${items.length} items without item numbers`);

    // Get the highest existing item number
    const lastItem = await Item.findOne({}, {}, { sort: { 'itemNumber': -1 } });
    let nextNumber = lastItem?.itemNumber ? lastItem.itemNumber + 1 : 1;

    // Update each item
    for (const item of items) {
      await Item.updateOne(
        { _id: item._id },
        { $set: { itemNumber: nextNumber++ } },
        { runValidators: false }
      );
      console.log(`Updated item ${item._id} with number ${nextNumber - 1}`);
    }

    console.log('All items have been updated successfully');
  } catch (error) {
    console.error('Error updating item numbers:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
updateItemNumbers(); 