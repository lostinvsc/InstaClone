import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaHeart } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const Post = (props) => {
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
    const [profileimage, setProfileimage] = useState('')
    let ref = useRef()
    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm()

    const sendlikes = async () => {

        if (cookie) {

            let data = { like_by: cookie, post_id: props.post_id }
            let res = await axios.put(`/${first}`, data, {
                withCredentials: true
            })
            setLikelist(res.data.likeby);

            settoggLelike(!togglelike)
        }
    }

    const sendcomment = async (data) => {
        const comm = data.comment
        if (cookie) {

            let data = { comment: comm, comment_by: cookie, post_id: props.post_id }
            let res = await axios.put(`/sendcomment`, data, {
                withCredentials: true
            })

            setScomment(res.data);

        }
    }



    useEffect(() => {
        const value = Cookies.get("token")
        setCookie(value);
        let data = { like_by: cookie, post_id: props.post_id }

        getlikes();

    }, [likelist])

    useEffect(() => {
        // console.log(likes)
        // console.log(email)
        for (let i = 0; i < likes.length; i++) {

            if (likes[i] == email) {

                settoggLelike(togglelike = true)

            }
        }

    }, [likes, email])

    const getlikes = async () => {
        let res = await axios.get(`/getlikes/${props.post_id}`, {
            withCredentials: true
        })
        setLikes(res.data.likeby);
        setEmail(res.data.email)
    }

    useEffect(() => {
        if (!togglelike) {
            setFirst('likes')
        } else {
            setFirst('unlike')
        }
    }, [togglelike])


    useEffect(() => {

        getcomment();

    }, [scomment])

    async function getcomment() {


        let res = await axios.get(`/getcomment/${props.post_id}`, {
            withCredentials: true
        })
        setPostcomments(res.data.comment.reverse());



    }


    useEffect(() => {

        getprofilepic();

    }, [])

    async function getprofilepic() {
        let response = await axios.get("/getprofilepic", {
            withCredentials: true
        })
        setProfileimage(response.data.photo)
    }




    return (
        <>
            <div style={{ width: 'min(490px, 93vw)' }} className='relative border border-gray-600  rounded-lg shadow-md px-[10px] flex flex-col'>
                <div className='flex w-[100%] justify-between items-center'>

                    <div className='flex items-center '>

{
    profileimage ?
    <img style={{ height: 'min(49px, 9vw)',width:'min(49px, 9vw)'}} className=' object-contain  m-[8px] border border-black rounded-full' src={profileimage} alt="" />
    :<img style={{ height: 'min(49px, 9vw)' }} className=' object-contain p-[3px] m-[8px] border border-black rounded-full' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOuxrvcNMfGLh73uKP1QqYpKoCB0JLXiBMvA&s" alt="" />

}
                        <Link to={`/userprofile/${props.username}`} className='text-[1.2rem]'>{props.username}</Link>

                    </div>


                </div>
                <div>
                    <img onDoubleClick={sendlikes} className='w-[100%] object-fit rounded-lg' src={props.url} alt="" />
                </div>
                <div className='m-[10px] text-[1rem]'>
                    <span >
                        <FaHeart onClick={sendlikes} className={`cursor-pointer ${togglelike && 'text-red-600'}`} />
                    </span>
                    <div className='text-[1rem]'>{likes.length}</div>
                    <div className='text-md text-gray-600'>{props.caption}</div>
                    {postcomments &&
                        <span onClick={() => { setWindow(true) }} className='cursor-pointer text-[1rem] underline font-semibold'>See all comments</span>
                    }
                </div>
                <hr className='border-[0.5px] border-gray-600 w-[100%]' />
                <div className='flex justify-between pr-[5px] w-[100%]'>
                    <form onSubmit={handleSubmit(sendcomment)} className='flex items-center gap-[5px] my-[10px] ml-[3px] w-[100%]'>
                        <span className="material-symbols-outlined">
                            mood
                        </span>
                        <input {...register('comment')} type="text" name="comment" id="comment" placeholder='Add a comment' className='outline-none w-[80%] border' />
                        <input disabled={isSubmitting} className={`text-blue-800 cursor-pointer ${isSubmitting && 'text-blue-400'}`} type="submit" value="Post" />
                    </form>
                </div>

            </div>

            {
                window &&

                <div className={`h-[85vh] z-10 fixed border border-gray-600  rounded-lg shadow-md pl-[10px]  flex items-center bg-black bg-opacity-90 justify-between`}>

                    <div className='w-[48%] '>
                        <img className='w-[100%] object-fit rounded-lg]' src={props.url} alt="" />
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
            }
        </>
    );
}

export default Post;
