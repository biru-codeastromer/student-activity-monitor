import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import axios from 'axios'

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  department: string
  year: number
  github: string
  linkedin: string
  twitter: string
}

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      firstName: user?.profile.firstName || '',
      lastName: user?.profile.lastName || '',
      email: user?.email || '',
      department: user?.profile.department || '',
      year: user?.profile.year || 1,
      github: user?.profile.socialLinks?.github || '',
      linkedin: user?.profile.socialLinks?.linkedin || '',
      twitter: user?.profile.socialLinks?.twitter || ''
    }
  })

  const onSubmit = async (data: ProfileForm) => {
    try {
      setIsLoading(true)
      const response = await axios.put('/api/auth/profile', {
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          department: data.department,
          year: data.year,
          socialLinks: {
            github: data.github,
            linkedin: data.linkedin,
            twitter: data.twitter
          }
        }
      })
      
      updateUser(response.data)
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-primary-600 to-secondary-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-primary-600">
                  {user?.profile.firstName?.[0]}{user?.profile.lastName?.[0]}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-white">
                    {user?.profile.firstName} {user?.profile.lastName}
                  </h2>
                  <p className="text-primary-100">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <motion.form
            initial={false}
            animate={isEditing ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`px-4 py-5 sm:p-6 ${isEditing ? '' : 'hidden'}`}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <input
                  type="text"
                  {...register('department', { required: 'Department is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Year
                </label>
                <select
                  {...register('year', { required: 'Year is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value={1}>First Year</option>
                  <option value={2}>Second Year</option>
                  <option value={3}>Third Year</option>
                  <option value={4}>Fourth Year</option>
                </select>
                {errors.year && (
                  <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  {...register('github')}
                  placeholder="https://github.com/username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  {...register('linkedin')}
                  placeholder="https://linkedin.com/in/username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Twitter Profile
                </label>
                <input
                  type="url"
                  {...register('twitter')}
                  placeholder="https://twitter.com/username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </motion.form>

          {/* Profile Info */}
          <motion.div
            initial={false}
            animate={!isEditing ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`px-4 py-5 sm:p-6 ${!isEditing ? '' : 'hidden'}`}
          >
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user?.profile.department}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Year</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user?.profile.year}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Social Profiles</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  <ul className="border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-700">
                    {user?.profile.socialLinks?.github && (
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">GitHub</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <a href={user.profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:text-primary-500">
                            View
                          </a>
                        </div>
                      </li>
                    )}
                    {user?.profile.socialLinks?.linkedin && (
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">LinkedIn</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <a href={user.profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:text-primary-500">
                            View
                          </a>
                        </div>
                      </li>
                    )}
                    {user?.profile.socialLinks?.twitter && (
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">Twitter</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <a href={user.profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:text-primary-500">
                            View
                          </a>
                        </div>
                      </li>
                    )}
                  </ul>
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
