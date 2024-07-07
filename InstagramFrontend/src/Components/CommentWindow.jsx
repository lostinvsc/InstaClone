import React from 'react'
import { FaTimes } from 'react-icons/fa';
const CommentWindow = ({post_id}) => {
    const [cookie, setCookie] = useState('')
    const [likes, setLikes] = useState([])
    const [likelist, setLikelist] = useState(0)
    let [togglelike, settoggLelike] = useState(false)
    const [email, setEmail] = useState('')
    const [comment, setComment] = useState('')
    const [postcomments, setPostcomments] = useState([])
    const [first, setFirst] = useState('')
    const [window, setWindow] = useState(false)
    const [scomment, setScomment] = useState([])
    const [deletewindow, setDeletewindow] = useState(false)
  return (
    
    <div className={`h-[80vh]  fixed border border-gray-600  rounded-lg shadow-md pl-[10px]  flex items-center bg-black bg-opacity-90 justify-between`}>

    <div className='w-[48%] '>
        <img className='w-[100%] object-fit rounded-lg]' src={url} alt="" />
    </div>
    <div className='text-white w-[50%] px-[2%] border border-white  h-[100%] flex flex-col justify-between'>
        <div className='w-[90%] mb-[20px]'> <span className='font-bold '>Comments</span> </div>
        <ul className='flex flex-col gap-y-7 h-[90%] overflow-scroll'>
            {postcomments.length != 0 &&
                postcomments.map((value, index) => {
                    return (
                        <li key={index} className=' leading-5'>

                            <h1 className='font-bold underline'>-&gt;{value.comment_by}</h1>
                            <p className='ml-[15px] font-thin'>
                                {value.comment}
                            </p>
                        </li>
                    )
                })
            }
        </ul>
        <form onSubmit={handleSubmit(sendcomment)} className='flex items-center gap-[5px] my-[10px] ml-[3px] w-[100%] sticky bottom-0'>

            <input {...register('comment')} type="text" name="comment" id="comment" placeholder='Add a comment' className='outline-none w-[90%] border text-white bg-black ' />
            <input disabled={isSubmitting} className={`text-blue-200 cursor-pointer ${isSubmitting && 'text-blue-400'}`} type="submit" value="Post" />
        </form>
    </div>
    <FaTimes onClick={() => { setWindow(false) }} className='absolute right-0 text-[2rem] bg-blue-600 rounded-full top-0 cursor-pointer text-white p-[3px]' />

</div>
  )
}

export default CommentWindow