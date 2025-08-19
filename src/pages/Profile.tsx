import React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

interface ProfileFormData {
  name: string
  email: string
  street: string
  city: string
  iban: string
}

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      street: user?.street || '',
      city: user?.city || '',
      iban: user?.iban || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data)
    } catch (error) {
      // Error is handled by the store and toast
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
            <UserCircleIcon className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Profile Settings</h1>
        <p className="text-slate-600">Manage your account information</p>
      </motion.div>

      <Card glass className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              error={errors.name?.message}
            />

            <Input
              label="Email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
            />
          </div>

          <Input
            label="Street Address"
            {...register('street')}
            placeholder="123 Main Street"
          />

          <Input
            label="City"
            {...register('city')}
            placeholder="Zurich"
          />

          <Input
            label="IBAN"
            {...register('iban', {
              pattern: {
                value: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/,
                message: 'Invalid IBAN format',
              },
            })}
            error={errors.iban?.message}
            placeholder="CH93 0076 2011 6238 5295 7"
          />

          {user?.sellerNumber && (
            <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
              <p className="text-sm font-medium text-primary-900 mb-1">Seller Number</p>
              <p className="text-lg font-bold text-primary-600">#{user.sellerNumber}</p>
              <p className="text-xs text-primary-700 mt-1">
                This is your unique seller identifier
              </p>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-slate-200">
            <Button type="submit" isLoading={isSubmitting}>
              Update Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Profile