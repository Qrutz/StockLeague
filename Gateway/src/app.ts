import express, { Request } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import clerkClient, { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import type { StrictAuthProp } from '@clerk/clerk-sdk-node';
var proxy = require('express-http-proxy');

// For env Files
dotenv.config();

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

const postServiceProxy = proxy(process.env.POSTSERVICE_URL, {
  proxyReqOptDecorator: function (proxyReqOpts: Request, originalReq: Request) {
    // Add custom header with authentication info
    if (originalReq.auth) {
      proxyReqOpts.headers['X-Custom-Auth'] = JSON.stringify(originalReq.auth);
    }
    return proxyReqOpts;
  },

  proxyReqPathResolver: function (req: Request) {
    return req.url;
  },
});

const timelineServiceProxy = proxy(process.env.TIMELINESERVICE_URL, {
  proxyReqOptDecorator: function (proxyReqOpts: Request, originalReq: Request) {
    // Add custom header with authentication info
    if (originalReq.auth) {
      proxyReqOpts.headers['X-Custom-Auth'] = JSON.stringify(originalReq.auth);
    }
    return proxyReqOpts;
  },

  proxyReqPathResolver: function (req: Request) {
    return req.url;
  },
});

const leaderboardServiceProxy = proxy(process.env.LEADERBOARDSERVICE_URL, {
  proxyReqOptDecorator: function (proxyReqOpts: Request, originalReq: Request) {
    // Add custom header with authentication info
    if (originalReq.auth) {
      proxyReqOpts.headers['X-Custom-Auth'] = JSON.stringify(originalReq.auth);
    }
    return proxyReqOpts;
  },

  proxyReqPathResolver: function (req: Request) {
    return req.url;
  },
});

const userServiceProxy = proxy(process.env.USERSERVICE_URL, {
  proxyReqOptDecorator: function (proxyReqOpts: Request, originalReq: Request) {
    // Add custom header with authentication info
    if (originalReq.auth) {
      proxyReqOpts.headers['X-Custom-Auth'] = JSON.stringify(originalReq.auth);
    }
    return proxyReqOpts;
  },

  proxyReqPathResolver: function (req: Request) {
    return req.url;
  },
});

//  Services
app.use('/api/posts', ClerkExpressRequireAuth(), postServiceProxy);
app.use('/api/timeline', ClerkExpressRequireAuth(), timelineServiceProxy);
app.use('/api/leaderboard', ClerkExpressRequireAuth(), leaderboardServiceProxy);
app.use('/api/users', ClerkExpressRequireAuth(), userServiceProxy);

app.listen(port, () => {
  console.log(`Starting server at http://localhost:${port}`);
});
