const PostModel = require("../model/postSchema");
const ObjectId = require("mongoose").Types.ObjectId;

const createPost = async (req, res) => {
  try {
    const { description, createdBy } = req.body;
    const post = new PostModel({
      description: description,
      createdBy: createdBy,
      createdAt: new Date(),
      postImg: req.file ? req.file.path : null,
    });
    const postData = await post.save();
    const posts = await PostModel.find({});
    const postsData = await PostModel.populate(posts, {
      path: "createdBy comments.commentedBy",
      select: ["name", "about", "profileImg", "_id", "interviewer"],
    });
    if (posts.length === 0) {
      res.send({ message: "No posts found" }); 
    } else {
      postsData.sort((dateA, dateB) => {
        return dateB.createdAt - dateA.createdAt;
      });
      res
        .status(200)
        .send({ message: "Post created successfully", posts: postsData });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({});
    const postData = await PostModel.populate(posts, {
      path: "createdBy comments.commentedBy",
      select: ["name", "about", "profileImg", "_id", "interviewer"],
    });
    if (posts.length === 0) {
      res.send({ message: "No posts found" });
    } else {
      postData.sort((dateA, dateB) => {
        return dateB.createdAt - dateA.createdAt;
      });
      res.status(200).send({ message: "success", posts: postData });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const likePost = async (req, res) => {
  try {
    const { postId, userId, likes } = req.body;
    if (likes) {
      const post = await PostModel.findById(postId);
      if (post) {
        const liked = await PostModel.updateOne(
          { _id: postId },
          { $push: { likes: userId } }
        );
      } else {
        res.status(500).send({ message: "Post not found" });
      }
    } else {
      const likeData = await PostModel.updateOne(
        { _id: postId },
        { $pull: { likes: ObjectId(userId) } }
      );
    }
    const posts = await PostModel.find({});
    const postData = await PostModel.populate(posts, {
      path: "createdBy comments.commentedBy",
      select: ["name", "about", "profileImg", "_id", "interviewer"],
    });
    postData.sort((dateA, dateB) => {
      return dateB.createdAt - dateA.createdAt;
    });
    res.status(200).send({ message: "success", posts: postData });
  } catch (error) {
    res.status(500).send(error);
  }
};

const commentPost = async (req, res) => {
  try {
    const { comment, postId, userId } = req.body;
    const post = await PostModel.findById(postId);
    if (post) {
      const commentData = await PostModel.updateOne(
        { _id: postId },
        { $push: { comments: { commentedBy: userId, comment: comment } } }
      );
    } else {
      res.status(500).send({ message: "Post not found" });
    }
    const posts = await PostModel.find({});
    const postData = await PostModel.populate(posts, {
      path: "createdBy comments.commentedBy",
      select: ["name", "about", "profileImg", "_id", "interviewer"],
    });
    postData.sort((dateA, dateB) => {
      return dateB.createdAt - dateA.createdAt;
    });
    res.status(200).send({ message: "success", posts: postData });
  } catch (error) {
    res.status(500).send(error);
  }
};

const personalPost = async (req, res) => {
  try {
    const posts = await PostModel.find({createdBy:req.params.id});
    if (posts?.length !== 0) {
        const postCount = posts?.length
        const postData = await PostModel.populate(posts, {
          path: "createdBy comments.commentedBy",
          select: ["name", "about", "profileImg", "_id", "interviewer"],
        });
        postData.sort((dateA, dateB) => {
          return dateB.createdAt - dateA.createdAt;
        });
      res.send({ message: "OK", postsCount: postCount, posts:postData }); 
    } else {
      res.status(404).send({ message: "No posts found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createPost, getAllPosts, likePost, commentPost, personalPost };
