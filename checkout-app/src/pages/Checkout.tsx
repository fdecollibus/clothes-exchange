import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchSellers, fetchSellerItems, addToCart, processCheckout, Seller, Item } from '../utils/api';

interface CartItem {
  sellerId: string;
  itemId: string;
  itemNumber: number;
  title: string;
  price: number;
  sellerName: string;
}

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [soldItems, setSoldItems] = useState<CartItem[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSellers = async () => {
      try {
        const sellersData = await fetchSellers();
        setSellers(sellersData);
      } catch (err) {
        setError(t('checkout.error.fetchSellersFailed'));
      }
    };
    loadSellers();
  }, [t]);

  useEffect(() => {
    const loadItems = async () => {
      if (selectedSeller) {
        try {
          const items = await fetchSellerItems(selectedSeller);
          setAvailableItems(items.filter(item => item.status === 'available'));
        } catch (err) {
          setError(t('checkout.error.fetchItemsFailed'));
        }
      } else {
        setAvailableItems([]);
      }
      setSelectedItem('');
    };
    loadItems();
  }, [selectedSeller, t]);

  const handleAddToCart = async () => {
    if (!selectedSeller || !selectedItem) {
      setError(t('checkout.error.missingFields'));
      return;
    }

    const item = availableItems.find(i => i.id === selectedItem);
    const seller = sellers.find(s => s.id === selectedSeller);

    if (!item || !seller) {
      setError(t('checkout.error.itemNotFound'));
      return;
    }

    if (cart.some(cartItem => cartItem.itemId === item.id)) {
      setError(t('checkout.error.itemAlreadyAdded'));
      return;
    }

    try {
      setIsLoading(true);
      await addToCart(selectedSeller, selectedItem);
      setCart([...cart, {
        sellerId: selectedSeller,
        itemId: selectedItem,
        itemNumber: item.itemNumber,
        title: item.title,
        price: item.price,
        sellerName: seller.name
      }]);
      setSelectedItem('');
      setError('');
    } catch (err) {
      setError(t('checkout.error.itemNotAvailable'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.itemId !== itemId));
  };

  const handleCheckout = async () => {
    try {
      setError('');
      setSuccess('');
      setReceiptUrl('');

      if (cart.length === 0) {
        setError(t('checkout.error.emptyCart'));
        return;
      }

      const response = await processCheckout(cart);
      setSuccess(response.message);
      setReceiptUrl(response.receiptUrl);
      setSoldItems([...cart]);
      setCart([]);
      setSelectedSeller('');
      setSelectedItem('');
      setAvailableItems([]);
    } catch (error) {
      setError(t('checkout.error.checkoutFailed'));
    }
  };

  const handleDownloadReceipt = () => {
    if (receiptUrl) {
      window.open(receiptUrl, '_blank');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('checkout.title')}</h1>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('checkout.sellerId')}
            </label>
            <select
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">{t('checkout.selectSeller')}</option>
              {sellers.map(seller => (
                <option key={seller.id} value={seller.id}>
                  {seller.name} ({seller.sellerNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('checkout.itemNumber')}
            </label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={!selectedSeller}
            >
              <option value="">{t('checkout.selectItem')}</option>
              {availableItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.itemNumber} - {item.title} ({item.price.toFixed(2)}€)
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isLoading || !selectedSeller || !selectedItem}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {t('common.add')}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {cart.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">{t('checkout.cart')}</h2>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">{t('checkout.itemNumber')}: {item.itemNumber}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-medium">{item.price.toFixed(2)}€</p>
                  <button
                    onClick={() => handleRemoveFromCart(item.itemId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <div className="font-bold">
                {t('checkout.total')}: {total.toFixed(2)}€
              </div>
              <button
                onClick={handleCheckout}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {t('checkout.completeSale')}
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-2">{success}</h2>
            <p className="text-gray-600">{new Date().toLocaleDateString('de-DE')}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">{t('checkout.receipt')}</h3>
            <div className="space-y-3">
              {soldItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      {t('checkout.itemNumber')}: {item.itemNumber} | {t('checkout.seller')}: {item.sellerName}
                    </p>
                  </div>
                  <p className="font-medium">{item.price.toFixed(2)}€</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 font-bold">
                <p>{t('checkout.total')}</p>
                <p>{soldItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}€</p>
              </div>
            </div>
          </div>

          {receiptUrl && (
            <div className="text-center">
              <button
                onClick={handleDownloadReceipt}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t('checkout.downloadReceipt')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkout; 