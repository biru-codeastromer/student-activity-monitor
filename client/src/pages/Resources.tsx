import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentIcon, 
  VideoCameraIcon, 
  LinkIcon, 
  NewspaperIcon,
  CloudArrowDownIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface Resource {
  _id: string
  title: string
  description: string
  type: string
  category: string
  content: {
    url: string
    text: string
    fileType: string
  }
  author: {
    _id: string
    profile: {
      firstName: string
      lastName: string
    }
  }
  stats: {
    views: number
    downloads: number
    likes: number
  }
  createdAt: string
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await axios.get('/api/resources')
      setResources(response.data)
    } catch (error) {
      toast.error('Failed to fetch resources')
    } finally {
      setIsLoading(false)
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return DocumentIcon
      case 'video':
        return VideoCameraIcon
      case 'link':
        return LinkIcon
      default:
        return NewspaperIcon
    }
  }

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'study_material', name: 'Study Materials' },
    { id: 'event', name: 'Events' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'competition', name: 'Competitions' },
  ]

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Resources</h1>

        {/* Search and Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No resources found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource, index) => {
                const Icon = getResourceIcon(resource.type)
                
                return (
                  <motion.div
                    key={resource._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                            {resource.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {resource.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <CloudArrowDownIcon className="h-5 w-5 mr-1" />
                            {resource.stats.downloads}
                          </div>
                          <div className="flex items-center">
                            <HeartIcon className="h-5 w-5 mr-1" />
                            {resource.stats.likes}
                          </div>
                          <div>
                            {new Date(resource.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="button"
                          className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          View Resource
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
