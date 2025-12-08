import { getContactById, createContact, updateContact, deleteContact, getContactsPaginated } from '../services/contacts.js';
import { uploadImageBuffer } from '../utils/cloudinary.js';
import createError from 'http-errors';

export const getContactsController = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = (req.query.sortOrder || 'asc').toLowerCase();
    const type = req.query.type;
    const favParam = req.query.isFavourite;
    const fav = favParam === 'true' ? true : favParam === 'false' ? false : undefined;
    const filter = {};
    if (type && ['work', 'home', 'personal'].includes(type)) filter.contactType = type;
    if (fav !== undefined) filter.isFavourite = fav;
    filter.userId = req.user?._id || req.user?.id;
    const result = await getContactsPaginated(page, perPage, sortBy, sortOrder, filter);
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: result,
    });
  } catch {
    next(createError(500, 'Failed to retrieve contacts'));
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user?._id || req.user?.id;
    const contact = await getContactById(contactId, userId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch {
    next(createError(404, 'Contact not found'));
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body || {};

    if (!name || !phoneNumber || !contactType) {
      throw createError(400, 'Missing required fields');
    }

    const userId = req.user?._id || req.user?.id;
    const favValue = typeof isFavourite === 'string' ? isFavourite === 'true' : isFavourite;
    let photoUrl;
    if (req.file?.buffer) {
      try {
        photoUrl = await uploadImageBuffer(req.file.buffer);
      } catch {
        return next(createError(500, 'Failed to upload photo'));
      }
    }
    const payload = { name, phoneNumber, email, isFavourite: favValue, contactType, userId };
    if (photoUrl) payload.photo = photoUrl;
    const created = await createContact(payload);

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: created,
    });
  } catch (err) {
    next(err);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const payload = req.body || {};
    const userId = req.user?._id || req.user?.id;
    if (typeof payload.isFavourite === 'string') {
      payload.isFavourite = payload.isFavourite === 'true';
    }
    if (req.file?.buffer) {
      try {
        const url = await uploadImageBuffer(req.file.buffer);
        payload.photo = url;
      } catch {
        return next(createError(500, 'Failed to upload photo'));
      }
    }
    const updated = await updateContact(contactId, payload, userId);
    if (!updated) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user?._id || req.user?.id;
    const deleted = await deleteContact(contactId, userId);
    if (!deleted) {
      throw createError(404, 'Contact not found');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
