import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import { useAppContext } from '../context/Appcontext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import Footer from '../components/Footer'

const Profile = () => {

  const {setToken, axios} = useAppContext()
  const [data, setData] = useState()

  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleEdit = () => {
    setEdit(!edit)
  }

  const handleSave = async (e) => {
    setLoading(true)
  e.preventDefault()
  try {
    const token = localStorage.getItem("token")
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("username", data.username)

    if (data.profile_photo) {
      formData.append("profile_photo", data.profile_photo)
    }

    const { data: response } = await axios.put("/api/user/updateuser", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    if (response.success) {
      setData(response.user) 
    }
    setEdit(false)
    setLoading(false)
  } catch (error) {
    toast.error(error.message)
    setLoading(false)
  }
}

  const handleLogOut = () => {
    localStorage.removeItem("token")
    axios.defaults.headers.common['Authorization'] = null
    setToken(null)
    navigate('/')
  }

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem("token")
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const {data} = await  axios.delete('/api/user/deleteuser')
      if (data.success) {
        localStorage.removeItem("token")
        navigate("/")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchUser = async() => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        return navigate("/")
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const {data} = await axios.get('/api/user/getprofile')
      if(data.success) {
        setData(data.user)
      }
      setLoading(false)
    } catch (error) {
      toast.error(error.message)
      setLoading(false)

    }
  }

  useEffect(()=>{
    fetchUser()
  },[])

  return (
    <>
    {loading ? (<Loader/>) : (
    <>
      <Navbar />

      <div className="bg-gray-100 w-screen min-h-screen py-10 relative">
        {/* Profile Card */}
        {data && 
        <div className="rounded-4xl shadow w-4/5 mx-auto bg-white flex flex-col gap-2 items-center pt-5 mb-5 relative z-10 max-sm:min-h-full">
          <img
            src={
             data.profile_photo ? data.profile_photo
                : assets.profile_holder
            }
            className="w-[350px] rounded-full h-[350px] max-md:w-[250px] max-md:h-[250px] max-sm:w-[150px] max-sm:h-[150px]"
            alt="Profile"
          />
          <p className="text-2xl font-bold">{data.name}</p>
          <p className="text-xl text-gray-500">@{data.username}</p>
          <div className="flex gap-20 justify-between pb-10">
            <button
              onClick={handleEdit}
              className="border border-gray-200 px-2 py-3 max-sm:text-sm max-sm:py-1 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-xl cursor-pointer"
            >
              Edit Profile
            </button>
            <button onClick={handleLogOut} className="border border-gray-200 px-2 py-3 max-sm:text-sm max-sm:py-1 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-xl cursor-pointer">
              Log Out
            </button>
          </div>
        </div>
}

        {/* Edit Modal */}
        {edit && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
            <div className="rounded-4xl shadow w-3/5 max-w-[600px] bg-white flex flex-col gap-2 pt-5 px-5 relative">
            <div className='flex justify-between items-center'>
              <h2 className="text-2xl max-sm:text-xl font-bold py-2">Edit</h2>
              <button onClick={()=>setEdit(false)} className='rounded-full px-2 py-1 hover:bg-gray-100 transition-all duration-200 cursor-pointer'>X</button>
              </div>
              <button onClick={deleteAccount} className='max-sm:py-1 max-sm:w-[150px] border border-gray-200 px-1 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 text-sm cursor-pointer w-[200px]'>Delete Account</button>
              <form onSubmit={handleSave} className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Change Name"
                  className="rounded-4xl max-sm:py-1 max-sm:text-sm pl-1 py-2 border border-gray-200"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Change Username"
                  className="rounded-4xl max-sm:py-1 max-sm:text-sm pl-1 py-2 border border-gray-200"
                  value={data.username}
                  onChange={(e) => setData({ ...data, username: e.target.value })}
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer rounded-lg flex flex-col items-center"
                >
                  <img
                    src={
                     data.profile_photo ? data.profile_photo : assets.profile_holder
                    }
                    className="w-[100px] h-[100px] max-sm:w-[50px] max-sm:h-[50px] rounded-full object-cover"
                    alt="Profile"
                  />
                  <p className="text-sm">Edit Profile Photo</p>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    hidden
                    onChange={(e) => setData({ ...data, profile_photo: e.target.files[0] })}
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="border border-gray-200 max-sm:py-1 max-sm:text-sm px-2 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-xl cursor-pointer max-w-[400px] mb-2 self-center"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </> ) }
    </>
  )
}

export default Profile