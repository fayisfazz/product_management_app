import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem extends Document {
  productId: string;
  quantity: number;
}

const CartItemSchema: Schema = new Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
});

export default mongoose.model<ICartItem>('CartItem', CartItemSchema);