const ProductForm = ({ newProduct, onInputChange, onAddProduct }) => {
  return (
    <div className="product-form">
      <input
        type="text"
        name="name"
        value={newProduct.name}
        placeholder="Product Name"
        onChange={onInputChange}
        className="input-field"
      />
      <input
        type="number"
        name="price"
        value={newProduct.price}
        placeholder="Product Price"
        onChange={onInputChange}
        className="input-field"
      />
      <button onClick={onAddProduct} className="btn primary-btn">
        {newProduct.id ? 'Update Product' : 'Add Product'}
      </button>
    </div>
  );
};

export default ProductForm;
