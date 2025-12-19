import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getCurrentUserController } from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';

const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/current', ctrlWrapper(getCurrentUserController));

export default usersRouter;
