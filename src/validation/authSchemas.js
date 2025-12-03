export const registerSchema = {
  name: { type: 'string', required: true, min: 3, max: 20 },
  email: { type: 'string', required: true, email: true, min: 3, max: 100 },
  password: { type: 'string', required: true, min: 6, max: 100 },
};

export const loginSchema = {
  email: { type: 'string', required: true, email: true, min: 3, max: 100 },
  password: { type: 'string', required: true, min: 6, max: 100 },
};
