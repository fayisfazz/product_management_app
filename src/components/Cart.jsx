import { useState } from "react";

const Cart = ({ cart, onUpdateQuantity, onRemoveItem, total,discount }) => {

  const handleQuantityChange = (itemId, value) => {
    const quantity = Math.max(0, parseInt(value || 0, 10));
    onUpdateQuantity(itemId, quantity);
  };

  return (
    <div className="shopping-cart">
      <h3>Shopping Cart</h3>
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.id} className="cart-item">
            <span className="cart-item-info">
              {item.name} - ${item.price} x {item.quantity}
            </span>
            <button onClick={() => onRemoveItem(item.id)} className="btn remove-btn">
              Remove
            </button>
            <input
              type="number"
              value={item.quantity === 0 ? "" : item.quantity}
              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              className="quantity-input"
              min="0"
            />
          </li>
        ))}
      </ul>
      <div className="cart-total">
        <h4>Total: ${total}</h4>
      </div>
      <div className="cart-total">
        <h4>Discount: ${discount}</h4>
      </div>
    </div>
  );
};

export default Cart;
