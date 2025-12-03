import createError from 'http-errors';
import mongoose from 'mongoose';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createError(400, 'Invalid id'));
  }
  next();
};
