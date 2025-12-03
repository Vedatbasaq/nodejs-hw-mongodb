import createError from 'http-errors';
import { findSessionByAccessToken, findUserById } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const [scheme, token] = auth.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw createError(401, 'Not authorized');
    }

    const session = await findSessionByAccessToken(token);
    if (!session) {
      throw createError(401, 'Not authorized');
    }
    if (new Date(session.accessTokenValidUntil).getTime() <= Date.now()) {
      throw createError(401, 'Access token expired');
    }

    const user = await findUserById(session.userId);
    if (!user) {
      throw createError(401, 'Not authorized');
    }

    req.user = { id: String(user._id), _id: String(user._id), email: user.email, name: user.name };
    next();
  } catch (err) {
    next(err);
  }
};
