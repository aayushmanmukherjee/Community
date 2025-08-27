import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Grouppage from './pages/Grouppage'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/Appcontext'

const App = () => {
  const {token} = useAppContext()
  return (
    <>
    <Toaster/>
       <Routes>
      <Route path='/' element={token ? <Home/> : <Login/>} />
      <Route path='/profile' element={<Profile/>} />
      <Route path='/:groupid' element={<Grouppage/>} />
      </Routes>
    </>
  )
}

export default App
