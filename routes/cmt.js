import express from "express";
import { createComment } from "../controllers/cmt.js";

const router = express.Router();

router.post("/:postId", createComment);

export default router;
