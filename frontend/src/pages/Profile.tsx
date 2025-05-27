import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import api from '../utils/axios';

interface ProfileData {
  name: string;
  street: string;
  city: string;
  iban: string;
  sellerNumber: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, loadUser } = useAuthStore();
  const [originalData, setOriginalData] = useState<ProfileData>({
    name: '',
    street: '',
    city: '',
    iban: '',
    sellerNumber: 0,
  });
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    street: '',
    city: '',
    iban: '',
    sellerNumber: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/api/auth/me');
        const profileData = response.data;
        setOriginalData(profileData);
        setFormData(profileData);
      } catch (err: any) {
        console.error('Error loading profile:', err);
        setError(err.response?.data?.message || t('common.error'));
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user, t]);

  const getChangedFields = () => {
    const changes: Partial<ProfileData> = {};
    (Object.keys(formData) as Array<keyof ProfileData>).forEach((key) => {
      if (key !== 'sellerNumber' && formData[key] !== originalData[key]) {
        changes[key] = formData[key];
      }
    });
    return changes;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const changes = getChangedFields();
      if (Object.keys(changes).length === 0) {
        setSuccessMessage(t('profile.updateSuccess'));
        return;
      }

      await api.patch('/api/auth/profile', changes);
      setSuccessMessage(t('profile.updateSuccess'));
      await loadUser(); // Reload user data to update the UI
      setOriginalData(formData); // Update original data after successful save
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert IBAN to uppercase if it's the IBAN field
    const updatedValue = name === 'iban' ? value.toUpperCase() : value;
    setFormData(prev => ({
      ...prev,
      [name]: updatedValue
    }));
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">{t('profile.title')}</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6 max-w-2xl">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {successMessage && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{successMessage}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t('profile.name')}
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                {t('profile.street')}
              </label>
              <input
                type="text"
                name="street"
                id="street"
                value={formData.street}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                placeholder={t('profile.streetPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                {t('profile.city')}
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                placeholder={t('profile.cityPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="iban" className="block text-sm font-medium text-gray-700">
                {t('profile.iban')}
              </label>
              <input
                type="text"
                name="iban"
                id="iban"
                value={formData.iban}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                placeholder="DE89 3704 0044 0532 0130 00"
                pattern="[A-Z]{2}[0-9]{2}(?:\s?[0-9]{4}){4}\s?[0-9]{2}"
                title={t('profile.ibanHelp')}
              />
              <p className="mt-1 text-sm text-gray-500">
                {t('profile.ibanHelp')}
              </p>
            </div>

            <div>
              <label htmlFor="sellerNumber" className="block text-sm font-medium text-gray-700">
                {t('profile.sellerNumber')}
              </label>
              <input
                type="text"
                name="sellerNumber"
                id="sellerNumber"
                value={formData.sellerNumber || ''}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
              />
              <p className="mt-1 text-sm text-gray-500">
                {t('profile.sellerNumberHelp')}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLoading ? t('common.loading') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 