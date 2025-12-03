import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../validation/contactSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();
contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
contactsRouter.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));
contactsRouter.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));
contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;
