import { Router } from 'express';

import checkUserLikes from '../controllers/likesChecker';

const router = Router();

// api/posts/:id/comments
router.post('/user/likes', checkUserLikes);

export default router;
