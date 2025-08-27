import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import Group from "../components/Group";
import { useAppContext } from "../context/Appcontext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

const Home = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [joingroup, setJoinGroup] = useState(null)
  const [name, setName] = useState("");
  const [cover_photo, setCoverPhoto] = useState(null);
  const [group, setGroup] = useState(false);
  const [join, setJoin] = useState(false);
  const [code, setCode] = useState("");
  const [join2, setJoin2] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleJoin = () => {
    setJoin(!join);
    setJoin2(false);
    setCode("");
  };

  const handleCode = async(code) => {
   try {
    const {data} = await axios.post('/api/group/checkcode', {code})
    if(data.success) {
      setJoinGroup(data.group)
    } else {
      toast.error(data.message)
    }
    setJoin2(true);
   } catch (error) {
    toast.error(error.message)
   } 
  };

  const handleJoinGroup = async(e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const {data} = await axios.post('/api/group/joingroup', {code})
      if(data.success) {
        fetchGroup()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setJoin(false);
  };

  const handleGroup = () => {
    setGroup(!group);
  };

  const handleNewGroup = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const formData = new FormData();
      formData.append("name", name);
      if (cover_photo) {
        formData.append("cover_photo", cover_photo); // multer handles this
      }
      const { data } = await axios.post("/api/group/creategroup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.success) {
        setName(data.name);
        setCoverPhoto(data.cover_photo);
      }
      setGroup(false);
      fetchGroup();
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const fetchGroup = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return navigate("/");
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const { data } = await axios.get("/api/group/getgroups");
      if (data.success) {
        setGroups(data.groups);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <div className="bg-gray-100 min-h-screen w-screen py-10 max-md:pt-5">
            <div className="bg-white rounded-4xl min-h-[5vh] max-md:min-h-[3vh] shadow mx-auto w-4/5 flex justify-center gap-2 py-2 px-2">
              <button
                onClick={handleGroup}
                className="border border-gray-200 px-2 py-3 max-md:py-1 max-lg:text-sm rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-sm cursor-pointer"
              >
                Create Group
              </button>
              <button
                onClick={handleJoin}
                className="border border-gray-200 px-2 py-3  max-md:py-1 max-lg:text-sm rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-sm cursor-pointer"
              >
                Join Group
              </button>
            </div>

            <div className="bg-white rounded-4xl shadow mx-auto w-4/5 max-md:w-[95%] px-5 my-5">
              <h2 className="text-2xl max-md:text-xl font-bold py-2">Groups</h2>
              <div className="flex gap-3 py-5">
                {groups.length > 0 ? (
                  groups.map((g) => <Group group={g} />)
                ) : (
                  <div className="h-[100vh] w-full flex justify-center items-center text-2xl">
                    Join or Create a Group with Friends!
                  </div>
                )}
              </div>
            </div>

            {join && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
                <div className="rounded-4xl shadow w-3/5 max-w-[600px] bg-white flex flex-col gap-2 pt-5 px-5 relative">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl max-sm:text-xl  font-bold py-2">Join a Group</h2>
                    <button
                      onClick={() => setJoin(false)}
                      className="rounded-full px-2 py-1 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                    >
                      X
                    </button>
                  </div>

                  <form
                    onSubmit={handleJoinGroup}
                    className="flex flex-col gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Group Code"
                      className="rounded-4xl max-sm:py-1 max-sm:text-sm pl-1 py-2 border border-gray-200"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    {join2 && joingroup && (
                      <>
                              <h3 className="text-xl font-bold py-2">
                                {joingroup.name}
                              </h3>
                              <div className="flex gap-1 flex-wrap">
                                {joingroup.members.map((m) => {
                                  return (
                                    <img
                                      src={m.profile_photo}
                                      className="w-8 h-8 max-sm:w-6 max-sm:h-6 rounded-full border-gray-200"
                                    />
                                  );
                                })}
                              </div>
                            
                          
                        <button
                          type="submit"
                          className="border border-gray-200 px-2 py-3 max-sm:py-1 max-sm:text-sm rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-xl cursor-pointer max-w-[400px] mb-2 self-center"
                        >
                          Join this Group
                        </button>
                      </>
                    )}
                  </form>
                  <button
                    onClick={()=>handleCode(code)}
                    className={` border border-gray-200 px-2 py-3 max-sm:py-1 max-sm:text-sm rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-xl cursor-pointer max-w-[400px] mb-2 self-center ${
                      join2 ? "hidden" : "flex"
                    }`}
                  >
                    Submit Code
                  </button>
                </div>
              </div>
            )}

            {group && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
                <div className="rounded-4xl shadow w-3/5 max-w-[600px] bg-white flex flex-col gap-2 pt-5 px-5 relative">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl max-sm:text-xl font-bold py-2">New Group</h2>
                    <button
                      onClick={() => setGroup(false)}
                      className="rounded-full px-2 py-1 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                    >
                      X
                    </button>
                  </div>

                  <form
                    onSubmit={handleNewGroup}
                    className="flex flex-col gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Group Name"
                      className="rounded-4xl max-sm:py-1 max-sm:text-sm pl-1 py-2 border border-gray-200"
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
                      <p className="text-sm">Add Group Photo</p>
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
          
        </>
      )}
    </>
  );
};

export default Home;
