import { useTranslation } from 'react-i18next';
import AdminSystemDoc from '../components/AdminSystemDoc';

export default function AdminSystemDocPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('admin.systemDoc')}</h1>
      <div className="w-full">
        <AdminSystemDoc />
      </div>
    </div>
  );
} 