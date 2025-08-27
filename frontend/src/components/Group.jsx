import React from 'react'
import { useNavigate } from 'react-router-dom'

const Group = ({group}) => {
  const navigate = useNavigate()
  return (
    <>
    
        <div onClick={()=>navigate(`/${group._id}`)} className='rounded-lg w-[100px] md:w-[150px] border border-gray-200 flex flex-col cursor-pointer group'>
        <img src={group.cover_photo} className='object-cover h-[150px] max-lg:h-[120px] max-md:h-[90px] w-full rounded-t-lg border-b border-b-gray-200' />
        <div className='flex flex-wrap py-2 border-b border-b-gray-200 group-hover:bg-gray-100'>
        {group.members.map((user)=>{
            return (
                user && (
                    <img src={user.profile_photo}className='h-6 w-6 max-md:h-4 max-md:w-4 border border-gray-500 rounded-full'/>
                )
            )
        })}
        </div>
        <div className='group-hover:bg-gray-100'>
        <h3 className='py-1 text-xl max-sm:text-sm text-center'>{group.name}</h3>
        </div>
    </div>
   
    </>
  )
}


export default Group
