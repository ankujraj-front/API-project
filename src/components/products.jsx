import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, addProduct,deleteProduct} from "../services/api";

const FALLBACK_IMAGE = "/product-placeholder.svg";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const newProduct = {
      title,
      price: parseFloat(price),
    };

    try {
      const data = await addProduct(newProduct);

      // 👇 Add to UI instantly
      setProducts((prev) => [
        { ...data, image: data?.image || FALLBACK_IMAGE },
        ...prev,
      ]);

      // reset + close modal
      setTitle("");
      setPrice("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
  try {
    await deleteProduct(id);

    setProducts((prev) => prev.filter((p) => p.id !== id));
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products</h1>

      <button onClick={() => setShowModal(true)}>
        ➕ Add Product
      </button>

      <div className="product_box"
      >
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div style={{ border: "1px solid #ccc", padding: "10px" }}>
              <img
                src={p?.image || FALLBACK_IMAGE}
                alt={p?.title || "Product"}
                width="100"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <h4>{p.title}</h4>
              <p>₹ {p.price}</p>
            </div>
             <button
              onClick={(e) => {
                e.preventDefault();
                handleDelete(p.id);
              }}
            >
              ❌ Delete
            </button>
          </Link>
        ))}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
            }}
          >
            <h3>Add Product</h3>

            <form onSubmit={handleAddProduct}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <br /><br />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <br /><br />

              <button type="submit">Add</button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
