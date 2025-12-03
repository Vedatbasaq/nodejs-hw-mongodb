export const createContactSchema = {
  name: { type: 'string', required: true, min: 3, max: 20 },
  phoneNumber: { type: 'string', required: true, min: 3, max: 20 },
  email: { type: 'string', required: false, min: 3, max: 20 },
  isFavourite: { type: 'boolean', required: false },
  contactType: { type: 'string', required: true, enum: ['work', 'home', 'personal'], min: 3, max: 20 },
};

export const updateContactSchema = {
  name: { type: 'string', required: false, min: 3, max: 20 },
  phoneNumber: { type: 'string', required: false, min: 3, max: 20 },
  email: { type: 'string', required: false, min: 3, max: 20 },
  isFavourite: { type: 'boolean', required: false },
  contactType: { type: 'string', required: false, enum: ['work', 'home', 'personal'], min: 3, max: 20 },
};
