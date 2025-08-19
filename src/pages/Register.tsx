import React from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function Register() {
  const navigate = useNavigate()
  const { register: authRegister, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState('')

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>()

  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('')
      await authRegister(data.name, data.email, data.password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-white font-bold text-2xl">KC</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Konto erstellen</h1>
          <p className="text-gray-600">Beginnen Sie noch heute mit dem Verkauf</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <Input
              label="Vollständiger Name"
              {...registerField('name', {
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
              {...registerField('email', {
                required: 'E-Mail ist erforderlich',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Ungültige E-Mail-Adresse',
                },
              })}
              error={errors.email?.message}
            />

            <div className="relative">
              <Input
                label="Passwort"
                type={showPassword ? 'text' : 'password'}
                {...registerField('password', {
                  required: 'Passwort ist erforderlich',
                  minLength: {
                    value: 6,
                    message: 'Passwort muss mindestens 6 Zeichen lang sein',
                  },
                })}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <Input
              label="Passwort bestätigen"
              type="password"
              {...registerField('confirmPassword', {
                required: 'Passwort-Bestätigung ist erforderlich',
                validate: (value) =>
                  value === password || 'Passwörter stimmen nicht überein',
              })}
              error={errors.confirmPassword?.message}
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              Konto erstellen
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Bereits ein Konto?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Hier anmelden
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}