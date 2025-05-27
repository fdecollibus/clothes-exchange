import { useAuthStore } from '../stores/authStore';
import { useState, useEffect } from 'react';
import { 
  ClipboardDocumentListIcon, 
  PlusCircleIcon,
  ArrowDownTrayIcon,
  TagIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpDownIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  XMarkIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChartBarIcon,
  CurrencyDollarIcon as DollarIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/axios';

interface Item {
  _id: string;
  itemNumber: number;
  title: string;
  description: string;
  price: number;
  size: string;
  condition: string;
  category: string;
  createdAt: string;
  status: 'available' | 'sold' | 'reserved';
}

type SortField = 'itemNumber' | 'category' | 'size' | 'condition' | 'price' | 'status';
type SortDirection = 'asc' | 'desc';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isLoading: isUserLoading, loadUser } = useAuthStore();
  const [items, setItems] = useState<Item[]>([]);
  const [isItemsLoading, setIsItemsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState<SortField>('itemNumber');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isTableEditMode, setIsTableEditMode] = useState(false);
  const [editableItems, setEditableItems] = useState<Item[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const loadItems = async () => {
    try {
      setIsItemsLoading(true);
      const response = await api.get<Item[]>('/api/items/my-items');
      setItems(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error loading items:', err);
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setIsItemsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadItems();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('item.deleteConfirm'))) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/api/items/${id}`);
      await loadItems(); // Reload the items list
      setError(null);
    } catch (err: any) {
      console.error('Error deleting item:', err);
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadList = async () => {
    try {
      const response = await api.get('/api/items/my-items/download', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'alle-artikel.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Fehler beim Herunterladen der Liste');
    }
  };

  const handleDownloadSoldList = async () => {
    try {
      const response = await api.get('/api/items/my-items/download/sold', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'verkaufte-artikel.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Fehler beim Herunterladen der Liste');
    }
  };

  const handleDownloadUnsoldList = async () => {
    try {
      const response = await api.get('/api/items/my-items/download/unsold', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'unverkaufte-artikel.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Fehler beim Herunterladen der Liste');
    }
  };

  const handleDownloadLabels = async () => {
    try {
      // Only include non-sold items
      const nonSoldItems = items.filter(item => item.status !== 'sold');
      if (nonSoldItems.length === 0) {
        setError(t('dashboard.noItemsToDownload'));
        return;
      }
      const response = await api.get('/api/items/my-items/labels', {
        responseType: 'blob',
        params: { excludeSold: true }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'etiketten.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Fehler beim Herunterladen der Etiketten');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await api.post(`/api/items/${id}/duplicate`);
      await loadItems(); // Reload the items list
      setError(null);
    } catch (err: any) {
      console.error('Error duplicating item:', err);
      setError(err.response?.data?.message || t('common.error'));
    }
  };

  const getConditionLabel = (condition: string) => {
    const labels: { [key: string]: string } = {
      neu: 'Neu',
      sehr_gut: 'Sehr gut',
      gut: 'Gut',
      akzeptabel: 'Akzeptabel'
    };
    return labels[condition] || condition;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`item.status.${status}`);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedItems = () => {
    return [...items].sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      switch (sortField) {
        case 'itemNumber':
          return (a.itemNumber - b.itemNumber) * direction;
        case 'category':
          return a.category.localeCompare(b.category) * direction;
        case 'size':
          return a.size.localeCompare(b.size) * direction;
        case 'condition':
          return a.condition.localeCompare(b.condition) * direction;
        case 'price':
          return (a.price - b.price) * direction;
        case 'status':
          return a.status.localeCompare(b.status) * direction;
        default:
          return 0;
      }
    });
  };

  const getSortIcon = (field: SortField) => {
    return (
      <ChevronUpDownIcon
        className={`h-4 w-4 inline-block ml-1 cursor-pointer ${
          sortField === field ? 'text-indigo-600' : 'text-gray-400'
        }`}
        onClick={() => handleSort(field)}
      />
    );
  };

  const handleEditModeToggle = () => {
    if (!isTableEditMode) {
      // Entering edit mode - create editable copies only for non-sold items
      setEditableItems(items.filter(item => item.status !== 'sold').map(item => ({ ...item })));
    } else {
      // Exiting edit mode - reset changes
      setEditableItems([]);
    }
    setIsTableEditMode(!isTableEditMode);
  };

  const handleItemChange = (id: string, field: keyof Item, value: any) => {
    const item = items.find(item => item._id === id);
    if (item && item.status === 'sold') return; // Prevent changes to sold items
    
    setEditableItems(items.map(item => 
      item._id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      const updates = editableItems.map(item => ({
        id: item._id,
        updates: {
          title: item.title,
          description: item.description,
          size: item.size,
          condition: item.condition,
          category: item.category,
          price: item.price,
          status: item.status
        }
      }));

      // Save all changes
      await Promise.all(
        updates.map(update => 
          api.patch(`/api/items/${update.id}`, update.updates)
        )
      );

      await loadItems(); // Reload items to get fresh data
      setIsTableEditMode(false);
      setEditableItems([]);
      setError(null);
    } catch (err: any) {
      console.error('Error saving items:', err);
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsTableEditMode(false);
    setEditableItems([]);
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Nicht angemeldet</h2>
          <p className="mt-2 text-gray-600">Bitte melden Sie sich an, um fortzufahren.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.myItems')}</h1>
              <p className="mt-2 text-gray-600">Verwalten Sie Ihre Artikel und Verkäufe</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              {!isTableEditMode ? (
                <>
                  <button
                    onClick={() => navigate('/items/new')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    {t('item.new')}
                  </button>
                  <button
                    onClick={handleEditModeToggle}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    {t('common.editMode')}
                  </button>
                  <button
                    onClick={handleDownloadList}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    {t('dashboard.downloadAllList')}
                  </button>
                  <button
                    onClick={handleDownloadSoldList}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    {t('dashboard.downloadSoldList')}
                  </button>
                  <button
                    onClick={handleDownloadUnsoldList}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    {t('dashboard.downloadUnsoldList')}
                  </button>
                  <button
                    onClick={handleDownloadLabels}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <TagIcon className="h-5 w-5 mr-2" />
                    {t('dashboard.downloadLabels')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200"
                  >
                    <CheckIcon className="h-5 w-5 mr-2" />
                    {isSaving ? t('common.saving') : t('common.saveAll')}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    {t('common.cancel')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <ShoppingBagIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('dashboard.totalItems')}</p>
                <p className="text-2xl font-semibold text-gray-900">{items.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <ChartBarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('dashboard.totalValue')}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {items.reduce((sum, item) => sum + item.price, 0).toFixed(2)} CHF
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <UserGroupIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('dashboard.soldItems')}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {items.filter(item => item.status === 'sold').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <CurrencyDollarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('dashboard.soldValue')}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {items.filter(item => item.status === 'sold').reduce((sum, item) => sum + item.price, 0).toFixed(2)} CHF
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 border border-red-100">
            {error}
          </div>
        )}

        {isItemsLoading ? (
          <div className="flex justify-center items-center h-32 bg-white rounded-lg shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg text-gray-500">{t('dashboard.noItems')}</p>
            <button
              onClick={() => navigate('/items/new')}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200"
            >
              {t('dashboard.addFirstItem')}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Unsold Items Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t('dashboard.unsoldItems')}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        {t('item.number')} {getSortIcon('itemNumber')}
                      </th>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                        {t('item.title')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        {t('item.category')} {getSortIcon('category')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        {t('item.size')} {getSortIcon('size')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        {t('item.condition')} {getSortIcon('condition')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        {t('item.price')} {getSortIcon('price')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        {t('item.itemStatus')} {getSortIcon('status')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {(isTableEditMode ? editableItems : items)
                      .filter(item => item.status !== 'sold')
                      .map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {item.itemNumber}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                            {isTableEditMode ? (
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => handleItemChange(item._id, 'title', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            ) : (
                              <div className="flex items-center">
                                <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <div className="font-medium text-gray-900">{item.title}</div>
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {isTableEditMode ? (
                              <select
                                value={item.category}
                                onChange={(e) => handleItemChange(item._id, 'category', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="kleidung">Kleidung</option>
                                <option value="schuhe">Schuhe</option>
                                <option value="spielzeug">Spielzeug</option>
                                <option value="accessoires">Accessoires</option>
                              </select>
                            ) : (
                              getCategoryLabel(item.category)
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {isTableEditMode ? (
                              <input
                                type="text"
                                value={item.size}
                                onChange={(e) => handleItemChange(item._id, 'size', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            ) : (
                              item.size
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {isTableEditMode ? (
                              <select
                                value={item.condition}
                                onChange={(e) => handleItemChange(item._id, 'condition', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="neu">Neu</option>
                                <option value="sehr_gut">Sehr gut</option>
                                <option value="gut">Gut</option>
                                <option value="akzeptabel">Akzeptabel</option>
                              </select>
                            ) : (
                              getConditionLabel(item.condition)
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            {isTableEditMode ? (
                              <input
                                type="number"
                                step="0.01"
                                value={item.price}
                                onChange={(e) => handleItemChange(item._id, 'price', parseFloat(e.target.value))}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            ) : (
                              <div className="flex items-center">
                                <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                                {item.price.toFixed(2)} CHF
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            {isTableEditMode ? (
                              <select
                                value={item.status}
                                onChange={(e) => handleItemChange(item._id, 'status', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="available">Verfügbar</option>
                                <option value="sold">Verkauft</option>
                                <option value="reserved">Reserviert</option>
                              </select>
                            ) : (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                {getStatusLabel(item.status)}
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <div className="flex items-center space-x-3">
                              {!isTableEditMode && (
                                <>
                                  <button
                                    onClick={() => navigate(`/items/${item._id}/edit`)}
                                    disabled={item.status === 'sold'}
                                    className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md ${
                                      item.status === 'sold'
                                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                        : 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200'
                                    }`}
                                    aria-label={t('common.edit')}
                                  >
                                    <PencilIcon className="h-4 w-4 mr-1" />
                                    {t('common.edit')}
                                  </button>
                                  <button
                                    onClick={() => handleDuplicate(item._id)}
                                    disabled={item.status === 'sold'}
                                    className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md ${
                                      item.status === 'sold'
                                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                        : 'text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200'
                                    }`}
                                    aria-label={t('common.duplicate')}
                                  >
                                    <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                                    {t('common.duplicate')}
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item._id)}
                                    disabled={isDeleting || item.status === 'sold'}
                                    className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md ${
                                      item.status === 'sold'
                                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                        : 'text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50 transition-colors duration-200'
                                    }`}
                                    aria-label={t('common.delete')}
                                  >
                                    <TrashIcon className="h-4 w-4 mr-1" />
                                    {t('common.delete')}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sold Items Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t('dashboard.soldItems')}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        {t('item.number')} {getSortIcon('itemNumber')}
                      </th>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                        {t('item.title')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        {t('item.category')} {getSortIcon('category')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        {t('item.size')} {getSortIcon('size')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        {t('item.condition')} {getSortIcon('condition')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        {t('item.price')} {getSortIcon('price')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        {t('item.itemStatus')} {getSortIcon('status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {(isTableEditMode ? editableItems : items)
                      .filter(item => item.status === 'sold')
                      .map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {item.itemNumber}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                            <div className="flex items-center">
                              <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <div className="font-medium text-gray-900">{item.title}</div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {getCategoryLabel(item.category)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.size}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {getConditionLabel(item.condition)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            <div className="flex items-center">
                              <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                              {item.price.toFixed(2)} CHF
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {getStatusLabel(item.status)}
                            </span>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 