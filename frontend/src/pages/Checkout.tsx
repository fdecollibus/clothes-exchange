import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PlusCircleIcon, 
  TrashIcon, 
  ArrowPathIcon,
  PrinterIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import api from '../utils/axios';

interface CheckoutItem {
  _id: string;
  itemNumber: number;
  title: string;
  price: number;
  seller: {
    _id: string;
    name: string;
    sellerNumber: string;
  };
}

export default function Checkout() {
  const { t } = useTranslation();
  const [sellerId, setSellerId] = useState('');
  const [itemNumber, setItemNumber] = useState('');
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddItem = async () => {
    if (!sellerId || !itemNumber) {
      setError(t('checkout.error.missingFields'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/api/checkout/${sellerId}/${itemNumber}`);
      const item = response.data;

      // Check if item is already in checkout
      if (checkoutItems.some(i => i._id === item._id)) {
        setError(t('checkout.error.itemAlreadyAdded'));
        return;
      }

      setCheckoutItems([...checkoutItems, item]);
      setItemNumber(''); // Clear item number for next entry
    } catch (err: any) {
      setError(err.response?.data?.message || t('checkout.error.itemNotFound'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCheckoutItems(checkoutItems.filter(item => item._id !== itemId));
  };

  const handleCheckout = async () => {
    if (checkoutItems.length === 0) {
      setError(t('checkout.error.noItems'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mark items as sold
      await api.post('/api/checkout/process', {
        items: checkoutItems.map(item => item._id)
      });

      // Generate receipt
      const receiptResponse = await api.get('/api/checkout/receipt', {
        params: { items: checkoutItems.map(item => item._id) },
        responseType: 'blob'
      });

      // Download receipt
      const url = window.URL.createObjectURL(new Blob([receiptResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess(t('checkout.success'));
      setCheckoutItems([]);
      setSellerId('');
    } catch (err: any) {
      setError(err.response?.data?.message || t('checkout.error.checkoutFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const total = checkoutItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('checkout.title')}</h1>

          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 rounded-lg bg-green-50 text-green-700 border border-green-100">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="sellerId" className="block text-sm font-medium text-gray-700">
                {t('checkout.sellerId')}
              </label>
              <input
                type="text"
                id="sellerId"
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder={t('checkout.sellerIdPlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="itemNumber" className="block text-sm font-medium text-gray-700">
                {t('checkout.itemNumber')}
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="itemNumber"
                  value={itemNumber}
                  onChange={(e) => setItemNumber(e.target.value)}
                  className="block w-full rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={t('checkout.itemNumberPlaceholder')}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <PlusCircleIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {checkoutItems.length > 0 && (
            <div className="mt-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('checkout.itemNumber')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('checkout.itemTitle')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('checkout.seller')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('checkout.price')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('checkout.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {checkoutItems.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.itemNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.seller.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.price.toFixed(2)} CHF
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        {t('checkout.total')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {total.toFixed(2)} CHF
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <CheckIcon className="h-5 w-5 mr-2" />
                  {t('checkout.process')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 