import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState(initialForm);
  const [currentImage, setCurrentImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!user?.token || !isAdmin) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          headers: {
            Accept: "application/json",
          },
        });
        const product = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(product.message || `Request failed with status ${res.status}`);
        }

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category || "",
          stock: product.stock || "",
        });
        setCurrentImage(product.imageUrl || product.imageUri || "");
      } catch (err) {
        setError(err.message || "Product could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user, isAdmin]);

  const canSubmit = useMemo(() => {
    return (
      formData.name.trim() &&
      formData.description.trim() &&
      formData.price &&
      formData.category.trim() &&
      formData.stock &&
      isAdmin
    );
  }, [formData, isAdmin]);

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
      setError("Only admin users can edit products.");
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
    if (imageFile) {
      payload.append("imageUrl", imageFile);
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PUT",
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

      setSuccess("Product updated successfully.");
      setTimeout(() => navigate("/admin/products"), 700);
    } catch (err) {
      setError(err.message || "Product could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  if (!user || !isAdmin) {
    return (
      <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
        <section className="grid justify-items-center gap-4 min-h-[420px] p-[54px_24px] text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.26)] bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.18),transparent_34%),linear-gradient(135deg,#18181b_0%,#111827_100%)]">
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3.5 uppercase">Edit Product</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-[14px]">{user ? "Admin only" : "Login required"}</h1>
          <p className="text-zinc-300 leading-[1.7]">Only admin users can edit products.</p>
          <Link to={user ? "/shop" : "/login"} className="btn">
            {user ? "Back to Shop" : "Login"}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full max-w-[1240px] mx-auto pt-[30px] px-4 pb-[54px] sm:pt-[42px] sm:px-5 sm:pb-[70px]">
      <header className="grid sm:flex sm:justify-between gap-6 sm:items-end mb-[30px] pb-[28px] border-b border-white/5">
        <div>
          <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3.5 uppercase">Admin Inventory</span>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-[14px]">Edit Product</h1>
          <p className="max-w-[720px] text-zinc-300 leading-[1.7]">Update product information, stock levels, price, and imagery.</p>
        </div>
        <Link to="/admin/products" className="inline-flex items-center justify-center min-h-[44px] p-[10px_16px] rounded-lg font-bold cursor-pointer border border-orange-500/45 bg-transparent text-orange-500 hover:text-white hover:bg-orange-500/14">
          Back to Products
        </Link>
      </header>

      {loading ? (
        <section className="grid justify-items-center gap-4 min-h-[420px] p-[54px_24px] text-center border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.26)] bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.18),transparent_34%),linear-gradient(135deg,#18181b_0%,#111827_100%)]">
          <p className="text-zinc-300 leading-[1.7]">Loading product...</p>
        </section>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-7 items-start">
          <form className="grid gap-[18px] p-[22px] sm:p-8 border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.26)]" onSubmit={handleSubmit}>
            <div>
              <h2 className="text-white text-[1.55rem] mb-2 bg-none">Product Details</h2>
              <p className="text-zinc-300 leading-[1.7]">Change the fields below and save when ready.</p>
            </div>

            {error && <div className="p-[13px_15px] rounded-lg font-bold leading-[1.5] text-red-200 border border-red-500/35 bg-red-500/12">{error}</div>}
            {success && <div className="p-[13px_15px] rounded-lg font-bold leading-[1.5] text-teal-100 border border-teal-500/35 bg-teal-500/12">{success}</div>}

            <label className="grid gap-2 text-zinc-50 font-bold">
              Product Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 font-inherit transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
              />
            </label>

            <label className="grid gap-2 text-zinc-50 font-bold">
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a clear product description"
                rows="5"
                required
                className="w-full min-h-[130px] resize-y p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 font-inherit transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="grid gap-2 text-zinc-50 font-bold">
                Price
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 font-inherit transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
                />
              </label>

              <label className="grid gap-2 text-zinc-50 font-bold">
                Stock
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                  className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 font-inherit transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
                />
              </label>
            </div>

            <label className="grid gap-2 text-zinc-50 font-bold">
              Category
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Electronics, fashion, home..."
                required
                className="w-full min-h-[50px] p-[14px_15px] border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 font-inherit transition-all duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
              />
            </label>

            <label className="grid gap-2 text-zinc-50 font-bold">
              Replace Image
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-3 border border-zinc-800 rounded-lg outline-none bg-zinc-950 text-zinc-50 font-inherit transition-all duration-300 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)]" />
              <span className="text-zinc-400 text-[0.9rem]">Leave empty to keep the current image</span>
            </label>

            <button
              type="submit"
              className="btn min-h-[50px] disabled:cursor-not-allowed disabled:opacity-65 disabled:transform-none"
              disabled={saving || !canSubmit}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>

          <aside className="p-[22px] sm:p-6 border border-white/5 rounded-xl bg-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.26)] lg:sticky lg:top-[112px]">
            <span className="inline-flex text-orange-500 text-[0.78rem] font-bold tracking-[0.08em] mb-3.5 uppercase">Preview</span>
            <div className="grid place-items-center w-full aspect-square mb-5 overflow-hidden border border-white/5 rounded-[10px] bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.15),transparent_34%),#09090b]">
              {imagePreview || currentImage ? (
                <img
                  src={imagePreview || currentImage}
                  alt={`${formData.name || "Product"} preview`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-zinc-400">No image available</span>
              )}
            </div>
            <div>
              <h2 className="text-white text-[1.55rem] mb-2 bg-none">{formData.name || "Product name"}</h2>
              <p className="text-zinc-300 leading-[1.7]">{formData.description || "Product description will appear here."}</p>
              <div className="flex justify-between gap-[14px] items-center my-[18px]">
                <strong className="text-orange-500 text-[1.6rem]">₹{Number(formData.price || 0).toFixed(2)}</strong>
                <span className="text-zinc-400">{formData.stock || 0} in stock</span>
              </div>
              <small className="text-zinc-400">{formData.category || "Category"}</small>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
};

export default EditProduct;
