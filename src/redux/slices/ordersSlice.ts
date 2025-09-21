import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {
  id: string;
  total: number;
  createdAt: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
}

export interface OrdersState {
  list: Order[];
}

const initialState: OrdersState = {
  list: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
