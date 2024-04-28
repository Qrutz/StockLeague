// routes/feedRoutes.ts
import express from 'express';

import { checkAuthHeader } from '../middleware/authmiddleware';
import { getGlobalFeed } from '../controllers/globalFeed';
import { getNewFeed } from '../controllers/newFeed';
import { getTickerFeed } from '../controllers/tickerFeed';

const router = express.Router();

router.use(checkAuthHeader);

router.get('/global-feed', getGlobalFeed);

router.get('/All', getNewFeed);

router.get('/ticker-feed/:ticker', getTickerFeed);

export default router;
