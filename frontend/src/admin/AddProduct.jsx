import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdmin = user?.role === "admin";

  const canSubmit = useMemo(() => {
    return (
      formData.name.trim() &&
      formData.description.trim() &&
      formData.price &&
      formData.category.trim() &&
      formData.stock &&
      imageFile &&
      isAdmin
    );
  }, [formData, imageFile, isAdmin]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setError("");
    setSuccess("");

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      setError("Only admin users can add products.");
      return;
    }

    if (!imageFile) {
      setError("Please upload a product image.");
      return;
    }

    if (Number(formData.price) <= 0 || Number(formData.stock) < 0) {
      setError("Enter a valid price and stock quantity.");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("description", formData.description.trim());
    payload.append("price", formData.price);
    payload.append("category", formData.category.trim());
    payload.append("stock", formData.stock);
    payload.append("imageUrl", imageFile);

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: payload,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }

      setSuccess("Product added successfully.");
      setFormData(initialForm);
      setImageFile(null);
      setImagePreview("");
      setTimeout(() => navigate("/admin/products"), 700);
    } catch (err) {
      setError(err.message || "Product could not be added. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAdmin) {
    return (
      <main className="main-content">
        <section className="grid min-h-96 place-items-center bg-white p-8 text-center shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold">{user ? "Admin only" : "Login required"}</h1>
            <p className="mt-2 text-gray-600">Only admin users can add products.</p>
            <Link to={user ? "/shop" : "/login"} className="btn mt-5">
              {user ? "Back to Shop" : "Login"}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main-content">
      <header className="bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#2874f0]">Admin Inventory</p>
            <h1 className="mt-2 text-3xl font-semibold">Add Product</h1>
            <p className="mt-2 text-sm text-gray-600">Create a new product with image, price and stock.</p>
          </div>
          <Link to="/admin/products" className="rounded border border-[#2874f0] px-5 py-3 text-sm font-semibold text-[#2874f0]">
            View Products
          </Link>
        </div>
      </header>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
        <form className="grid gap-4 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold">Product Details</h2>

          {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
          {success && <div className="rounded border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-700">{success}</div>}

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            Product Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              className="h-11 rounded border border-gray-300 px-3 font-normal outline-none focus:border-[#2874f0]"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write product description"
              rows="5"
              required
              className="rounded border border-gray-300 px-3 py-3 font-normal outline-none focus:border-[#2874f0]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-gray-700">
              Price
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                required
                className="h-11 rounded border border-gray-300 px-3 font-normal outline-none focus:border-[#2874f0]"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-gray-700">
              Stock
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
                className="h-11 rounded border border-gray-300 px-3 font-normal outline-none focus:border-[#2874f0]"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            Category
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Electronics, Fashion, Home..."
              required
              className="h-11 rounded border border-gray-300 px-3 font-normal outline-none focus:border-[#2874f0]"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-gray-700">
            Product Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="rounded border border-gray-300 p-3 font-normal outline-none focus:border-[#2874f0]"
            />
            <span className="text-xs font-normal text-gray-500">Upload JPG, PNG or WEBP image</span>
          </label>

          <button
            type="submit"
            className="btn w-fit"
            disabled={loading || !canSubmit}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>

        <aside className="h-fit bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <p className="text-sm font-semibold uppercase text-[#2874f0]">Preview</p>
          <div className="mt-4 flex aspect-square items-center justify-center border border-gray-200 bg-[#f1f3f6]">
            {imagePreview ? (
              <img src={imagePreview} alt="Product preview" className="h-full w-full object-contain" />
            ) : (
              <span className="text-sm text-gray-500">No image selected</span>
            )}
          </div>
          <h2 className="mt-4 text-xl font-semibold">{formData.name || "Product name"}</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            {formData.description || "Product description will appear here."}
          </p>
          <div className="mt-4 flex justify-between gap-3">
            <strong>Rs. {Number(formData.price || 0).toFixed(2)}</strong>
            <span className="text-sm text-gray-500">{formData.stock || 0} in stock</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">{formData.category || "Category"}</p>
        </aside>
      </section>
    </main>
  );
};

export default AddProduct;
