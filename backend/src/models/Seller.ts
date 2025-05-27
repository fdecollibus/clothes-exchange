import mongoose from 'mongoose';

export interface ISeller {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  bankInfo: {
    accountHolder: string;
    iban: string;
  };
  isActive: boolean;
  totalItems: number;
  totalSales: number;
  createdAt: Date;
  updatedAt: Date;
}

const sellerSchema = new mongoose.Schema<ISeller>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      postalCode: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
      },
    },
    bankInfo: {
      accountHolder: {
        type: String,
        required: true,
        trim: true,
      },
      iban: {
        type: String,
        required: true,
        trim: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Seller = mongoose.model<ISeller>('Seller', sellerSchema); 