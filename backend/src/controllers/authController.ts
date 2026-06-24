import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.model';
import { signToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return next(new AppError('E-mail já cadastrado', 409));

    const user = await User.create({ name, email, passwordHash: password, phone });
    const token = signToken({ userId: String(user._id), role: user.role });

    ApiResponse.created(res, { user, token }, 'Conta criada com sucesso');
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return next(new AppError('E-mail ou senha inválidos', 401));

    const valid = await user.comparePassword(password);
    if (!valid) return next(new AppError('E-mail ou senha inválidos', 401));

    const token = signToken({ userId: String(user._id), role: user.role });

    ApiResponse.success(res, { user, token }, 'Login realizado com sucesso');
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) return next(new AppError('Usuário não encontrado', 404));
    ApiResponse.success(res, user);
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(req.user!.userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return next(new AppError('Usuário não encontrado', 404));
    ApiResponse.success(res, user, 'Perfil atualizado');
  } catch (err) {
    next(err);
  }
};