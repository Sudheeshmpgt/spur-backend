const route = require('express').Router();
const upload = require('../middleware/cloudinary'); 
const {createPost, getAllPosts, likePost, commentPost, personalPost} = require('../controller/postController');

route.post('/posts/create',upload.single("postImg"), createPost );
route.get('/posts/getAll', getAllPosts);
route.post('/posts/like', likePost)
route.post('/posts/comment', commentPost)
route.get('/posts/:id', personalPost)

module.exports = route;