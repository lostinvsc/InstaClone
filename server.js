const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const path =require("path")

const port =process.env.port || 3000;
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json())
app.use(cookieParser())

const Post = require('./Model/Post');
const User = require('./Model/User');

mongoose.connect('mongodb://localhost:27017/Instagram')

app.get('/logout', async (req, res) => {
    res.cookie("token", "");
    res.json("Sucessfully Signed Out")
})

app.post('/signup', async (req, res) => {
    try {

        let { email, name, username, password } = req.body;
        let findemail = await User.findOne({ email: email });
        let findusername = await User.findOne({ username: username });
        if (findemail) {
            res.json({ message: "Account with this email exists", count: 0 })
        }


        if (findusername) {
            res.json({ message: "Account with this username exists", count: 0 })
        }

        if (!findemail && !findusername) {

            const hashpassword = await bcrypt.hash(password, 10);
            let token = jwt.sign(email, "lllooo")
            res.cookie("token", token);
            let result = await User.create({ email: email, name: name, username: username, password: hashpassword })


            res.json({ message: "Signed Up sucessfully", count: 1 })

        }

    } catch (error) {
        res.json("Error in Sign Up")
    }
})

app.post('/signin', async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email: email });

        if (!user) {
            return res.json({ message: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            let token = jwt.sign(email, "lllooo")
            res.cookie("token", token);
            res.json({ message: 'Login successfully', count: 1 });

        } else {
            res.json({ message: 'Invalid credentials' });
        }

    } catch (error) {
        res.json("Error in Sign In");
    }
})

app.post('/createpost', async (req, res) => {
    try {
        let email = jwt.verify(req.cookies.token, 'lllooo')

        if (email) {
            let { url, caption } = req.body;
            let user = await User.findOne({ email: email });
            if (user) {

                await Post.create({ img_url: url, caption: caption, create_by: user.email, username: user.username });
                res.json("Done Create Post")
            } else {
                res.json("User not found")
            }
        } else {
            res.json("You are not signed in");
        }

    } catch (error) {
        res.json("may be you are not Signed In");
    }
})


app.get('/getposts/', async (req, res) => {
    try {
        let email = jwt.verify(req.cookies.token, 'lllooo')


        // console.log(email)
        if (email) {
            let file = await Post.find({}).exec();
            // console.log(file)
            if (file.length != 0) {
                res.json({ message: file, count: 1 })
            } else {
                res.json({ message: "No post", count: 0 })
            }
        } else {
            res.json("You are not signed in");
        }

    } catch (error) {
        res.json("may be you are not Signed In");
    }
})


app.get('/getfollowingposts', async (req, res) => {
    try {
        let email = jwt.verify(req.cookies.token, 'lllooo')
        if (email) {
            let user = await User.findOne({ email: email })
            let list = user.following
    
            let allfiles=[];
            for (let i = 0; i < list.length; i++) {
                
                allfiles[i] = await Post.findOne({username:list[i]})
                
            }

            if (allfiles.length != 0) {
                res.json({ message: allfiles, count: 1 })
            } else {
                res.json({ message: "No post", count: 0 })
            }
        } else {
            res.json("You are not signed in");
        }

    } catch (error) {
        res.json("may be you are not Signed In");
    }
})


app.get('/getpostsprofile', async (req, res) => {
    try {
        let email = jwt.verify(req.cookies.token, 'lllooo')

        // console.log(email)
        if (email) {
            let file = await Post.find({ create_by: email }).exec();
            let data = await User.findOne({ email: email })

            res.json({ message: file, username: data.username })

        } else {
            res.json("You are not signed in");
        }

    } catch (error) {
        res.json("may be you are not Signed In");
    }
})

app.get('/userprofile/:slug', async (req, res) => {
    try {
        let username = req.params.slug
        // console.log(email)
        if (username) {
            let file = await Post.find({ username: username }).exec();
            // console.log(file)
            if (file.length != 0) {
                res.json({ message: file, count: 1 })
            } else {
                res.json({ message: "No post", count: 0 })
            }
        } else {
            res.json("You are not signed in");
        }

    } catch (error) {
        res.json("may be you are not Signed In");
    }
})

app.put('/likes', async (req, res) => {
    try {
        let email = jwt.verify(req.cookies.token, 'lllooo');
        let liked_by = jwt.verify(req.body.like_by, 'lllooo')

        if (email) {
            const updatedPost = await Post.findByIdAndUpdate(
                req.body.post_id,
                { $push: { liked_by: liked_by } },
                { new: true }
            );
            if (updatedPost) {
                const post = await Post.findOne({ _id: req.body.post_id });

                res.json({ likeby: post.liked_by, email: email });

            } else {
                res.status(404).json("Post not found");
            }
        } else {
            res.status(401).json("You are not signed in");
        }
    } catch (error) {
        res.status(500).json("Error in updating likes");
    }
})
app.put('/unlike', async (req, res) => {
    try {
        let email = jwt.verify(req.cookies.token, 'lllooo');
        let liked_by = jwt.verify(req.body.like_by, 'lllooo')

        if (email) {
            const updatedPost = await Post.findByIdAndUpdate(
                req.body.post_id,
                { $pull: { liked_by: liked_by } },
                { new: true }
            );
            if (updatedPost) {
                const post = await Post.findOne({ _id: req.body.post_id });

                res.json({ likeby: post.liked_by, email: email });

            } else {
                res.status(404).json("Post not found");
            }
        } else {
            res.status(401).json("You are not signed in");
        }
    } catch (error) {
        res.status(500).json("Error in updating likes");
    }
})

