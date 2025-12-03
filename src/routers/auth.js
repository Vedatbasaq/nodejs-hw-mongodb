import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../validation/authSchemas.js';
import { registerController, loginController, refreshController, logoutController } from '../controllers/auth.js';
import { loginSchema } from '../validation/authSchemas.js';

const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), ctrlWrapper(registerController));
authRouter.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
authRouter.post('/refresh', ctrlWrapper(refreshController));
authRouter.post('/logout', ctrlWrapper(logoutController));

export default authRouter;
