import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import {
    addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPost,
  getCommentsOfPost,
  getPostById,
} from "../controllers/post.controller.js";
import { likePost } from "../controllers/post.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/addpost").post(isAuthenticated, upload.single('image'),addNewPost);
router.route("/all").get(getAllPost);
router.route("/userpost/all").get(isAuthenticated, getPostById);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
router.route("/:id/comment").post(isAuthenticated, addComment);
router.route("/:id/comment/all").post(isAuthenticated, getCommentsOfPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/:id/bookmark").post(isAuthenticated, bookmarkPost);

export default router;
