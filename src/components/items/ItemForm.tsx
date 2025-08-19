import React from 'react'
import { useForm } from 'react-hook-form'
import { PhotoIcon } from '@heroicons/react/24/outline'
import type { Item } from '../../types'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useItemsStore } from '../../stores/itemsStore'
import { useAuthStore } from '../../stores/authStore'

interface ItemFormProps {
  item?: Item
  onSuccess?: () => void
}

interface FormData {
  title: string
  description: string
  price: number
  size: string
  condition: 'new' | 'very_good' | 'good' | 'acceptable'
  category: 'clothing' | 'shoes' | 'toys' | 'accessories'
}

export function ItemForm({ item, onSuccess }: ItemFormProps) {
  const { addItem, updateItem, isLoading } = useItemsStore()
  const { user } = useAuthStore()
  const [imagePreview, setImagePreview] = React.useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: item ? {
      title: item.title,
      description: item.description,
      price: item.price,
      size: item.size,
      condition: item.condition,
      category: item.category,
    } : undefined,
  })

  const onSubmit = async (data: FormData) => {
    if (!user) return

    try {
      if (item) {
        await updateItem(item.id, data)
      } else {
        await addItem({
          ...data,
          sellerId: user.id,
          status: 'available',
        })
      }
      reset()
      setImagePreview('')
      onSuccess?.()
    } catch (error) {
      console.error('Error saving item:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input
            label="Titel"
            {...register('title', { required: 'Titel ist erforderlich' })}
            error={errors.title?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beschreibung
            </label>
            <textarea
              {...register('description', { required: 'Beschreibung ist erforderlich' })}
              rows={4}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preis (CHF)"
              type="number"
              step="0.50"
              min="0.50"
              {...register('price', { 
                required: 'Preis ist erforderlich',
                min: { value: 0.5, message: 'Mindestpreis ist 0.50 CHF' }
              })}
              error={errors.price?.message}
            />

            <Input
              label="Größe"
              {...register('size', { required: 'Größe ist erforderlich' })}
              error={errors.size?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zustand
              </label>
              <select
                {...register('condition', { required: 'Zustand ist erforderlich' })}
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Auswählen...</option>
                <option value="new">Neu</option>
                <option value="very_good">Sehr gut</option>
                <option value="good">Gut</option>
                <option value="acceptable">Akzeptabel</option>
              </select>
              {errors.condition && (
                <p className="text-sm text-red-600 mt-1">{errors.condition.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie
              </label>
              <select
                {...register('category', { required: 'Kategorie ist erforderlich' })}
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Auswählen...</option>
                <option value="clothing">Kleidung</option>
                <option value="shoes">Schuhe</option>
                <option value="toys">Spielzeug</option>
                <option value="accessories">Accessoires</option>
              </select>
              {errors.category && (
                <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto (optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
            {imagePreview ? (
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto h-32 w-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview('')}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Foto entfernen
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <label className="cursor-pointer">
                    <span className="text-primary-600 hover:text-primary-500 font-medium">
                      Foto hochladen
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF bis 5MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => reset()}>
          Zurücksetzen
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {item ? 'Artikel aktualisieren' : 'Artikel hinzufügen'}
        </Button>
      </div>
    </form>
  )
}