app.get('/getlikes/:post_id', async (req, res) => {
    try {
        let email = jwt.verify(req.cookies.token, 'lllooo');
        if (email) {

            const post = await Post.findOne({ _id: req.params.post_id });

            res.json({ likeby: post.liked_by, email: email });


        } else {
            res.status(404).json("Post not found");
        }
    }
    catch (error) {
        res.status(500).json("Error in updating likes");
    }

});
app.get('/getcomment/:post_id', async (req, res) => {
    try {
        let email = jwt.verify(req.cookies.token, 'lllooo');
        if (email) {

            const post = await Post.findOne({ _id: req.params.post_id });

            res.json({ comment: post.comment, email: email });


        } else {
            res.status(404).json("Post not found");
        }
    }
    catch (error) {
        res.status(500).json("Error in updating likes");
    }

});

app.put('/sendcomment', async (req, res) => {
    try {
        let email = jwt.verify(req.cookies.token, 'lllooo');
        let by = jwt.verify(req.body.comment_by, 'lllooo')
        let { username } = await User.findOne({ email: by })

        if (email) {
            const updatedPost = await Post.findByIdAndUpdate(
                req.body.post_id,
                { $push: { comment: { comment: req.body.comment, comment_by: username } } },
                { new: true }
            );
            if (updatedPost) {
                const post = await Post.findOne({ _id: req.body.post_id });

                res.json({ comment: post.comment, email: email });

            } else {
                res.status(404).json("Post not found");
            }
        } else {
            res.status(401).json("You are not signed in");
        }
    } catch (error) {
        res.status(500).json("Error in updating likes");
    }
})


app.put('/uploadprofilepic', async (req, res) => {
    try {
        let email = jwt.verify(req.cookies.token, 'lllooo');
        let { url } = req.body;
        
        if (email) {
            await User.findOneAndUpdate(
                { email: email },
                {  photo: url }
            );
            if(url){
                
                res.status(200).json({message:"Profile picture updated successfully",count:1});
            }
            else{
                res.status(200).json({message:"Profile picture Removed successfully",count:0});
            }
        } else {
            res.status(401).json({message:"You are not signed in",count:0});
        }
    } catch (error) {
        res.status(500).json({message:"Error in updating profile picture",count:0});
    }
});


app.get('/getprofilepic', async (req, res) => {
    try {
        let email = jwt.verify(req.cookies.token, 'lllooo');

        if (email) {
           
            let user=await User.findOne({email:email})
            
            res.json({photo:user.photo});

        } else {
            res.status(401).json("You are not signed in");
        }
    } catch (error) {
        res.status(500).json("Error in updating profile picture");
    }
});



app.put('/following', async (req, res) => {
    try {
        let email = jwt.verify(req.cookies.token, 'lllooo');
        let { following } = req.body;

        if (email) {
            let user = await User.findOne({ email });
            if (user) {
                let isFollowing = await User.findOne({
                    username: user.username,
                    following: following
                });

                if (isFollowing) {
                    await User.findOneAndUpdate(
                        { username: user.username },
                        { $pull: { following: following } }
                    );

                    await User.findOneAndUpdate(
                        { username: following },
                        { $pull: { followers: user.username } }
                    );

                    res.status(200).json({ message: false });

                } else {

                    await User.findOneAndUpdate(
                        { username: user.username },
                        { $addToSet: { following: following } }
                    );

                    await User.findOneAndUpdate(
                        { username: following },
                        { $addToSet: { followers: user.username } }
                    );

                    res.status(200).json({ message: true });

                }
            } else {
                res.status(404).json("User not found");
            }
        } else {
            res.status(401).json("You are not signed in");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Error in toggling follow status");
    }
});


app.get('/following/:username', async (req, res) => {
    try {
        let email = jwt.verify(req.cookies.token, 'lllooo');
        let following = req.params.username;
        let isFollowing = {};
        if (email) {
            let user = await User.findOne({ email });
            if (user) {
                if (following != 0) {
                    isFollowing = await User.findOne({
                        username: user.username,
                        following: following
                    });



                    let ff = await User.findOne({
                        username: following
                    });

                    if (isFollowing) {
                        res.json({ message: true, following: ff.following, followers: ff.followers });

                    } else {


                        res.json({ message: false });

                    }
                } else {
                    res.json({ following: user.following, followers: user.followers })
                }
            }
        } else {
            res.status(401).json("You are not signed in");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Error in toggling follow status");
    }
});



app.get('/getfollow/:id', async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


app.delete('/deletepost/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Delete success" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.use(express.static(path.join(__dirname,'./InstagramFrontend/dist')))

app.get('*',(req,res)=>{
res.sendFile(
    path.join(__dirname,'./InstagramFrontend/dist/index.html'),
    function(err){
res.status(404).send(err)
    }
)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)

})
