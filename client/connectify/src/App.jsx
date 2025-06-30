import React from 'react'
import RegisterPage from './pages/RegisterPage'
import Navbar from './pages/Navbar'
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
   <div     className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1470&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <Navbar/>
    <Routes>
      <Route path='/register' element={<RegisterPage/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/' element={<Home/>}/>
            <Route path='/feed' element={
              <ProtectedRoute>
                <Feed/>
              </ProtectedRoute>
            }/>
           <Route path='/profile' element={ <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>}/>
    </Routes>
   </div>
  )
}

export default App