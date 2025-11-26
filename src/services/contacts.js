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
