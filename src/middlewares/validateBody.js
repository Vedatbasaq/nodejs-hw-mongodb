import createError from 'http-errors';

const isString = (v) => typeof v === 'string';
const isBoolean = (v) => typeof v === 'boolean';

const validators = {
  string: (key, value, rules) => {
    if (!isString(value)) return `${key} must be a string`;
    const len = value.trim().length;
    if (rules.min && len < rules.min) return `${key} must be at least ${rules.min} characters`;
    if (rules.max && len > rules.max) return `${key} must be at most ${rules.max} characters`;
    if (rules.enum && !rules.enum.includes(value)) return `${key} must be one of: ${rules.enum.join(', ')}`;
    return null;
  },
  boolean: (key, value) => {
    if (!isBoolean(value)) return `${key} must be a boolean`;
    return null;
  },
};

export const validateBody = (schema) => {
  return (req, res, next) => {
    const body = req.body || {};

    // Required checks
    for (const [key, rules] of Object.entries(schema)) {
      if (rules.required && !(key in body)) {
        return next(createError(400, `Missing required field: ${key}`));
      }
    }

    // Field validations
    for (const [key, value] of Object.entries(body)) {
      const rules = schema[key];
      if (!rules) continue; // ignore unknown fields
      const validator = validators[rules.type];
      if (!validator) continue;
      const error = validator(key, value, rules);
      if (error) return next(createError(400, `Validation error: ${error}`));
    }

    next();
  };
};
