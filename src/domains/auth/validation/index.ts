import { Schema } from "express-validator";

const MIN_PASSWORD_LENGTH = 5;
const MAX_PASSWORD_LENGTH = 25;
const MIN_NAME_LENGTH = 5;
const MAX_NAME_LENGTH = 25;

export const registrationSchema: Schema = {
  first_name: {
    notEmpty: {
      errorMessage: "first_name is required!",
    },
  },

  last_name: {
    notEmpty: {
      errorMessage: "last_name is required!",
    },
    isLength: {
      errorMessage: `last_name should be from  ${MIN_NAME_LENGTH} to ${MAX_NAME_LENGTH}`,
      options: { min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH },
    },
  },

  password: {
    customSanitizer: {
      options: (value) => value?.trim()?.toString(),
    },
    isLength: {
      errorMessage: `Пароль должен быть от ${MIN_PASSWORD_LENGTH} до${MAX_PASSWORD_LENGTH}`,
      options: { min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH },
    },

    //todo - strong password
  },
  email: {
    isEmail: true,
    errorMessage: "email is invalid",
  },
};

export const loginSchema: Schema = {
  password: {
    isLength: {
      errorMessage: `Пароль должен быть от ${MIN_PASSWORD_LENGTH} до${MAX_PASSWORD_LENGTH}`,
      options: { min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH },
    },
    customSanitizer: {
      options: (value) => value.toString(),
    },
  },
  email: {
    isEmail: { errorMessage: "email is invalid" },
  },
};
