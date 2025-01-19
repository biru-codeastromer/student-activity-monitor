import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tab } from '@headlessui/react'
import { 
  PlusIcon, 
  AcademicCapIcon, 
  BookOpenIcon, 
  TrophyIcon 
} from '@heroicons/react/24/outline'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface Activity {
  _id: string
  title: string
  type: string
  status: string
  progress: number
  description: string
  startDate: string
  endDate: string
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('all')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/activities')
      setActivities(response.data)
    } catch (error) {
      toast.error('Failed to fetch activities')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const categories = [
    { id: 'all', name: 'All Activities' },
    { id: 'academic', name: 'Academic', icon: AcademicCapIcon },
    { id: 'extracurricular', name: 'Extracurricular', icon: BookOpenIcon },
    { id: 'achievement', name: 'Achievements', icon: TrophyIcon },
  ]

  const filteredActivities = activities.filter(activity => 
    selectedType === 'all' ? true : activity.type === selectedType
  )

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Activities</h1>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Activity
          </button>
        </div>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-primary-900/20 p-1 mt-6">
            {categories.map((category) => (
              <Tab
                key={category.id}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-primary-700 shadow'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary-600'
                  )
                }
                onClick={() => setSelectedType(category.id)}
              >
                <div className="flex items-center justify-center space-x-2">
                  {category.icon && <category.icon className="h-5 w-5" />}
                  <span>{category.name}</span>
                </div>
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                ) : filteredActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No activities found</p>
                  </div>
                ) : (
                  filteredActivities.map((activity) => (
                    <motion.div
                      key={activity._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {activity.description}
                          </p>
                        </div>
                        <span
                          className={classNames(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getStatusColor(activity.status)
                          )}
                        >
                          {activity.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="mt-4">
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-primary-600">
                                Progress
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-primary-600">
                                {activity.progress}%
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                            <div
                              style={{ width: `${activity.progress}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          Start: {new Date(activity.startDate).toLocaleDateString()}
                        </div>
                        <div>
                          End: {new Date(activity.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}
