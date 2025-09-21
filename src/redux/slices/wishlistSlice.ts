import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistState {
  productIds: string[];
}

const initialState: WishlistState = {
  productIds: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.productIds.includes(id)) {
        state.productIds = state.productIds.filter((pid) => pid !== id);
      } else {
        state.productIds.push(id);
      }
    },
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.productIds = action.payload;
    },
  },
});

export const { toggleWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
