import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
const Profile = () => {
  let [post, setPost] = useState([])
  const [length, setLength] = useState(0)
  const [deletewindow, setDeletewindow] = useState(false)
  const [followin, setFollowin] = useState(0)
  const [followers, setFollowers] = useState(0)
  const [profilepic, setProfilepic] = useState(false)
  const [fileName, setFileName] = useState('Upload pic');
  const [confirm, setConfirm] = useState(0)
  const [url, setUrl] = useState('')
  const [profileimage, setProfileimage] = useState('')
  const getposts = async () => {
    const res = await axios.get('/getpostsprofile', {
      withCredentials: true
    });
    setPost(res.data)

    setLength(res.data.message.length)

  }
  useEffect(() => {
    getposts();
  }, [deletewindow])

  async function deletepost(post_id) {
    let res = await axios.delete(`/deletepost/${post_id}`, {
      withCredentials: true
    })
    setDeletewindow(false)
    alert(res.data.message)

  }

  const getfollow = async () => {


    const res = await axios.get(`/following/0`, {
      withCredentials: true
    });


    if (res.data) {

      setFollowin(res.data.following.length)
      setFollowers(res.data.followers.length)
    } else {
      setFollowin(0)
      setFollowers(0)
    }


  }

  useEffect(() => {
    getfollow()
  }, [post])

  const uploadprofilepic = async (image) => {
    if (image) {
      const data = new FormData();
      data.append("file", image)
      data.append("upload_preset", "instagram")
      data.append("cloud_name", "tuntun")

      setProfilepic(false)
      let request = await fetch(`https://api.cloudinary.com/v1_1/tuntun/image/upload/`, {
        method: 'POST',
        body: data
      })

      let res = await request.json();
      setUrl(res.url)
      alert("Pic Set")
    } else {
      alert('No image selected')
    }


  }
  const removeprofilepic = async () => {
    if(profileimage){

      let data={url:''};
      setProfilepic(false)
      let response=await axios.put("/uploadprofilepic",data,{
        withCredentials:true
      })
      setConfirm(response.data.count)
      alert("Pic Removed")
    }else{
      alert("No profile image")
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadprofilepic(file);
    } else {
      setFileName('Upload pic');
    }
  };

  async function sendpic(){

    if(url){
   let data={url:url}
      let response=await axios.put("/uploadprofilepic",data,{
        withCredentials:true
      })
      setConfirm(response.data.count)
     
    }
  }
  
  useEffect(() => {
    sendpic()
  }, [url])

  useEffect(() => {

  getprofilepic();

  }, [confirm])

  async function getprofilepic(){
    let response=await axios.get("/getprofilepic",{
      withCredentials:true
    })
    setProfileimage(response.data.photo)
  }
  



  return (
    <>
      <div className='flex  justify-center mt-[20px]'>
        <div style={{ width: 'min(550px, 95vw)' }} className=''>
          <div className='flex  justify-between'>
            <div>
              {
                 profileimage? 
                <img onClick={() => { setProfilepic(!profilepic) }} className='cursor-pointer rounded-full border w-[10vw] h-[10vw] min-w-[70px] border-black' src={profileimage} alt="" />
                : <img onClick={() => { setProfilepic(!profilepic) }} className='cursor-pointer rounded-full border w-[60%] min-w-[70px] border-black' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOuxrvcNMfGLh73uKP1QqYpKoCB0JLXiBMvA&s" alt="" />
              }
            </div>
            <div className='flex flex-col gap-[30px]'>
              <h1 className='text-[3rem] font-bold leading-10'>{post.username}</h1>
              <p className='aboutfollow'>
                <span>{length} Post{length > 1 && <span>s</span>}</span>
                <span>{followers} Follower{followers > 1 && <span>s</span>}</span>
                <span>{followin} Following</span>
              </p>
            </div>
          </div>
          {
            profilepic &&
            <div className='fixed z-20 right-[39vw] bg-white '>
              <ul className='flex flex-col items-center gap-[5px] border bg-slate-500 border-black rounded-lg py-[14px] px-[10px]'>

                <input
                  style={{ display: 'none' }}
                  type="file"
                  name="profilepic"
                  id="profilepic"
                  onChange={handleFileChange}
                />

                <label
                  htmlFor="profilepic"
                  style={{ width: 'min(300px, 47vw)' }}
                  className="cursor-pointer text-center rounded-lg py-[5px] bg-yellow-100"
                >
                  {fileName}
                </label>


                <li onClick={removeprofilepic} style={{ width: 'min(300px, 47vw)' }} className='cursor-pointer text-center rounded-lg py-[5px] bg-yellow-100'>
                  Remove Pic
                </li>
                <li onClick={() => { setProfilepic(false) }} style={{ width: 'min(300px, 47vw)' }} className='cursor-pointer text-center rounded-lg py-[5px] bg-yellow-100'>
                  Cancel
                </li>

              </ul>
            </div>
          }
          <hr className='border-[0.5px] border-gray-600 w-[100%] my-[50px]' />

          <div className='flex flex-wrap gap-[15px] justify-center '>

            {length > 0 &&
              post.message.map((value, index) => {
                return (

                  <div key={index} className='postimage relative flex items-center border rounded-lg h-[200px]'>
                    <img className='w-[100%] h-[100%] rounded-lg object-contain' src={value.img_url} alt="" />
                    <span onClick={() => { setDeletewindow(!deletewindow) }} className='cursor-pointer absolute top-2 right-2 text-blue-400'> &bull;&bull;&bull;</span>
                    {
                      deletewindow &&
                      <div onBlur={() => setDeletewindow(false)} className=' self-center bg-white w-[50%] top-[50px] h-[50%]  rounded-lg text-center py-[10px] absolute border border-black'>
                        <button onClick={() => deletepost(value._id)} className='underline'>Delete</button>
                      </div>
                    }
                  </div>
                )
              })
            }


          </div>
        </div>
      </div>

    </>
  )
}

export default Profile