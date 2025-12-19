import createHttpError from 'http-errors';

export const getCurrentUserController = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw createHttpError(401, 'Not authorized');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully found current user!',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
