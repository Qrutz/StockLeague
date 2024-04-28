import { Router } from 'express';
import createPost from '../controllers/createPost';
import deletePost from '../controllers/deletePost';
import likePost from '../controllers/likePost';
import createComment from '../controllers/createComment';
import getPost from '../controllers/getPost';
import { getAllPosts } from '../controllers/getAllPosts';
import { getUserPosts } from '../controllers/getUserPosts';
import unlikePost from '../controllers/unlikePost';
import { checkAuthHeader } from '../middleware/authmiddleware';
import checkUserLikes from '../controllers/likesChecker';
import { getUserLikedPosts } from '../controllers/getUserLikedPosts';

const router = Router();

router.get('/', getAllPosts);
router.post('/', createPost);
router.get('/:id', getPost);

router.post('/:id/like', likePost);
router.delete('/:id/unlike', unlikePost);
router.post('/:id/comments', createComment);
router.delete('/:id', deletePost);

router.get('/user/:userId', getUserPosts);
router.get('/user/:userId/likes', getUserLikedPosts);

export default router;
