import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const checkAuthHeader = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['x-custom-auth'] as string;
  if (!authHeader) {
    return res
      .status(400)
      .json({ success: false, message: 'Auth header is required' });
  }

  try {
    const auth = JSON.parse(authHeader);
    if (!auth.userId) {
      return res
        .status(400)
        .json({ success: false, message: 'User ID is required' });
    }

    // Attach userId to the request object for downstream use
    req.userId = auth.userId;
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid auth header format' });
  }
};
