import { useState, useEffect, useMemo } from 'react';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addItemToCart,
  fetchCartItems,
  removeCartItem,
  updateCartItem,
  fetchDiscounts,
} from '../services/api';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import Cart from './Cart';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ id: '', name: '', price: '' });
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discount,setDiscount]=useState(0)



  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedProducts, cartItems,discounts] = await Promise.all([
        fetchProducts(),
        fetchCartItems(),
        fetchDiscounts()
      ]);
      setProducts(fetchedProducts);
      setCart(cartItems);
      setDiscount(discounts)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const addProducts = async () => {
    try {
      if (!newProduct.name || !newProduct.price) return;

      if (newProduct?.id) {
        const updatedProducts = products.map((product) =>
          product.id === newProduct.id ? newProduct : product
        );
        setProducts(updatedProducts);
        await updateProduct(newProduct);
      } else {
        const createdProduct = await createProduct(newProduct);
        setProducts((prev) => [...prev, createdProduct]);
      }

      setNewProduct({ id: '', name: '', price: '' });
    } catch (error) {
      console.error('Error adding/updating product:', error);
    }
  };

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="product-management">
      <h2 className="title">Product Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ProductForm
            newProduct={newProduct}
            onInputChange={handleInputChange}
            onAddProduct={addProducts}
          />
          <ProductList
            products={products}
            onEditProduct={(id) => {
              const product = products.find((p) => p.id === id);
              setNewProduct(product);
            }}
            onDeleteProduct={async (id) => {
              setProducts((prev) => prev.filter((p) => p.id !== id));
              await deleteProduct({id});
            }}
            onAddToCart={async (product) => {
              setCart((prev) => {
                const existingItem = prev.find((item) => item.id === product.id);
                if (existingItem) {
                  return prev.map((item) =>
                    item.id === product.id
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
                  );
                } else {
                  return [...prev, { ...product, quantity: 1 }];
                }
              });
              await addItemToCart(product);
            }}
          />
          <Cart
            cart={cart}
            onUpdateQuantity={async (id, quantity) => {
              setCart((prev) =>
                prev.map((item) =>
                  item.id === id ? { ...item, quantity } : item
                )
              );
              await updateCartItem({ id, quantity });
            }}
            onRemoveItem={async (id) => {
              setCart((prev) => prev.filter((item) => item.id !== id));
              await removeCartItem({id});
            }}
            total={cartTotal}
            discount={discount}
          />
        </>
      )}
    </div>
  );
};

export default ProductManagement;
