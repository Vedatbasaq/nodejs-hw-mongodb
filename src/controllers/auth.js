import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { findUserByEmail, createUser, deleteSessionsByUserId, createSession, findSessionByRefreshToken, deleteSessionByIdAndToken } from '../services/auth.js';
import { randomBytes } from 'crypto';

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      throw createHttpError(400, 'Missing required fields');
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      throw createHttpError(409, 'Email in use');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = await createUser({ name, email, passwordHash });
    const safe = user.toObject();
    delete safe.password;

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: safe,
    });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      throw createHttpError(400, 'Missing required fields');
    }

    const user = await findUserByEmail(email);
    if (!user) {
      throw createHttpError(401, 'Email or password is wrong');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createHttpError(401, 'Email or password is wrong');
    }

    const accessToken = randomBytes(32).toString('hex');
    const refreshToken = randomBytes(32).toString('hex');
    const now = Date.now();
    const accessTokenValidUntil = new Date(now + 15 * 60 * 1000);
    const refreshTokenValidUntil = new Date(now + 30 * 24 * 60 * 60 * 1000);

    await deleteSessionsByUserId(String(user._id));
    const createdSession = await createSession({
      userId: String(user._id),
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: refreshTokenValidUntil,
    });
    res.cookie('sessionId', String(createdSession._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: refreshTokenValidUntil,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw createHttpError(401, 'Not authorized');
    }

    const session = await findSessionByRefreshToken(refreshToken);
    if (!session) {
      throw createHttpError(401, 'Not authorized');
    }
    if (new Date(session.refreshTokenValidUntil).getTime() <= Date.now()) {
      throw createHttpError(401, 'Not authorized');
    }

    const userId = session.userId;

    const newAccessToken = randomBytes(32).toString('hex');
    const newRefreshToken = randomBytes(32).toString('hex');
    const now = Date.now();
    const accessTokenValidUntil = new Date(now + 15 * 60 * 1000);
    const refreshTokenValidUntil = new Date(now + 30 * 24 * 60 * 60 * 1000);

    await deleteSessionsByUserId(String(userId));
    const newSession = await createSession({
      userId: String(userId),
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: refreshTokenValidUntil,
    });
    res.cookie('sessionId', String(newSession._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: refreshTokenValidUntil,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: newAccessToken },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId;
    const refreshToken = req.cookies?.refreshToken;
    if (!sessionId || !refreshToken) {
      throw createHttpError(401, 'Not authorized');
    }

    const result = await deleteSessionByIdAndToken(sessionId, refreshToken);
    if (result.deletedCount === 0) {
      throw createHttpError(401, 'Not authorized');
    }

    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
