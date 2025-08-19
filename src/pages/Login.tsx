import React from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

interface LoginForm {
  email: string
  password: string
}

export function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('')
      await login(data.email, data.password)
      navigate('/')
    } catch (err) {
      setError('Ungültige Anmeldedaten. Bitte versuchen Sie es erneut.')
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Willkommen zurück</h1>
          <p className="text-gray-600">Melden Sie sich in Ihrem Konto an</p>
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
              label="E-Mail-Adresse"
              type="email"
              {...register('email', {
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
                {...register('password', {
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

            <Button type="submit" isLoading={isLoading} className="w-full">
              Anmelden
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Noch kein Konto?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                Jetzt registrieren
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">Demo-Anmeldedaten:</p>
            <p className="text-xs text-gray-500">
              <strong>Admin:</strong> admin@example.com / password123<br />
              <strong>Verkäufer:</strong> maria@example.com / password123
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}