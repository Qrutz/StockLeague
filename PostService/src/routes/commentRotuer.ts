import { Router } from "express";
import createComment from "../controllers/createComment";


const router = Router();

// api/posts/:id/comments
router.post("/:id/comments", createComment);


export default router;