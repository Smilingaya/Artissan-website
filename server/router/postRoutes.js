const { Router } = require("express");
const router = Router();
const { upload } = require("../utils/cloudinaryConfig");
const postController = require("../controller/postController");
const { requireMidllware } = require("../midllware/authMidllware");
router.post(
  //correct
  "/postBlog",
  requireMidllware,
  upload.array("media", 5),
  postController.craete_post
);
router.get(
  "/postBlog/length_post",
  requireMidllware,
  postController.length_post
);
router.get("/postBlog/all", postController.fetchAllPlatformPosts);
router.get("/postBlog/:userId", requireMidllware, postController.GET_post);
router.get(
  //correct
  "/postBlog/get/:postId",
  requireMidllware,
  postController.GET_One_post
);
router.put("/postBlog/:postId", requireMidllware, postController.Update_post); //correct
router.delete(
  //correct
  "/postBlog/:postId",
  requireMidllware,
  postController.Deleat_post
);
router.post(
  "/postBlog/:postId/like", //correct
  requireMidllware,
  postController.like_Post_Controller
);
router.post(
  "/postBlog/:postId/dislike", //correct
  requireMidllware,
  postController.dislike_Controller
);
router.get(
  //correct
  "/postBlog/:postId/likes",
  requireMidllware,
  postController.likes_get_controller
);
router.get("/searchPost", postController.search_post);
router.get(
  "/postBlog/recommend/:userId",
  requireMidllware,
  postController.recommendPosts
);
module.exports = router;
