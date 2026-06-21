import { Request, Response, NextFunction } from 'express';

export function slowApiLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.log(
        `[SLOW API] ${req.method} ${req.originalUrl} - ${duration}ms`,
      );
    }
  });

  next();
}
