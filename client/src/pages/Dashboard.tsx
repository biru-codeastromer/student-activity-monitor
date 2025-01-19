import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  ClockIcon, 
  TrophyIcon 
} from '@heroicons/react/24/outline'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

interface Stats {
  gpa: number
  attendance: number
  completedActivities: number
  upcomingDeadlines: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    gpa: 0,
    attendance: 0,
    completedActivities: 0,
    upcomingDeadlines: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/students/stats')
        setStats(response.data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsCards = [
    {
      name: 'Current GPA',
      value: stats.gpa.toFixed(2),
      icon: AcademicCapIcon,
      change: '+0.2',
      changeType: 'increase',
      bgColor: 'bg-blue-500'
    },
    {
      name: 'Attendance Rate',
      value: `${stats.attendance}%`,
      icon: ChartBarIcon,
      change: '+2.5%',
      changeType: 'increase',
      bgColor: 'bg-green-500'
    },
    {
      name: 'Completed Activities',
      value: stats.completedActivities,
      icon: TrophyIcon,
      change: '+5',
      changeType: 'increase',
      bgColor: 'bg-purple-500'
    },
    {
      name: 'Upcoming Deadlines',
      value: stats.upcomingDeadlines,
      icon: ClockIcon,
      change: '2 this week',
      changeType: 'neutral',
      bgColor: 'bg-orange-500'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome back, {user?.profile.firstName}!
        </h1>
        
        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${stat.bgColor}`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold
                    ${stat.changeType === 'increase' ? 'text-green-600' : 
                      stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'}`}
                >
                  {stat.change}
                </p>
              </dd>
            </motion.div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activities</h2>
          <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            {/* Add activity list here */}
          </div>
        </div>

        {/* Progress Charts */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Academic Progress
            </h3>
            {/* Add Chart.js component here */}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Activity Distribution
            </h3>
            {/* Add Chart.js component here */}
          </div>
        </div>
      </div>
    </div>
  )
}
