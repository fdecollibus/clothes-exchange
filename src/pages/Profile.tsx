import React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { 
  UserIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  CreditCardIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

interface ProfileForm {
  name: string
  email: string
  street: string
  city: string
  iban: string
}

export function Profile() {
  const { user, updateProfile, isLoading } = useAuthStore()
  const [success, setSuccess] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      street: user?.street || '',
      city: user?.city || '',
      iban: user?.iban || '',
    },
  })

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile(data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Profil bearbeiten</h1>
        <p className="text-gray-600">
          Verwalten Sie Ihre persönlichen Informationen und Verkäuferdetails
        </p>
      </motion.div>

      <Card className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Profil erfolgreich aktualisiert!
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Vollständiger Name"
              icon={<UserIcon className="h-5 w-5 text-gray-400" />}
              {...register('name', {
                required: 'Name ist erforderlich',
                minLength: {
                  value: 2,
                  message: 'Name muss mindestens 2 Zeichen lang sein',
                },
              })}
              error={errors.name?.message}
            />

            <Input
              label="E-Mail-Adresse"
              type="email"
              icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
              {...register('email', {
                required: 'E-Mail ist erforderlich',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Ungültige E-Mail-Adresse',
                },
              })}
              error={errors.email?.message}
            />
          </div>

          <Input
            label="Straße und Hausnummer"
            icon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
            {...register('street')}
            error={errors.street?.message}
          />

          <Input
            label="Stadt und Postleitzahl"
            icon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
            {...register('city')}
            error={errors.city?.message}
          />

          <Input
            label="IBAN (für Auszahlungen)"
            icon={<CreditCardIcon className="h-5 w-5 text-gray-400" />}
            placeholder="CH93 0076 2011 6238 5295 7"
            {...register('iban', {
              pattern: {
                value: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/,
                message: 'Ungültiges IBAN-Format',
              },
            })}
            error={errors.iban?.message}
          />

          {user?.sellerNumber && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verkäufernummer
              </label>
              <div className="text-lg font-semibold text-primary-600">
                {user.sellerNumber}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Ihre eindeutige Verkäufernummer für die Kinderkleiderbörse
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Abbrechen
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Profil speichern
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}