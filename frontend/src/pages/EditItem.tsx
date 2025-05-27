import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import api from '../utils/axios';

interface FormData {
  title: string;
  description: string;
  size: string;
  condition: string;
  category: string;
  price: number;
  status: string;
}

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [originalData, setOriginalData] = useState<FormData>({
    title: '',
    description: '',
    size: '',
    condition: '',
    category: '',
    price: 0,
    status: '',
  });
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    size: '',
    condition: '',
    category: '',
    price: 0,
    status: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadItem = async () => {
      try {
        const response = await api.get(`/api/items/${id}`);
        setOriginalData(response.data);
        setFormData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || t('common.error'));
        console.error('Error loading item:', err);
      }
    };

    if (id) {
      loadItem();
    }
  }, [id, t]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const getChangedFields = () => {
    return Object.keys(formData).reduce((changes: Partial<FormData>, key: string) => {
      const k = key as keyof FormData;
      if (formData[k] !== originalData[k]) {
        changes[k] = formData[k];
      }
      return changes;
    }, {});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!user?._id) {
        throw new Error('User not authenticated');
      }

      const changes = getChangedFields();
      if (Object.keys(changes).length === 0) {
        navigate('/dashboard');
        return;
      }

      await api.patch(`/api/items/${id}`, changes);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error updating item:', err);
      setError(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {t('item.edit')}
          </h2>

          {error && (
            <div className="mt-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                {t('item.title')}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                {t('item.description')}
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="size" className="block text-sm font-medium leading-6 text-gray-900">
                {t('item.size')}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="size"
                  id="size"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.size}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                {t('item.price')} (CHF)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0.5"
                  step="0.5"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="condition" className="block text-sm font-medium leading-6 text-gray-900">
                {t('item.condition')}
              </label>
              <div className="mt-2">
                <select
                  id="condition"
                  name="condition"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">{t('common.select')}</option>
                  <option value="neu">{t('item.conditions.new')}</option>
                  <option value="sehr_gut">{t('item.conditions.very_good')}</option>
                  <option value="gut">{t('item.conditions.good')}</option>
                  <option value="akzeptabel">{t('item.conditions.acceptable')}</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                {t('item.category')}
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  name="category"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">{t('common.select')}</option>
                  <option value="kleidung">{t('item.categories.clothing')}</option>
                  <option value="schuhe">{t('item.categories.shoes')}</option>
                  <option value="spielzeug">{t('item.categories.toys')}</option>
                  <option value="accessoires">{t('item.categories.accessories')}</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                {t('item.itemStatus')}
              </label>
              <div className="mt-2">
                <select
                  id="status"
                  name="status"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="available">{t('item.status.available')}</option>
                  <option value="sold">{t('item.status.sold')}</option>
                  <option value="reserved">{t('item.status.reserved')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          {isLoading ? t('common.loading') : t('common.save')}
        </button>
      </div>
    </form>
  );
} 