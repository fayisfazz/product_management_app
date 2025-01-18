import connectDB from '../services/db';
import Product from '../models.ts/Product';
import CartItem from '../models.ts/CartItem';
import express, { type Request, type Response } from 'express';


const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Product Management Routes
app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req: Request, res: Response) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
      } catch (error:any) {
        res.status(400).json({ error: error.message });
      }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
});

// Shopping Cart Routes
app.post('/api/cart', async (req: Request, res: Response) => {
  try {
    const cartItem = new CartItem(req.body);
    const savedCartItem = await cartItem.save();
    res.status(201).json(savedCartItem);
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/cart/:productId', async (req: Request, res: Response) => {
  try {
    const updatedItem = await CartItem.findOneAndUpdate(
      { productId: req.params.productId },
      { quantity: req.body.quantity },
      { new: true }
    );
    res.json(updatedItem);
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/cart/:productId', async (req: Request, res: Response) => {
  try {
    const deletedItem = await CartItem.findOneAndDelete({ productId: req.params.productId });
    res.status(204).send();
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/cart', async (req: Request, res: Response) => {
  try {
    const cartItems = await CartItem.find();
    res.json(cartItems);
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
