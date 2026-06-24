import { Response } from 'express';

export const ApiResponse = {
  success<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
  },

  created<T>(res: Response, data: T, message = 'Created') {
    return res.status(201).json({ success: true, message, data });
  },

  error(res: Response, message: string, statusCode = 500) {
    return res.status(statusCode).json({ success: false, message, data: null });
  },

  paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message = 'Success'
  ) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  },
};