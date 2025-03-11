const { Router } = require("express");
const router = Router();
const { upload } = require("../utils/cloudinaryConfig");
const postController = require("../controller/postController");

router.post("/postBlog", upload.array("media", 5), postController.post);
router.get("/postBlog", postController.GET_post);
router.put("/postBlog/:id", postController.GET_One_post);
router.delete("/postBlog/:id", postController.Deleat_post);
module.exports = router;
