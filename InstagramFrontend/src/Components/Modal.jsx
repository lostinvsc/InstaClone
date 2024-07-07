import React from 'react'
import { FaTimes } from 'react-icons/fa';

const Modal = ({ logoutbtn, setLogout }) => {
  return (
    <div className='flex flex-col fixed top-[10vh] z-20 bg-zinc-600 rounded-lg px-[20px] py-[10px] items-center gap-[20px]'>
      <div className='text-red-300 font-extrabold text-[1.5rem]'>
        Confirm!
      </div>

      <div className='flex flex-col items-center w-[100%] gap-[20px]'>
        <p className='text-green-500'>
          Are you sure, you want to logout
        </p>
        <div className='flex w-[70%] justify-between'>
          <button onClick={() => { setLogout(0) }} className='bg-gray-700 px-[20px] py-[2px] rounded-lg text-white cursor-pointer'>No</button>
          <button onClick={() => { setLogout(2) }} className='bg-pink-700 px-[20px] py-[2px] rounded-lg text-white cursor-pointer'>Yes</button>
        </div>
      </div>
      <FaTimes onClick={() => { setLogout(0) }} className='absolute right-0 top-0 cursor-pointer' />
    </div>
  )
}

export default Modal