import mongoose, { Document, Schema } from 'mongoose';

export interface IColorVariant {
  color: string;
  colorCode: string;
  image: string;
  publicId?: string; // Cloudinary public ID for deletion
}

export interface IProduct extends Document {
  id: string; // slug
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string; // Cloudinary URL
  imagePublicId?: string; // Cloudinary public ID for main image
  rating: number;
  tags: string[];
  category: string;
  brand?: string; // Brand for filtering (not displayed in card)
  colorVariants?: IColorVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export const SneakerCategories = {
  RUNNING: 'Running',
  FOOTBALL: 'Football',
  BASKETBALL: 'Basketball',
  WALKING: 'Walking',
  GOLF: 'Golf'
} as const;

export type SneakerCategory = typeof SneakerCategories[keyof typeof SneakerCategories];

const ColorVariantSchema: Schema = new Schema({
  color: {
    type: String,
    required: true,
    trim: true
  },
  colorCode: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  publicId: {
    type: String, // Cloudinary public ID for color variant
    required: false
  }
});

const ProductSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  imagePublicId: {
    type: String, // Cloudinary public ID for main image
    required: false
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: false,
    trim: true
  },
  colorVariants: [ColorVariantSchema]
}, {
  timestamps: true
});

// During Next.js hot-reloads the model can be registered multiple times with old schemas.
// Delete the existing model if present so the updated schema is used.
if (mongoose.models && mongoose.models.Product) {
  try {
    // delete the cached model to avoid schema mismatches during development
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete mongoose.models.Product;
  } catch (e) {
    // ignore
  }
}

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);