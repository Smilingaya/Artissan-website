const { Router } = require("express");
const router = Router();
const commentController = require("../controller/commentController");
router.post("create", commentController.create_comment_controller);
router.get("/post/:postId", commentController.get_comment_controller);
router.delete(
  "/delete/:commentId",
  commentController.delete_comment_controller
);
module.exports = router;
