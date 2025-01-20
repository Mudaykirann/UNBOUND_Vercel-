const Post = require('../models/PostModel')
const User = require('../models/UserModel')
const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')
const HttpError = require('../models/errorModel')



//========================CREATE A POST
//POST:api/posts
//PROTECTED
const createPost = async (req, res, next) => {
    try {
        let { title, category, description } = req.body;
        if (!title || !category || !description || !req.files) {
            return next(new HttpError("Fill in all fields and choose thumbnails", 422));
        }

        const { thumbnail } = req.files;
        if (thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail too big. File should be less than 2MB", 422));
        }

        let filename = thumbnail.name;
        let splittedFilename = filename.split(".");
        let newFilename = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length - 1];
        thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if (err) {
                return next(new HttpError("Failed to upload thumbnail", 500));
            } else {
                const newPost = await Post.create({
                    title,
                    category,
                    description,
                    thumbnail: newFilename,
                    creator: req.user.id
                });

                if (!newPost) {
                    return next(new HttpError("Post couldn't be created", 422));
                }

                // Find user and increase the post count
                const currentUser = await User.findById(req.user.id);
                if (!currentUser) {
                    return next(new HttpError("User not found", 404));
                }
                const UserPostCount = currentUser.post = currentUser.post + 1;
                await User.findByIdAndUpdate(req.user.id, { post: UserPostCount })

                res.status(201).json({ message: "Post successfully created", newPost });
            }
        });
    } catch (err) {
        return next(new HttpError("Something went wrong, please try again", 500));
    }
}




//========================GET ALLL POST
//GET:api/posts
//PROTECTED
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 }) //to show recent post
        res.status(200).json({ posts })
    }
    catch (err) {
        return next(new HttpError("Something went wrong, please try again", 500));
    }
}



//========================GET SINGLE  POST
//GET:api/posts/:id
//PROTECTED
const getSinglePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id);
        if (!post) {
            return next(new HttpError("Post not found", 404))
        }
        res.status(200).json({ message: "Sucessfully fetched a post", post })
    } catch (error) {
        return next(new HttpError("Something went wrong, please try again", 500));
    }
}










//========================GET  POSTS BY CATEGORY
//GET:api/posts/catgories/:category
//UNPROTECTED
const getCatPosts = async (req, res, next) => {
    try {
        const category = req.params.category;
        const posts = await Post.find({ category: category }).sort({ updatedAt: -1 })
        if (!posts) {
            return next(new HttpError("Post not Found", 404))
        }
        res.status(200).json({ message: "Succesfully fetched the category postss", posts })
    } catch (error) {
        return next(new HttpError("Something went wrong, please try again", 500));
    }
}








//========================GET AUTHOR POST
//GET:api/posts/users/:id
//UNPROTECTED
const getUserPosts = async (req, res, next) => {
    try {
        const id = req.params.id;
        const posts = await Post.find({ creator: id }).sort({ updatedAt: -1 })
        if (!posts) {
            return next(new HttpError("Post not Found", 404))
        }
        res.status(200).json({ message: "Succesfully fetched the User postss", posts })
    } catch (error) {
        return next(new HttpError("Something went wrong, please try again", 500));
    }
}



//========================EDIT  POST
//PATCH:api/posts/:id
//PROTECTED
const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFilename;
        let updatedPost;
        const postId = req.params.id;
        let { title, category, description } = req.body;

        if (!title || !category || description.length < 12) {
            return next(new HttpError("Fill in all fields."))
        }
        const OldPost = await Post.findById(postId);
        if (req.user.id = OldPost.creator) {
            if (!req.files) {
                updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true })
            }
            else {
                //get the old post from db
                //delte old thumbnail
                fs.unlink(path.join(__dirname, '..', 'uploads', OldPost.thumbnail), async (err) => {
                    if (err) {
                        return next(new HttpError(err))
                    }
                })

                //upload a new THumbnail
                const { thumbnail } = req.files
                if (thumbnail.size > 2000000) {
                    return next(new HttpError("thumbnail too big.Should be less than 2mb", 422))
                }
                fileName = thumbnail.name;
                let splittedFilename = fileName.split('.')
                newFilename = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length - 1];
                thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
                    if (err) {
                        return next(new HttpError(err))
                    }
                })

                updatedPost = await Post.findById(postId, { title, category, description, thumbnail: newFilename }, { new: true })
            }

        }

        if (!updatedPost) {
            return next(new HttpError(err))
        }

        res.status(200).json({ message: "Post Edited and Upadted Successfully", updatedPost })
    } catch (error) {
        return next(new HttpError("Something went wrong, please try again", 500));
    }
}



//========================DELETE  POST
//DELETE:api/posts/:id
//PROTECTED
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        if (!postId) {
            return next(new HttpError("Post Unavailable", 400))
        }
        const fileName = post?.thumbnail;
        if (req.user.id == post.creator) {
            //delete thumbnail from uploads folder
            fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
                if (err) {
                    return next(new HttpError(err))
                }
                else {
                    await Post.findByIdAndDelete(postId)
                    //find user and reduce post count
                    const currentUser = await User.findById(req.user.id)
                    const updatedUser = currentUser?.post - 1;
                    await User.findByIdAndUpdate(req.user.id, { post: updatedUser })
                    res.status(200).json({ message: "Post Deleted Successfully" })
                }
            })
        }
        else {

            return next(new HttpError("Post Couldn't be delted", 500));
        }

    } catch (error) {
        return next(new HttpError("Something went wrong, please try again", 500));
    }
}


module.exports = { createPost, getPosts, getSinglePost, getCatPosts, getUserPosts, editPost, deletePost }
