const deleteProduct = async (productId) => {
  try {
    // Add withCredentials if you're using cookies
    const response = await axios.delete(`http://localhost:8000/api/seller/delete-product/${productId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      // Handle successful deletion
      console.log('Product deleted successfully');
      // Add your success logic here (e.g., redirect or refresh list)
    }
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      status: error.response?.status
    });
    // Handle the error appropriately
  }
};