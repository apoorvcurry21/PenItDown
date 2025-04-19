import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header, Loader } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser()
        if (userData) {
          dispatch(login({userData}))
        } else {
          dispatch(logout())
        }
      } catch (error) {
        // Handle unauthorized access gracefully
        console.log("User not authenticated")
        dispatch(logout())
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [dispatch])
  
  return !loading ? (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
      <div className='flex-1 flex flex-col'>
        <Header />
        <main className='flex-1 px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-7xl mx-auto w-full'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Loader className1="h-20 w-20" className2="bg-teal-500"/>
    </div>
  )
}

export default App