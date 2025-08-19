import React from 'react'
import { useForm } from 'react-hook-form'
import { PhotoIcon } from '@heroicons/react/24/outline'
import type { Item } from '../../types'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface ItemFormData {
  title: string
  description: string
  price: number
  size: string
  condition: string
  category: string
  image?: FileList
}

interface ItemFormProps {
  item?: Item
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const ItemForm: React.FC<ItemFormProps> = ({ item, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ItemFormData>({
    defaultValues: item ? {
      title: item.title,
      description: item.description,
      price: item.price,
      size: item.size,
      condition: item.condition,
      category: item.category,
    } : undefined,
  })

  const watchedImage = watch('image')
  const imagePreview = watchedImage?.[0] ? URL.createObjectURL(watchedImage[0]) : null

  const handleFormSubmit = async (data: ItemFormData) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('price', data.price.toString())
    formData.append('size', data.size)
    formData.append('condition', data.condition)
    formData.append('category', data.category)
    
    if (data.image?.[0]) {
      formData.append('image', data.image[0])
    }

    await onSubmit(formData)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {item ? 'Edit Item' : 'Add New Item'}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Input
            label="Title"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
            placeholder="e.g., Blue Summer Dress"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={3}
              className="input-field resize-none"
              placeholder="Describe the item in detail..."
            />
            {errors.description && (
              <p className="text-sm text-error-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Price (CHF)"
              type="number"
              step="0.50"
              min="0.50"
              {...register('price', { 
                required: 'Price is required',
                min: { value: 0.5, message: 'Minimum price is 0.50 CHF' }
              })}
              error={errors.price?.message}
              placeholder="10.00"
            />

            <Input
              label="Size"
              {...register('size', { required: 'Size is required' })}
              error={errors.size?.message}
              placeholder="e.g., 104, M, 38"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Condition
              </label>
              <select
                {...register('condition', { required: 'Condition is required' })}
                className="input-field"
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="very_good">Very Good</option>
                <option value="good">Good</option>
                <option value="acceptable">Acceptable</option>
              </select>
              {errors.condition && (
                <p className="text-sm text-error-600">{errors.condition.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="input-field"
              >
                <option value="">Select category</option>
                <option value="clothing">Clothing</option>
                <option value="shoes">Shoes</option>
                <option value="toys">Toys</option>
                <option value="accessories">Accessories</option>
              </select>
              {errors.category && (
                <p className="text-sm text-error-600">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Image (Optional)
            </label>
            <div className="flex justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 hover:border-primary-400 transition-colors duration-200">
              <div className="text-center">
                {imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <PhotoIcon className="mx-auto h-12 w-12 text-slate-400" />
                )}
                <div className="mt-4 flex text-sm leading-6 text-slate-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      {...register('image')}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-slate-600">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <Button variant="secondary" onClick={onCancel} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {item ? 'Update Item' : 'Create Item'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}

export default ItemForm