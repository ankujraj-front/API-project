import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../services/api";

const FALLBACK_IMAGE = "/product-placeholder.svg";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    setCartItems((prev) => [...prev, product]);
    setShowCart(true);
  };

  const handleRemove = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  if (loading) return <h2>Loading...</h2>;
  if (!product) return <h2>No product found</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.title}</h1>

      <img
        src={product?.image || FALLBACK_IMAGE}
        alt={product?.title || "Product"}
        width="200"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />

      <p>{product.description}</p>
      <h2>₹ {product.price}</h2>

      <button onClick={handleAddToCart}>
        🛒 Add to Cart
      </button>

      {showCart && (
        <div
          className="cart-overlay"
          onClick={() => setShowCart(false)}
        >
          <div
            className="cart-sidebar"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>🛒 Your Cart</h2>

            {cartItems.length === 0 ? (
              <p>No items</p>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <img
                    src={item?.image || FALLBACK_IMAGE}
                    alt={item?.title || "Cart item"}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <div>
                    <p>{item.title}</p>
                    <p>₹ {item.price}</p>
                  </div>

                  <button onClick={() => handleRemove(index)}>
                    ❌
                  </button>
                </div>
              ))
            )}

            <h3>Total: ₹ {total.toFixed(2)}</h3>

            <button onClick={() => setShowCart(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
