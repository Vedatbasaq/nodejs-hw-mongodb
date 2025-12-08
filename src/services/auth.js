import { User } from '../db/models/users.js';
import { Session } from '../db/models/sessions.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

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

export const updateUserPassword = async (userId, passwordHash) => {
  return User.findByIdAndUpdate(userId, { password: passwordHash }, { new: true });
};

export const generateResetToken = (email) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret is not configured');
  }
  return jwt.sign({ email }, secret, { expiresIn: '5m' });
};

export const sendResetEmail = async (email, token) => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;
  const appDomain = process.env.APP_DOMAIN;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const base = appDomain?.replace(/\/$/, '') || 'http://localhost:3000';
  const link = `${base}/reset-password?token=${encodeURIComponent(token)}`;

  const info = await transporter.sendMail({
    from,
    to: email,
    subject: 'Reset your password',
    html: `Click the link to reset your password: <a href="${link}">${link}</a>`,
  });
  return info;
};
