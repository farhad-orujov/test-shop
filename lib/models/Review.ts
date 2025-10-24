import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  productId: string;
  author?: string;
  content: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  productId: { type: String, required: true },
  author: { type: String, default: 'anonymous' },
  content: { type: String, required: true },
}, {
  timestamps: true
});

// During Next.js hot-reloads the model can be registered multiple times with old schemas.
// Delete the existing model if present so the updated schema is used.
if (mongoose.models && mongoose.models.Review) {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete mongoose.models.Review;
  } catch (e) {
    // ignore
  }
}

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
