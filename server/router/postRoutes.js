const { Router } = require("express");
const router = Router();
const postController = require("../controller/postController");

router.post("/post", postController.post);
module.exports = router;
