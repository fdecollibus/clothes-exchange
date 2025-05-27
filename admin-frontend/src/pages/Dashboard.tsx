import React, { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import { 
  ClipboardDocumentListIcon, 
  PlusCircleIcon,
  ArrowDownTrayIcon,
  TagIcon,
  BanknotesIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpDownIcon,
  ChatBubbleLeftIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline'

interface Seller {
  _id: string
  name: string
  sellerNumber: string
  email: string
  street?: string
  city?: string
  iban?: string
  itemCount: number
  totalValue: number
}

interface Item {
  _id: string
  name: string
  description: string
  price: number
  size: string
  itemNumber: number
  category: string
  condition: string
  status: string
  adminComment?: string
  seller: {
    id: string
    name: string
    sellerNumber: string
    email: string
    city: string
    street: string
    iban: string
  }
}

interface ConsolidatedSeller {
  seller: {
    id: string
    name: string
    sellerNumber: string
    email: string
    city: string
    street: string
    iban: string
  }
  items: Item[]
}

type SortField = 'itemNumber' | 'category' | 'size' | 'condition' | 'price' | 'status' | 'sellerName' | 'sellerNumber';

const Dashboard = () => {
  const { t } = useTranslation()
  const [sellers, setSellers] = useState<Seller[]>([])
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [consolidated, setConsolidated] = useState<ConsolidatedSeller[]>([])
  const [consolidatedLoading, setConsolidatedLoading] = useState(false)
  const [consolidatedError, setConsolidatedError] = useState('')
  const [expandedSellers, setExpandedSellers] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>('itemNumber')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')

  // Calculate statistics
  const stats = useMemo(() => {
    const allItems = consolidated.flatMap(({ items }) => items);
    const totalItems = allItems.length;
    const totalValue = allItems.reduce((sum, item) => sum + (item.price || 0), 0);
    const soldItems = allItems.filter(item => item.status === 'sold');
    const soldValue = soldItems.reduce((sum, item) => sum + (item.price || 0), 0);

    return {
      totalItems,
      totalValue,
      soldItems: soldItems.length,
      soldValue
    };
  }, [consolidated]);

  useEffect(() => {
    fetchSellers()
    fetchConsolidated()
  }, [])

  useEffect(() => {
    if (selectedSeller) {
      fetchSellerItems(selectedSeller)
    }
  }, [selectedSeller])

  const fetchSellers = async () => {
    try {
      const response = await api.get('/admin/sellers')
      setSellers(response.data)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('fetchError'))
      setLoading(false)
    }
  }

  const fetchSellerItems = async (sellerId: string) => {
    try {
      const response = await api.get(`/admin/sellers/${sellerId}/items`)
      setItems(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('fetchError'))
    }
  }

  const fetchConsolidated = async () => {
    setConsolidatedLoading(true)
    setConsolidatedError('')
    try {
      const response = await api.get('/admin/items/consolidated')
      setConsolidated(response.data)
    } catch (err) {
      setConsolidatedError(err instanceof Error ? err.message : t('fetchError'))
    } finally {
      setConsolidatedLoading(false)
    }
  }

  const downloadPdf = async (sellerId: string) => {
    try {
      const response = await api.get(
        `/admin/sellers/${sellerId}/items/download`,
        { responseType: 'blob' }
      )
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `seller-${sellerId}-items.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('pdfError'))
    }
  }

  const downloadConsolidatedPdf = async () => {
    try {
      const response = await api.get(
        '/admin/items/consolidated/download',
        { responseType: 'blob' }
      )
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'all-items.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('pdfError'))
    }
  }

  const downloadConsolidatedLabels = async () => {
    try {
      const response = await api.get(
        '/admin/items/consolidated/labels',
        { responseType: 'blob' }
      )
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'all-labels.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('pdfError'))
    }
  }

  const toggleSeller = (id: string) => {
    setExpandedSellers((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      kleidung: 'Kleidung',
      schuhe: 'Schuhe',
      spielzeug: 'Spielzeug',
      accessoires: 'Accessoires'
    };
    return labels[category] || category;
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

  const getSortedItems = (items: Item[]) => {
    try {
      return [...items].sort((a, b) => {
        const direction = sortDirection === 'asc' ? 1 : -1;
        
        switch (sortField) {
          case 'itemNumber':
            return ((a.itemNumber || 0) - (b.itemNumber || 0)) * direction;
          case 'category':
            return (a.category || '').localeCompare(b.category || '') * direction;
          case 'size':
            return (a.size || '').localeCompare(b.size || '') * direction;
          case 'condition':
            return (a.condition || '').localeCompare(b.condition || '') * direction;
          case 'price':
            return ((a.price || 0) - (b.price || 0)) * direction;
          case 'status':
            return (a.status || '').localeCompare(b.status || '') * direction;
          case 'sellerName':
            return ((a.seller?.name || '').localeCompare(b.seller?.name || '')) * direction;
          case 'sellerNumber':
            // Convert seller numbers to numbers for proper sorting
            const aNum = parseInt(a.seller?.sellerNumber || '0', 10);
            const bNum = parseInt(b.seller?.sellerNumber || '0', 10);
            return (aNum - bNum) * direction;
          default:
            return 0;
        }
      });
    } catch (error) {
      console.error('Error sorting items:', error);
      return items; // Return unsorted items if there's an error
    }
  };

  const handleEditSeller = (seller: Seller) => {
    setEditingSeller(seller)
    setIsEditModalOpen(true)
  }

  const handleSaveSeller = async (updatedSeller: Seller) => {
    try {
      // Format the data according to the backend's expectations
      const formattedData = {
        name: updatedSeller.name,
        email: updatedSeller.email,
        street: updatedSeller.street || '',
        city: updatedSeller.city || '',
        iban: updatedSeller.iban || ''
      }

      const response = await api.patch(`/auth/${updatedSeller._id}`, formattedData)
      
      // Update the local state with the response data
      setSellers(sellers.map(s => s._id === updatedSeller._id ? {
        ...s,
        name: response.data.name,
        email: response.data.email,
        street: response.data.street,
        city: response.data.city,
        iban: response.data.iban
      } : s))
      
      setIsEditModalOpen(false)
      setEditingSeller(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('fetchError'))
    }
  }

  const handleCommentEdit = (itemId: string, currentComment?: string) => {
    setSelectedItemId(itemId);
    setCommentText(currentComment || '');
    setIsCommentModalOpen(true);
  };

  const handleCommentSave = async () => {
    if (!selectedItemId) return;

    try {
      const response = await api.patch(`/admin/items/${selectedItemId}`, {
        adminComment: commentText
      });
      
      setItems(items.map(item => 
        item._id === selectedItemId ? { ...item, adminComment: response.data.adminComment } : item
      ));
      setIsCommentModalOpen(false);
      setSelectedItemId(null);
      setCommentText('');
      setError('');
    } catch (err: any) {
      console.error('Error saving comment:', err);
      setError(err.response?.data?.message || t('common.error'));
    }
  };

  const handleCommentCancel = () => {
    setIsCommentModalOpen(false);
    setSelectedItemId(null);
    setCommentText('');
  };

  const handleDelete = async (itemId: string) => {
    try {
      await api.delete(`/admin/items/${itemId}`)
      await fetchConsolidated()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('deleteError'))
    }
  }

  const handleReset = async (itemId: string) => {
    try {
      await api.patch(`/admin/items/${itemId}`, { status: 'available' })
      await fetchConsolidated()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('resetError'))
    }
  }

  if (loading) {
    return <div className="text-center">{t('loading')}</div>
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>
  }

  return (
    <div className="space-y-8 p-6">
      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <ClipboardDocumentListIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.totalItems')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <BanknotesIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.totalValue')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalValue.toFixed(2)} CHF</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <TagIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.soldItems')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.soldItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <BanknotesIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.soldValue')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.soldValue.toFixed(2)} CHF</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sellers List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t('dashboard.sellers')}
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {sellers.map((seller) => (
            <li key={seller._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {seller.name} (#{seller.sellerNumber})
                    </p>
                  </div>
                  <div className="mt-2 flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{t('itemCount')}: {seller.itemCount}</span>
                      <span className="mx-2">•</span>
                      <span>{t('totalValue')}: {seller.totalValue.toFixed(2)} CHF</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditSeller(seller)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => setSelectedSeller(seller._id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t('viewItems')}
                  </button>
                  <button
                    onClick={() => downloadPdf(seller._id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    {t('downloadPdf')}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Seller Modal */}
      {isEditModalOpen && editingSeller && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('editSeller')}</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleSaveSeller(editingSeller)
            }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t('seller.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={editingSeller.name}
                    onChange={(e) => setEditingSeller({ ...editingSeller, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={editingSeller.email}
                    onChange={(e) => setEditingSeller({ ...editingSeller, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                    {t('street')}
                  </label>
                  <input
                    type="text"
                    id="street"
                    value={editingSeller.street || ''}
                    onChange={(e) => setEditingSeller({ ...editingSeller, street: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    {t('city')}
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={editingSeller.city || ''}
                    onChange={(e) => setEditingSeller({ ...editingSeller, city: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="iban" className="block text-sm font-medium text-gray-700">
                    {t('iban')}
                  </label>
                  <input
                    type="text"
                    id="iban"
                    value={editingSeller.iban || ''}
                    onChange={(e) => setEditingSeller({ ...editingSeller, iban: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setEditingSeller(null)
                  }}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items List */}
      {selectedSeller && items.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {t('sellerItems')}
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item._id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                      <p className="text-sm text-gray-500">{t('size')}: {item.size}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.price.toFixed(2)} CHF
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Show message when no items are available */}
      {selectedSeller && items.length === 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p>{t('noItems')}</p>
        </div>
      )}

      {/* Consolidated Items Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t('consolidatedItems')}
          </h3>
          <div className="flex space-x-4">
            <button
              onClick={downloadConsolidatedPdf}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
              {t('downloadPdf')}
            </button>
            <button
              onClick={downloadConsolidatedLabels}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <TagIcon className="h-4 w-4 mr-1" />
              {t('downloadLabels')}
            </button>
          </div>
        </div>
        <div className="p-4">
          {consolidatedLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : consolidatedError ? (
            <div className="text-red-600">{consolidatedError}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer">
                      {t('item.number')} {getSortIcon('itemNumber')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer">
                      {t('seller.name')} {getSortIcon('sellerName')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer">
                      {t('seller.number')} {getSortIcon('sellerNumber')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer">
                      {t('item.category')} {getSortIcon('category')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer">
                      {t('item.size')} {getSortIcon('size')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer">
                      {t('item.condition')} {getSortIcon('condition')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer">
                      {t('item.price')} {getSortIcon('price')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer">
                      {t('item.itemStatus')} {getSortIcon('status')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer">
                      {t('item.comment')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer">
                      {t('common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {getSortedItems(consolidated.flatMap(({ seller, items }) => 
                    items.map(item => ({ ...item, seller }))
                  )).map((item) => (
                    <tr key={item._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {item.itemNumber || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {item.seller?.name || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.seller?.sellerNumber ? `#${item.seller.sellerNumber}` : '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getCategoryLabel(item.category || '')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.size || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getConditionLabel(item.condition || '')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <BanknotesIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {(item.price || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status || '')}`}>
                          {getStatusLabel(item.status || '')}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {editingComment === item._id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder={t('item.commentPlaceholder')}
                            />
                            <button
                              onClick={handleCommentSave}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                            >
                              <CheckIcon className="h-4 w-4 mr-1" />
                              {t('common.save')}
                            </button>
                            <button
                              onClick={handleCommentCancel}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                            >
                              <XMarkIcon className="h-4 w-4 mr-1" />
                              {t('common.cancel')}
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="flex-grow">{item.adminComment || '-'}</span>
                            <button
                              onClick={() => handleCommentEdit(item._id, item.adminComment)}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                            >
                              <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                              {item.adminComment ? t('common.edit') : t('common.add')}
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex items-center space-x-3">
                          {item.status === 'sold' ? (
                            <button
                              onClick={() => handleReset(item._id)}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                            >
                              <ArrowUturnLeftIcon className="h-4 w-4 mr-1" />
                              {t('common.reset')}
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditSeller({
                                  _id: item.seller.id,
                                  name: item.seller.name,
                                  sellerNumber: item.seller.sellerNumber,
                                  email: item.seller.email,
                                  city: item.seller.city,
                                  street: item.seller.street,
                                  iban: item.seller.iban,
                                  itemCount: 0,
                                  totalValue: 0
                                })}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                              >
                                <PencilIcon className="h-4 w-4 mr-1" />
                                {t('common.edit')}
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
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
          )}
        </div>
      </div>

      {/* Comment Modal */}
      {isCommentModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('item.comment')}
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                  {t('item.comment')}
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={t('item.commentPlaceholder')}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCommentCancel}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleCommentSave}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard 