import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  ShoppingBagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../stores/authStore'
import Button from '../ui/Button'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.header 
      className="sticky top-0 z-40 w-full border-b border-white/20 bg-white/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Clothes Exchange</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/dashboard" 
            className="text-slate-600 hover:text-primary-600 transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link 
            to="/items/new" 
            className="text-slate-600 hover:text-primary-600 transition-colors duration-200"
          >
            Add Item
          </Link>
          {user?.isAdmin && (
            <Link 
              to="/admin" 
              className="text-slate-600 hover:text-primary-600 transition-colors duration-200"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
            <UserCircleIcon className="h-5 w-5" />
            <span>{user?.name}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="p-2"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header