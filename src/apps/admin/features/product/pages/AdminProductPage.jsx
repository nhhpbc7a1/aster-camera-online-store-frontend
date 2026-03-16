import React, { useState, useEffect } from "react";
import productService from "@/domains/product/services/productService";

function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: 1,
    price: 0,
    originalPrice: 0,
    description: "",
    inStock: true,
    quantity: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? parseFloat(value)
            : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update product - would need API implementation
      console.log("Update product:", editingId, formData);
    } else {
      // Add product - would need API implementation
      console.log("Add product:", formData);
    }
    handleResetForm();
  };

  const handleEditProduct = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      console.log("Delete product:", productId);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      categoryId: 1,
      price: 0,
      originalPrice: 0,
      description: "",
      inStock: true,
      quantity: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add New Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-semibold mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Category ID
              </label>
              <input
                type="number"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                required
                step="0.01"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Original Price
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleFormChange}
                step="0.01"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleFormChange}
                  className="w-4 h-4 mr-2"
                />
                <span className="text-sm font-semibold">In Stock</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows="4"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-semibold">Name</th>
              <th className="text-center px-6 py-3 font-semibold">Price</th>
              <th className="text-center px-6 py-3 font-semibold">Stock</th>
              <th className="text-center px-6 py-3 font-semibold">Status</th>
              <th className="text-center px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">#ID: {product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-semibold">
                  ${product.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  {product.quantity} units
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${product.inStock
                      ? "bg-green-100 text-green-800"
                      : "bg-black-100 text-red-800"
                      }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-600 hover:text-blue-800 mr-3 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-black hover:text-red-800 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProductPage;
