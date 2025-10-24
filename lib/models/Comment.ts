import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  productId: string;
  author?: string;
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  productId: { type: String, required: true, index: true },
  clientId: { type: String, required: false, index: true },
  author: { type: String, default: 'anonymous' },
  content: { type: String, required: true },
}, {
  timestamps: true
});

// Hot-reload safe
if (mongoose.models && mongoose.models.Comment) {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete mongoose.models.Comment;
  } catch (e) {
    // ignore
  }
}

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
