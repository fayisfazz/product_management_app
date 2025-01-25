
const ProductList = ({ products, onEditProduct, onDeleteProduct, onAddToCart }) => {
  return (
    <div className="product-list">
      <h3>Product List</h3>
      <ul className="list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <span className="product-info">
              {product.name} - ${product.price}
            </span>
            <button onClick={() => onEditProduct(product.id)} className="btn edit-btn">
              Edit
            </button>
            <button onClick={() => onDeleteProduct(product.id)} className="btn delete-btn">
              Delete
            </button>
            <button onClick={() => onAddToCart(product)} className="btn add-to-cart-btn">
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
