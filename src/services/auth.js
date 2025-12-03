import { User } from '../db/models/users.js';
import { Session } from '../db/models/sessions.js';

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const createUser = async ({ name, email, passwordHash }) => {
  return User.create({ name, email, password: passwordHash });
};

export const deleteSessionsByUserId = async (userId) => {
  await Session.deleteMany({ userId });
};

export const createSession = async ({ userId, accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil }) => {
  return Session.create({ userId, accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil });
};

export const findSessionByRefreshToken = async (refreshToken) => {
  return Session.findOne({ refreshToken });
};

export const deleteSessionByIdAndToken = async (sessionId, refreshToken) => {
  return Session.deleteOne({ _id: sessionId, refreshToken });
};

export const findSessionByAccessToken = async (accessToken) => {
  return Session.findOne({ accessToken });
};

export const findUserById = async (id) => {
  return User.findById(id);
};
