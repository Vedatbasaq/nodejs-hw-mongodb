import { Contact } from '../db/models/contacts.js';
export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const updated = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
    runValidators: true,
  });
  return updated;
};

export const deleteContact = async (contactId) => {
  const deleted = await Contact.findByIdAndDelete(contactId);
  return deleted;
};

export const getContactsPaginated = async (page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filter = {}) => {
  const p = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const pp = Number.isFinite(Number(perPage)) && Number(perPage) > 0 ? Number(perPage) : 10;
  const allowedSortFields = ['name', 'phoneNumber', 'email', 'isFavourite', 'contactType', 'createdAt'];
  const field = allowedSortFields.includes(sortBy) ? sortBy : 'name';
  const order = sortOrder === 'desc' ? -1 : 1;
  const skip = (p - 1) * pp;
  const [data, totalItems] = await Promise.all([
    Contact.find(filter).sort({ [field]: order }).skip(skip).limit(pp),
    Contact.countDocuments(filter),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalItems / pp));
  const hasPreviousPage = p > 1;
  const hasNextPage = p < totalPages;
  return { data, page: p, perPage: pp, totalItems, totalPages, hasPreviousPage, hasNextPage };
};
