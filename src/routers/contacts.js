import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
} from '../controllers/contacts.js';

const contactsRouter = Router();

contactsRouter.get('/', getContactsController);
contactsRouter.get('/:contactId', getContactByIdController);

export default contactsRouter;