import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  favorites?: Array<any>;
  cart?: Array<{ product: any; quantity: number }>;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
  ,
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }]
}, {
  timestamps: true
});

// Хэширование пароля перед сохранением
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Метод для сравнения паролей
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// During Next.js hot-reloads the model can be registered multiple times with old schemas.
// Delete the existing model if present so the updated schema is used.
if (mongoose.models && mongoose.models.User) {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete mongoose.models.User;
  } catch (e) {
    // ignore
  }
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);