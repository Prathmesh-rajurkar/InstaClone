import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comments.model.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    const user = await User.findById(authorId);

    if (!image) return res.status(400).json({ message: "Image required" });

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg:base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    if (!user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New Post Created",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username,profilePicture" })
      .populate({
        path: "comments",
        populate: { path: "author", select: "username,profilePicture" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPostById = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username,profilePicture" })
      .populate({
        path: "comments",
        populate: { path: "author", select: "username,profilePicture" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // Like logic
    await post.updateOne({ $addToSet: { likes: loggedInUserId } });
    await post.save();

    // implementing socket.io for real time notification

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // Like logic
    await post.updateOne({ $pull: { likes: loggedInUserId } });
    await post.save();

    // implementing socket.io for real time notification

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const { text } = req.body;
    const post = await Post.findById(posts);
    if (!text)
      return res
        .status(400)
        .json({ message: "text is required", success: false });
    if (!post)
      return res
        .status(400)
        .json({ message: "post not found", success: false });

    const comment = await Comment.create({
      text,
      author: authorId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username,profilePicture",
    });
    post.comments.push(comment._id);
    await comment.save();

    return res
      .status(200)
      .json({ message: "comment added", success: true, comment });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    // const post = await Post.findById(postId)
    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username,profilePicture",
    });
    if (!comments)
      return res
        .status(400)
        .json({ message: "no comments found", success: false });

    return res.status(200).json({ comments, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(400)
        .json({ message: "post not found", success: false });
    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "You are not authorized to delete this post",
        success: false,
      });
    }
    await Post.findByIdAndDelete(postId);

    const user = await User.findById(authorId);
    user.posts.pull(postId);
    await user.save()

    await Comment.deleteMany({post:postId});

    return res.status(200).json({ message: "post deleted", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req,res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId)
    if (!post) return res.status(400).json({message:"post not found",success:false});

    const user = User.findById(authorId)
    if (user.bookmarks.include(post._id)) {
      // already bookmarked remove it
      await user.updateOne({$pull:{bookmarks:post._id}});
      await user.save()

      return res.status(200).json({message:"post removed from bookmark",success:true});
    }else {
      // bookmark
      await user.updateOne({$addToSet:{bookmarks:post._id}});
      return res.status(200).json({message:"post bookmarked",success:true});
    }
  } catch (error) {
    console.log(error);
  }
};
