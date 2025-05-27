import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Seller {
  id: string;
  name: string;
  sellerNumber: number;
}

export interface Item {
  id: string;
  itemNumber: number;
  title: string;
  price: number;
  sellerId: string;
  status: 'available' | 'sold' | 'reserved';
}

export interface CheckoutResponse {
  message: string;
  receiptUrl: string;
}

export const fetchSellers = async (): Promise<Seller[]> => {
  const response = await api.get('/checkout/sellers');
  return response.data.map((seller: any) => ({
    id: seller._id,
    name: seller.name,
    sellerNumber: seller.sellerNumber
  }));
};

export const fetchSellerItems = async (sellerId: string): Promise<Item[]> => {
  try {
    const response = await api.get(`/checkout/sellers/${sellerId}/items`);
    return response.data.map((item: any) => ({
      id: item._id,
      itemNumber: item.itemNumber,
      title: item.title,
      price: item.price,
      sellerId: sellerId,
      status: 'available'
    }));
  } catch (error) {
    console.error('Error fetching seller items:', error);
    throw error;
  }
};

export const addToCart = async (sellerId: string, itemId: string): Promise<Item> => {
  const response = await api.post('/checkout/items', { 
    sellerId,
    itemId
  });
  const item = response.data;
  return {
    id: item._id,
    itemNumber: item.itemNumber,
    title: item.title,
    price: item.price,
    sellerId: item.seller._id,
    status: 'available'
  };
};

export const processCheckout = async (cart: { sellerId: string; itemId: string }[]): Promise<CheckoutResponse> => {
  const response = await api.post('/checkout/process', { 
    items: cart.map(item => item.itemId)
  });
  return response.data;
};

export default api; 