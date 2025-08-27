import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/Appcontext';
import toast from 'react-hot-toast';

const Post = ({posts}) => {

  const {axios} = useAppContext()
    
  const [currentIndex, setCurrentIndex] = useState(0);
  const [user, setUser] = useState([])
  const [status, setStatus] = useState("")
  const [comment, setComment] = useState(false)
  const [toggleLike, setToggleLike] = useState(false)
  const [text, setText] = useState('')
  const [comments, setComments] = useState([])
  
    const handleLike = async (postid) => {
  try {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const { data } = await axios.post("/api/post/like", { postid });
    if (data.success) {
      setUser(data.likes);
      const tokenPayload = JSON.parse(atob(token.split('.')[1])); 
      const currentUserId = tokenPayload.userid;
      const liked = data.likes.some(u => u._id === currentUserId);
      setStatus(liked ? "Liked" : "Not Liked");
      setToggleLike(true); 
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

    const handleComment = () => {
      setComment(!comment)
    }

    const handleNewComment = async(e,postid) => {
      e.preventDefault()
      try {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const {data} = await axios.post('/api/post/createcomment', {text, postid})
    if(data.success) {
      setText('')
    }
    fetchComments()
      } catch (error) {
        toast.error(error.message)
      }
    }
  
    const prevImage = () => {
      setCurrentIndex((prev) =>
        prev === 0 ? posts.photos.length - 1 : prev - 1
      );
    };
    const nextImage = () => {
      setCurrentIndex((prev) =>
        prev === posts.photos.length - 1 ? 0 : prev + 1
      );
    };

    const fetchComments = async() => {
      try {
        const {data} = await axios.get(`/api/post/getcomments/${posts._id}`)
        if(data.success) {
          setComments(data.comments)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }


useEffect(() => {
  if (!posts || !posts.likes) return;
  const token = localStorage.getItem("token");
  const tokenPayload = JSON.parse(atob(token.split('.')[1]));
  const currentUserId = tokenPayload.userid;
  const liked = posts.likes.includes(currentUserId);
  setStatus(liked ? "Liked" : "Not Liked");
  fetchComments()
}, [posts]);

  return (
   <div className="flex flex-col gap-2 pb-2">
     <div className="flex items-center gap-2">
        <img
          src={posts.createdBy.profile_photo}
          className="w-10 h-10 rounded-full m-2"
        />
        <div className='flex flex-col mt-2'>
        <p className="font-bold">{posts.createdBy.name}</p>
        <p className="text-gray-500 text-sm">@{posts.createdBy.username}</p>
        </div>
      </div>
       <p className="mb-2">{posts.content}</p>
       {posts.photos.length > 0 && (
        <div className="relative w-full flex justify-center items-center border-b border-b-gray-200">

          <img
            src={posts.photos[currentIndex]}
            className="w-1/2 max-sm:w-2/3 h-[400px] object-fill rounded-sm mx-auto"
          />

        
          {posts.photos.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-5 rounded-full cursor-pointer px-2 py-1 hover:bg-blue-500 hover:text-white transition-all duration-200"
            >
             <ArrowLeft size={20} />
            </button>
          )}

         
          {posts.photos.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-5 rounded-full cursor-pointer px-2 py-1 hover:bg-blue-500 hover:text-white transition-all duration-200"
            >
               <ArrowRight size={20} />
            </button>
          )}
        </div>
      )}
      <div className='flex justify-center gap-5'>
        <button
  onClick={() => handleLike(posts._id)}
  className="w-[160px] max-sm:w-[100px] border border-gray-200 px-3 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-sm cursor-pointer flex items-center justify-center gap-2"
>
  <span>{status}</span>
  
</button>
          <button onClick={handleComment}
            className="border border-gray-200 px-2 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-sm cursor-pointer"
          >
            Comments
          </button>
      </div>

      {toggleLike && user.length > 0 && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
    <div className="rounded-4xl shadow w-3/5 max-w-[600px] bg-white flex flex-col gap-1 pt-3 px-5 relative">
      <div className='border-b border-b-gray-200 pb-1'>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl max-sm:text-sm font-bold py-2">Likes</h2>
          <button
            onClick={() => setToggleLike(false)}
            className="rounded-full px-2 py-1 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
          >
            X
          </button>
        </div>

        <div className='flex flex-col gap-2'>
          {user.map((u, index) => (
            <div key={index} className='flex items-center gap-2'>
              <img src={u.profile_photo} className='w-6 h-6 rounded-full' />
              <div className='flex flex-col'>
                <p>{u.name}</p>
                <p className="text-gray-500 text-sm">@{u.username}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  </div>
)}


      {comment && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
                  <div className="rounded-4xl shadow w-3/5 max-w-[600px] bg-white flex flex-col gap-1 pt-3 px-5 relative">
                  <div className='border-b border-b-gray-200 pb-1'>
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl max-sm:text-sm font-bold py-2">New Comment</h2>
                      <button
                        onClick={() => setComment(false)}
                        className="rounded-full px-2 py-1 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                      >
                        X
                      </button>
                    </div>
                   
                    <form onSubmit={(e)=>handleNewComment(e,posts._id)} className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="Comment"
                        className="rounded-4xl max-sm:py-1 pl-1 py-2 border border-gray-200"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="border max-sm:py-1 max-sm:text-sm border-gray-200 px-2 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-xl cursor-pointer max-w-[400px] mb-2 self-center"
                      >
                        Post Comment
                      </button>
                    </form>
                    </div>

                    <div className='flex flex-col gap-1 pt-2'>
                      <h2 className="text-2xl font-bold py-2 max-sm:text-sm">Comments</h2>
                      {comments.map((c)=>{
                       
                        return (
                          <div className="flex gap-2 items-start border-b border-gray-200 py-2">
        <img
          src={c.user.profile_photo}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex flex-col">
          <div className='flex gap-2'>
          <p className="font-bold text-sm">{c.user.name}</p>
          <p className="text-sm">@{c.user.username || "unknown"}</p>
          </div>
          <p className="text-gray-600">{c.text}</p>
        </div>
      </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
   </div>
  )
}

export default Post;
