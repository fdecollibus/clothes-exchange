import { useState, useEffect } from 'react'
import api from '../utils/axios'

interface Seller {
  _id: string
  sellerNumber: string
  name: string
}

interface Item {
  _id: string
  name: string
  price: number
  sellerNumber: string
  itemNumber: number
  category: string
}

interface AvailableItem {
  _id: string
  itemNumber: number
  title: string
  price: number
}

export default function Checkout() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [selectedSeller, setSelectedSeller] = useState('')
  const [availableItems, setAvailableItems] = useState<AvailableItem[]>([])
  const [selectedItem, setSelectedItem] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Load sellers on component mount
  useEffect(() => {
    const loadSellers = async () => {
      try {
        console.log('Fetching sellers...')
        const response = await api.get('/api/checkout/sellers')
        console.log('Sellers response:', response.data)
        if (Array.isArray(response.data)) {
          setSellers(response.data)
        } else {
          console.error('Invalid sellers data format:', response.data)
          setError('Invalid data format received from server')
        }
      } catch (err) {
        console.error('Error loading sellers:', err)
        setError('Failed to load sellers. Please check if the backend server is running.')
      }
    }
    loadSellers()
  }, [])

  // Load available items when seller is selected
  useEffect(() => {
    const loadItems = async () => {
      if (!selectedSeller) {
        setAvailableItems([])
        return
      }
      try {
        console.log('Fetching items for seller:', selectedSeller)
        const response = await api.get(`/api/checkout/sellers/${selectedSeller}/items`)
        console.log('Items response:', response.data)
        if (Array.isArray(response.data)) {
          setAvailableItems(response.data)
        } else {
          console.error('Invalid items data format:', response.data)
          setError('Invalid data format received from server')
        }
      } catch (err) {
        console.error('Error loading items:', err)
        setError('Failed to load items')
      }
    }
    loadItems()
  }, [selectedSeller])

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSeller || !selectedItem) {
      setError('Please select both seller and item')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.get(`/api/checkout/${selectedSeller}/${selectedItem}`)
      const item = response.data
      setItems([...items, item])
      setSelectedItem('')
      setError('')
    } catch (err) {
      setError('Item not found or already sold')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleCheckout = async () => {
    try {
      const response = await api.post('/api/checkout/process', {
        items: items.map(item => item._id)
      })
      
      // Download the receipt
      const receiptUrl = response.data.receiptUrl
      window.open(receiptUrl, '_blank')
      
      setItems([])
      setSelectedSeller('')
      setSelectedItem('')
      setSuccess('Checkout completed successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to process checkout')
    }
  }

  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block pl-2 font-semibold text-xl text-gray-700">
                <h2 className="leading-relaxed">Checkout System</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Seller
                    </label>
                    <select
                      value={selectedSeller}
                      onChange={(e) => setSelectedSeller(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Select a seller</option>
                      {sellers.map((seller) => (
                        <option key={seller._id} value={seller.sellerNumber}>
                          {seller.sellerNumber} - {seller.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Item
                    </label>
                    <select
                      value={selectedItem}
                      onChange={(e) => setSelectedItem(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                      disabled={!selectedSeller}
                    >
                      <option value="">Select an item</option>
                      {availableItems.map((item) => (
                        <option key={item._id} value={item.itemNumber}>
                          {item.itemNumber} - {item.title} (€{item.price.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Adding...' : 'Add Item'}
                  </button>
                </form>

                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}
                {success && (
                  <div className="text-green-500 text-sm text-center">{success}</div>
                )}

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">Items in Cart</h3>
                  <div className="mt-4 space-y-4">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Seller: {item.sellerNumber} | Item: {item.itemNumber}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-medium">€{item.price.toFixed(2)}</p>
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {items.length > 0 && (
                    <div className="mt-6">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-medium">Total:</p>
                        <p className="text-lg font-medium">€{total.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Complete Checkout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 