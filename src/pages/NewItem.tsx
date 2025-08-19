import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { ItemForm } from '../components/items/ItemForm'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function NewItem() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="p-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Neuen Artikel hinzufügen</h1>
          <p className="text-gray-600 mt-2">
            Fügen Sie einen neuen Artikel zu Ihrem Verkaufssortiment hinzu
          </p>
        </div>
      </motion.div>

      <Card className="p-8">
        <ItemForm onSuccess={handleSuccess} />
      </Card>
    </div>
  )
}