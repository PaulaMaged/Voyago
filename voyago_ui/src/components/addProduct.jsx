import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus, FaImage, FaTimes } from 'react-icons/fa';

const AddProduct = ({ fetchProducts }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    available_quantity: '',
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const sellerId = localStorage.getItem('roleId');
      const formData = new FormData();
      
      formData.append('seller', sellerId);
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('available_quantity', productData.available_quantity);
      formData.append('archived', false);
      
      images.forEach(image => {
        formData.append('images', image);
      });

      const response = await axios.post(
        'http://localhost:8000/api/seller/create-product',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        fetchProducts();
        setIsFormOpen(false);
        resetForm();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProductData({
      name: '',
      description: '',
      price: '',
      available_quantity: '',
    });
    setImages([]);
    setPreviewUrls([]);
    setError(null);
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] 
          text-white rounded-lg hover:bg-[var(--primaryDark)] transition-colors"
      >
        <FaPlus /> {isFormOpen ? 'Cancel' : 'Add New Product'}
      </button>

      {isFormOpen && (
        <div className="mt-6 p-6 bg-[var(--surface)] rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[var(--textPrimary)] mb-6">
            Add New Product
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[var(--textSecondary)] mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)]
                  bg-[var(--background)] text-[var(--textPrimary)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-[var(--textSecondary)] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)]
                  bg-[var(--background)] text-[var(--textPrimary)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
                  min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[var(--textSecondary)] mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)]
                    bg-[var(--background)] text-[var(--textPrimary)]
                    focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                />
              </div>

              <div>
                <label className="block text-[var(--textSecondary)] mb-2">
                  Available Quantity
                </label>
                <input
                  type="number"
                  name="available_quantity"
                  value={productData.available_quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)]
                    bg-[var(--background)] text-[var(--textPrimary)]
                    focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--textSecondary)] mb-2">
                Product Images
              </label>
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-6">
                <label className="flex flex-col items-center cursor-pointer">
                  <FaImage className="text-3xl text-[var(--primary)] mb-2" />
                  <span className="text-[var(--textSecondary)]">
                    Click to upload images
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white 
                            rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2 bg-[var(--background)] text-[var(--textPrimary)]
                  rounded-lg hover:bg-[var(--border)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg
                  hover:bg-[var(--primaryDark)] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
