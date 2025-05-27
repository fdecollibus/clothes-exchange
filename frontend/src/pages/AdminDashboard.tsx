import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import api from '../utils/axios';
import {
  ArrowDownTrayIcon,
  EyeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import AdminSystemDoc from '../components/AdminSystemDoc';

interface Seller {
  _id: string;
  name: string;
  email: string;
  sellerNumber: string;
  street?: string;
  city?: string;
  iban?: string;
  itemCount: number;
  totalValue: number;
}

interface Item {
  _id: string;
  itemNumber: number;
  description: string;
  price: number;
  size: string;
  condition: string;
  category: string;
  status: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isLoading } = useAuthStore();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'sellers' | 'documentation'>('sellers');

  useEffect(() => {
    // Wait for user data to load
    if (isLoading) return;

    // Check if user is admin
    if (!user?.isAdmin) {
      navigate('/dashboard');
      return;
    }

    // Load sellers
    loadSellers();
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (selectedSeller) {
      loadSellerItems(selectedSeller);
    }
  }, [selectedSeller]);

  const loadSellers = async () => {
    try {
      const response = await api.get('/api/admin/sellers');
      setSellers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading sellers');
    }
  };

  const loadSellerItems = async (sellerId: string) => {
    try {
      const response = await api.get(`/api/admin/sellers/${sellerId}/items`);
      setItems(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading items');
    }
  };

  const handleDownloadList = async (sellerId: string) => {
    try {
      const response = await api.get(`/api/admin/sellers/${sellerId}/items/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'artikel-liste.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error downloading list');
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      kleidung: 'Kleidung',
      schuhe: 'Schuhe',
      spielzeug: 'Spielzeug',
      accessoires: 'Accessoires'
    };
    return labels[category] || category;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      available: 'Verfügbar',
      sold: 'Verkauft',
      reserved: 'Reserviert'
    };
    return labels[status] || status;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('admin.title')}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('sellers')}
            className={`${
              activeTab === 'sellers'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <EyeIcon className="h-5 w-5" />
            {t('admin.sellers')}
          </button>
          <button
            onClick={() => setActiveTab('documentation')}
            className={`${
              activeTab === 'documentation'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <DocumentTextIcon className="h-5 w-5" />
            {t('admin.systemDoc')}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'sellers' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sellers List */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{t('admin.sellers')}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('seller.number')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('seller.name')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('seller.itemCount')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('seller.totalValue')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sellers.map((seller) => (
                    <tr key={seller._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {seller.sellerNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {seller.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {seller.itemCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {seller.totalValue.toFixed(2)} CHF
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => setSelectedSeller(seller._id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDownloadList(seller._id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Items List */}
          {selectedSeller && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('admin.sellerItems', {
                  seller: sellers.find((s) => s._id === selectedSeller)?.name
                })}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('item.number')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('item.description')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('item.category')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('item.size')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('item.price')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('item.status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.itemNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getCategoryLabel(item.category)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.price.toFixed(2)} CHF
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getStatusLabel(item.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <AdminSystemDoc />
        </div>
      )}
    </div>
  );
} 