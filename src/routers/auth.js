import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../validation/authSchemas.js';
import { registerController, loginController, refreshController, logoutController, sendResetEmailController, resetPwdController } from '../controllers/auth.js';
import { loginSchema, resetEmailSchema, resetPwdSchema } from '../validation/authSchemas.js';

const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), ctrlWrapper(registerController));
authRouter.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
authRouter.post('/refresh', ctrlWrapper(refreshController));
authRouter.post('/logout', ctrlWrapper(logoutController));
authRouter.post('/send-reset-email', validateBody(resetEmailSchema), ctrlWrapper(sendResetEmailController));
authRouter.post('/reset-pwd', validateBody(resetPwdSchema), ctrlWrapper(resetPwdController));

export default authRouter;
