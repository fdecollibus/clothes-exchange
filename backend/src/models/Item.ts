import mongoose, { Schema, model, Document } from 'mongoose';

export interface IItem extends Document {
  userId: mongoose.Types.ObjectId;
  itemNumber: number;
  title: string;
  description: string;
  size: string;
  condition: string;
  category: string;
  price: number;
  status: 'available' | 'sold' | 'reserved';
  imageUrl?: string;
  adminComment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemNumber: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: [true, 'Bitte geben Sie einen Titel ein'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Bitte geben Sie eine Beschreibung ein'],
    trim: true,
  },
  size: {
    type: String,
    required: [true, 'Bitte geben Sie eine Größe ein'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Bitte geben Sie einen Preis ein'],
    min: [0.5, 'Der Preis muss mindestens 0,50 CHF betragen'],
  },
  condition: {
    type: String,
    required: [true, 'Bitte wählen Sie einen Zustand'],
    enum: ['neu', 'sehr_gut', 'gut', 'akzeptabel'],
  },
  category: {
    type: String,
    required: [true, 'Bitte wählen Sie eine Kategorie'],
    enum: ['kleidung', 'schuhe', 'spielzeug', 'accessoires'],
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'sold', 'reserved'],
    default: 'available',
  },
  imageUrl: { type: String },
  adminComment: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to generate itemNumber
itemSchema.pre('save', async function(next) {
  try {
    if (!this.itemNumber) {
      const lastItem = await model<IItem>('Item').findOne().sort({ itemNumber: -1 });
      this.itemNumber = lastItem ? lastItem.itemNumber + 1 : 1;
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Create the model after defining the middleware
const Item = model<IItem>('Item', itemSchema);
export default Item; 