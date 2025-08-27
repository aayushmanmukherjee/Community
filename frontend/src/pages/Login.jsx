import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/Appcontext'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'

const Login = () => {

  const {setToken, axios} = useAppContext()

    const [name, setName] = useState('')
      const [username, setUsername] = useState('')
      const [password, setPassword] = useState('')
      const [profile_photo, setProfilePhoto] = useState(null)

      const [login, setLogin] = useState(false)

      const handleLogin = async (e) => {
  e.preventDefault();
  try {
    if (login) {
      // ---- LOGIN ----
      const { data } = await axios.post("/api/user/login", {
        username,
        password,
      });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = data.token;
      } else {
        toast.error(data.message);
      }
    } else {
      // ---- SIGNUP ----
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("password", password);

      if (profile_photo) {
        formData.append("profile_photo", profile_photo); // multer handles this
      }

      const { data } = await axios.post("/api/user/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = data.token;
      } else {
        toast.error(data.message);
      }
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  return (
    <>
    <div className='bg-gray-100 min-h-screen w-screen flex max-sm:flex-col max-sm:gap-5 justify-center items-center px-20 max-xl:px-10 max-md:px-5'>
        <div className='min-w-1/2 flex flex-col gap-3 max-sm:gap-1 max-sm:items-center'>
        <h1 className='text-blue-500 text-7xl max-lg:text-5xl max-md:text-3xl font-bold cursor-default'>Community</h1>
        <p className='text-2xl max-lg:text-xl max-md:text-sm max-sm:text-center cursor-default'>Community is a social platform for <br />family and close friends to connect <br /><span className='font-bold'>Whatsapp-like groups with Instagram-like feed!</span></p>
        </div>

<div className='shadow rounded-2xl min-w-1/2 max-sm:w-full bg-white'>
  <form onSubmit={handleLogin} className="flex flex-col gap-2 px-2 py-2">
    {login ? (
      <>
        <input
          type="text"
          placeholder="Username"
          className="rounded-4xl max-md:text-sm max-md:py-1 pl-1 py-2 border border-gray-200"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="rounded-4xl max-md:text-sm max-md:py-1 pl-1 py-2 border border-gray-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="border border-gray-200 max-md:text-sm max-md:py-1 px-2 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-xl cursor-pointer max-w-[400px] mb-2 self-center"
        >
          Log In
        </button>
      </>
    ) : (
      <>
        <input
          type="text"
          placeholder="Full Name"
          className="rounded-4xl max-md:text-sm max-md:py-1 pl-1 py-2 border border-gray-200"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          className="rounded-4xl max-md:text-sm max-md:py-1 pl-1 py-2 border border-gray-200"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="rounded-4xl max-md:text-sm max-md:py-1 pl-1 py-2 border border-gray-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label
          htmlFor="image"
          className="cursor-pointer rounded-lg flex flex-col items-center"
        >
          <img
            src={
              profile_photo instanceof File
                ? URL.createObjectURL(profile_photo)
                : assets.profile_holder
            }
            className="w-[100px] max-md:w-[50px] h-[100px] max-md:h-[50px] rounded-full object-cover"
          />
          <p className="text-sm">Profile Photo</p>
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setProfilePhoto(e.target.files[0])}
          />
        </label>
        <button
          type="submit"
          className="border border-gray-200 px-2 py-3 max-md:text-sm max-md:py-1 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-xl cursor-pointer max-w-[400px] mb-2 self-center"
        >
          Create Account
        </button>
      </>
    )}
  </form>
  <p onClick={()=>setLogin(!login)} className='text-sm cursor-pointer text-center py-2'>{login ? "Create a new Account" : "Already have an account?"}</p>
</div>

              
              

      
    </div>
    <Footer/>
    </>
  )
}

export default Login
