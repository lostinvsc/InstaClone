import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
const CreatePost = () => {
    const [image, setImage] = useState(null);
    const [error, seterror] = useState('');
    const [img, setImg] = useState('');
    const [caption, setCaption] = useState('')
    const [url, setUrl] = useState('')

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm()

    const navigate = useNavigate();
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImg(file);
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImage(reader.result);


            };
            reader.readAsDataURL(file);
        } else {
            seterror('Please select a valid image file');
        }

    };
    const onSubmit = async () => {

        if (img) {

            const data = new FormData();
            data.append("file", img)
            data.append("upload_preset", "instagram")
            data.append("cloud_name", "tuntun")

            let request = await fetch(`https://api.cloudinary.com/v1_1/tuntun/image/upload/`, {
                method: 'POST',
                body: data
            })

            let res = await request.json();
            setUrl(res.url)

        } else {
            alert('No image selected')
        }

    }

    useEffect(() => {
     send_img_caption();
    }, [url])
    
    const send_img_caption = async () => {
        let data = { url: url, caption: caption }
        if (url) {
            let req = await axios.post("/createpost", data, {
                withCredentials: true
            });
            alert(req.data)
            navigate('/')
        }

    }
    return (
        <div className='flex justify-center mt-[20px]'>
            <div style={{ width: 'min(490px, 93vw)' }} className='border border-black '>
                <div className='flex w-[100%] items-center mt-[10px]'>
                    <p className='font-bold w-[90%]  text-center'>Create Post</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input disabled={isSubmitting} type="submit" value="Post"
                            className='text-blue-600 cursor-pointer' />
                    </form>

                </div>
                {isSubmitting && <div className='w-[90%] text-center'>Posting...</div> }
                <hr className='border-[0.5px] border-gray-600 w-[100%] my-[10px]' />
                <div>
                    {image && <img src={image} alt="Preview" className="max-w-full h-auto px-[10px]" />}

                    <input required
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className=" m-[10px]"
                    />
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                </div>
                <hr className='border-[0.5px] border-gray-600 w-[100%] mb-[10px]' />
                <div>
                    <div className='flex items-center ml-[10px] gap-[10px]'>
                        <img className='w-[40px] rounded-full border border-black' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOuxrvcNMfGLh73uKP1QqYpKoCB0JLXiBMvA&s" alt="" />
                        <p>Sachin</p>
                    </div>
                    <div className='flex w-[100%] justify-center mb-[10px]'>
                        <textarea required onChange={(e) => { setCaption(e.target.value) }} name="caption" id="caption" placeholder='Enter Caption' className='border border-black w-[50%]'></textarea>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost