import { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, addItemToCart, fetchCartItems, removeCartItem, updateCartItem } from '../services/api';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    price: '',
  });
  const [cart, setCart] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addProducts = async () => {
    if (!newProduct.name || !newProduct.price) return;

    if (newProduct?.id) {
      const productIndex = products.findIndex((item) => item.id === newProduct.id);
      products[productIndex] = newProduct;
      setProducts(products);

      await updateProduct(newProduct);
    } else {
      setProducts((prev) => [
        ...prev,
        { ...newProduct, id: new Date().getTime().toString() },
      ]);
      await createProduct(newProduct);
    }
    setNewProduct({ id: '', name: '', price: '' });
  };

  const updateProducts = async (id) => {
    const updatedProduct = products.find((product) => product.id === id);
    setNewProduct(updatedProduct);
  };

  const deleteProducts = async (id) => {
    const deletedProduct = products.find((product) => product.id === id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
    await deleteProduct({ product: deletedProduct });
  };

  const addToCart = async(product) => {
    setCart((prev) => {
      const existingProduct = prev.find((item) => item.id === product.id);
      if (existingProduct) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    await addItemToCart(product)
  };

  const removeFromCart = async (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));

    const removedCart=cart.find((item)=>item.id==id)
    await removeCartItem(removedCart)
  };

  const updateCartQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: quantity } : item
        )
      );

      //update db
      const updatedCart=cart.find((item)=>item.id==id)
      await updateCartItem({ ...updatedCart, quantity: quantity })
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  useEffect(() => {
    //fetch products
    const fetchData = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };
    fetchData();


    //fetch cart
    const fetchCart = async () => {
      const cartItems = await fetchCartItems();
      setCart(cartItems);
    };
    fetchCart();
  }, []);

  return (
    <div className="product-management">
      <h2 className="title">Product Management</h2>

      <div className="product-form">
        <input
          type="text"
          name="name"
          value={newProduct.name}
          placeholder="Product Name"
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          placeholder="Product Price"
          onChange={handleInputChange}
          className="input-field"
        />
        <button onClick={addProducts} className="btn primary-btn">
          {newProduct.id ? 'Update Product' : 'Add Product'}
        </button>
      </div>

      <div className="product-list">
        <h3>Product List</h3>
        <ul className="list">
          {products.map((product) => (
            <li key={product.id} className="product-item">
              <span className="product-info">
                {product.name} - ${product.price}
              </span>
              <button onClick={() => updateProducts(product.id)} className="btn edit-btn">
                Edit
              </button>
              <button onClick={() => deleteProducts(product.id)} className="btn delete-btn">
                Delete
              </button>
              <button onClick={() => addToCart(product)} className="btn add-to-cart-btn">
                Add to Cart
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="shopping-cart">
        <h3>Shopping Cart</h3>
        <ul className="cart-list">
          {cart.map((item) => (
            <li key={item.id} className="cart-item">
              <span className="cart-item-info">
                {item.name} - ${item.price} x {item.quantity}
              </span>
              <button onClick={() => removeFromCart(item.id)} className="btn remove-btn">
                Remove
              </button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateCartQuantity(item.id, parseInt(e.target.value||0, 10))
                }
                className="quantity-input"
              />
            </li>
          ))}
        </ul>
        <div className="cart-total">
          <h4>Total: ${getCartTotal()}</h4>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;



