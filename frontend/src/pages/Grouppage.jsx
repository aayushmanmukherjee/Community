import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import Post from "../components/Post";
import { useAppContext } from "../context/Appcontext";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

const Grouppage = () => {

  const {axios} = useAppContext()
  const navigate = useNavigate()
  
  const [currentGroup, setCurrentGroup] = useState()
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState([]);
  const [post, setPost] = useState(false);
  const [name, setName] = useState("");
  const [cover_photo, setCoverPhoto] = useState(null);
  const [group, setGroup] = useState(false);
  const [members, setMembers] = useState(false);
  const [showLink, setShowLink] = useState(false)

  const [loading, setLoading] = useState(false);

  const { groupid } = useParams();

  const toggleLink = () => {
    setShowLink(!showLink)
  }

  const handleGroup = () => {
    setGroup(!group);
  };
  const handlePost = () => {
    setPost(!post);
  };
  const handleMembers = () => {
    setMembers(!members);
  };
  const handleUpdateGroup = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const token = localStorage.getItem("token")
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const formData = new FormData();
      formData.append("name", name);
      if (cover_photo) {
        formData.append("cover_photo", cover_photo); // multer handles this
      }
      const { data } = await axios.put(`/api/group/updategroup/${groupid}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if(data.success) {
        setName(data.group.name)
        setCoverPhoto(data.group.cover_photo)
      }
      fetchGroup()
      setGroup(false);
      setLoading(false)
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  };

  const handleNewPost = async(e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const token = localStorage.getItem("token")
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const formData = new FormData();
    formData.append("content", content);
    photos.forEach((photo) => {
      formData.append("photos", photo); // multer matches field name "photos"
    });
    const { data } = await axios.post(`/api/post/createpost/${groupid}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if(data.success) {
        setContent("");
      setPhotos([]);
      fetchPosts();
    } else {
      toast.error(data.message)
    }
    setPost(false);
    setLoading(false);

    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  };

  const deleteGroup = async () => {
    try {
      const {data} = await axios.delete(`/api/group/deletegroup/${groupid}`)
      if(data.success) {
        fetchGroup()
        navigate("/")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeMember = async (memberid) => {
    try {
      const token = localStorage.getItem("token")
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const {data} = await axios.delete(`/api/group/removemember/${groupid}`, {
  data: { memberid },
});
      if(data.success) {
        fetchGroup()
        setMembers(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchGroup = async () => {
    setLoading(true)
    try {
      const {data} = await axios.get(`/api/group/getgroup/${groupid}`)
    if(data.success) {
      setCurrentGroup(data.group)
    }
    setLoading(false)
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const {data} = await axios.get(`/api/post/getposts/${groupid}`)
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=> {
    fetchGroup()
    fetchPosts()
  },[])
  
  return (
    <>
    {loading ? (
      <Loader/> ) :
      (
         <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen w-screen py-10 max-md:pt-5">
        <div className="bg-white rounded-4xl min-h-[5vh] shadow mx-auto w-4/5 flex justify-center gap-2 py-2 px-2">
          <button
            onClick={handleGroup}
            className="border border-gray-200 px-2 py-3 max-md:py-1 max-lg:text-sm rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-sm cursor-pointer"
          >
            Update Group
          </button>
          <button
            onClick={handleMembers}
            className="border border-gray-200 px-2 py-3 max-md:py-1 max-lg:text-sm rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-sm cursor-pointer"
          >
            Members
          </button>
        </div>

        <div className="bg-white rounded-4xl shadow mx-auto w-4/5 px-5 my-2">
          <div className="flex flex-col gap-2 pb-2">
            { currentGroup && 
                <div>
                  <img
                    src={currentGroup.cover_photo}
                    className="w-1/2 object-fill pt-1 mx-auto rounded-lg h-[350px] max-md:h-[250px] max-sm:h-[150px]"
                  />
                  <div className="flex flex-wrap py-2 border-b border-b-gray-200">
                   
                       { currentGroup.members.map((member)=>
                       <img
                            src={member.profile_photo}
                            className="h-6 w-6 border border-gray-500 rounded-full"
                          />
                        )}
                    
                  </div>
                  <div className="flex gap-2 justify-center items-center">
                  <h3 className="py-1 mb-1 text-2xl max-md:text-xl font-bold text-center border-b border-b-gray-200">
                    {currentGroup.name}
                  </h3>
                  <button onClick={toggleLink} className="text-sm hover:bg-blue-500 hover:text-white rounded-full transition-all duration-200 px-2 py-1 border border-gray-200">Show Code</button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={handlePost}
                      className="max-md:text-sm max-sm:py-1 border border-gray-200 px-1 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                      Create a Post!
                    </button>
                  </div>
                </div>
              }
          </div>
        </div>

        {posts.length > 0 ? ( posts.map((post)=> <div className="bg-white rounded-4xl shadow mx-auto w-3/5 max-md:w-[95%] px-5 mb-5">
                <Post posts={post}/>
                </div>)) : (
                  <div className="mt-10 w-full flex justify-center items-center text-2xl">
                    No Posts Available
                  </div>
                )}
           
        

{showLink && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
<div className="rounded-4xl shadow w-3/5 max-w-[600px] bg-white flex flex-col gap-2 pt-5 px-5 relative">
<div className="flex justify-between items-center">
  <h2 className="text-2xl max-sm:text-sm font-bold py-2">Group Join Code</h2>
                <button
                  onClick={() => setShowLink(false)}
                  className="rounded-full px-2 py-1 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  X
                </button>

</div>
<p className="rounded-4xl pl-1 py-2 max-sm:py-1 max-sm:text-sm border border-gray-200 my-2">{currentGroup.joinLink}</p>
</div>
  </div>
)}

        {group && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
            <div className="rounded-4xl shadow w-3/5 max-w-[600px] bg-white flex flex-col gap-2 pt-5 px-5 relative">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl max-sm:text-sm font-bold py-2">Update Group</h2>
                <button
                  onClick={() => setGroup(false)}
                  className="rounded-full px-2 py-1 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  X
                </button>
              </div>
              <button onClick={deleteGroup} className="border border-gray-200 px-1 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 text-sm cursor-pointer w-[200px] max-sm:w-[100px]">
                Delete Group
              </button>

              <form onSubmit={handleUpdateGroup} className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Change Group Name"
                  className="rounded-4xl max-sm:py-1 pl-1 py-2 border border-gray-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <label
                  htmlFor="image"
                  className="cursor-pointer rounded-lg flex flex-col items-center"
                >
                  <img
                    src={
                      cover_photo instanceof File
                        ? URL.createObjectURL(cover_photo)
                        : assets.cover_holder
                    }
                    className="w-[100px] h-[100px] max-sm:w-[50px] max-sm:h-[50px] rounded-full object-cover"
                  />
                  <p className="text-sm ">Change Group Photo</p>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    hidden
                    onChange={(e) => setCoverPhoto(e.target.files[0])}
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="border border-gray-200 px-2 py-3 max-sm:py-1 max-sm:text-sm rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-xl cursor-pointer max-w-[400px] mb-2 self-center"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {members &&
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
                <div className="rounded-4xl shadow w-3/5 max-w-[600px] bg-white flex flex-col gap-2 pt-5 px-5 relative">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl max-sm:text-sm font-bold py-2">Members</h2>
                    <button
                      onClick={() => setMembers(false)}
                      className="rounded-full px-2 py-1 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                    >
                      X
                    </button>
                  </div>
                  {currentGroup.members.map((m)=>(
<div className="flex items-center gap-2 mb-1">
                          <img
                            src={m.profile_photo}
                            className="h-10 max-md:h-6 w-10 max-md:w-6 border border-gray-500 rounded-full"
                          />
                          <p className="text-sm text-gray-500">{m.name}</p>
                          <button onClick={()=>removeMember(m._id)} className="px-2 py-1 max-sm:text-[10px] rounded-full border border-gray-100 text-sm hover:bg-red-500 hover:text-white cursor-pointer transition-all duration-200">
                            Remove X
                          </button>
                        </div>
                  ))}
                </div>
              </div>
            }

        {post && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
            <div className="rounded-4xl shadow w-3/5 max-w-[600px] bg-white flex flex-col gap-2 pt-5 px-5 relative">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold py-2 max-sm:text-sm">New Post</h2>
                <button
                  onClick={() => setPost(false)}
                  className="rounded-full px-2 py-1 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  X
                </button>
              </div>

              <form onSubmit={handleNewPost} className="flex flex-col gap-2">
                <textarea
                  className="rounded-4xl pl-2 py-2 border border-gray-200"
                  placeholder="What's Up?" value={content} onChange={(e)=>setContent(e.target.value)}
                ></textarea>

                {photos.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {photos.map((photo, i) => (
                      <div className="relative group" key={i}>
                        <img
                          src={URL.createObjectURL(photo)}
                          className="h-10 rounded-md ml-1"
                        />
                        <div
                          onClick={() =>
                            setPhotos(photos.filter((_, index) => index !== i))
                          }
                          className="absolute hidden group-hover:flex justify-center items-center top-0 bottom-0 left-0 right-0 bg-black/40 cursor-pointer rounded-md"
                        >
                          <span className="text-white h-6 w-6">X</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-1">
                  <label
                    htmlFor="images"
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <img src={assets.cover_holder} className="w-6 h-6 ml-1" />
                  </label>

                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    hidden
                    multiple
                    onChange={(e) => setPhotos([...photos, ...e.target.files])}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="border border-gray-200 px-5 py-3 max-sm:py-1 max-sm:text-sm rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-xl cursor-pointer max-w-[400px] mb-2 self-center"
                >
                  Post!
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>

      ) 

    }
    </>
   
  );
};

export default Grouppage;
