const { Router } = require("express");
const router = Router();
const { upload } = require("../utils/cloudinaryConfig");
const postController = require("../controller/postController");

router.post("/postBlog", upload.array("media", 5), postController.craete_post);
router.get("/postBlog/:userId", postController.GET_post);
router.get("/postBlog/get/:postId", postController.GET_One_post);
router.put("/postBlog/:postId", postController.Update_post);
router.delete("/postBlog/get/:postId", postController.Deleat_post);
router.post("/postBlog/:postId/like", postController.like_Post_Controller);
router.post("/postBlog/:postId/dislike", postController.dislike_Controller);
router.get("/postBlog/:postId/likes", postController.likes_get_controller);
module.exports = router;
