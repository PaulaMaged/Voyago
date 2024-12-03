import Wishlist from '../models/Wishlist.js';

export const addToWishlist = async (req, res) => {
  try {
    const { userId, itemId, itemType } = req.body;
    
    let wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: []
      });
    }

    const itemExists = wishlist.items.some(
      item => item.itemId.toString() === itemId && item.itemType === itemType
    );

    if (!itemExists) {
      wishlist.items.push({ itemId, itemType });
      await wishlist.save();
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    
    const wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(
      item => item.itemId.toString() !== itemId
    );
    
    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const wishlist = await Wishlist.findOne({ user: userId })
      .populate('items.itemId');
    
    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 