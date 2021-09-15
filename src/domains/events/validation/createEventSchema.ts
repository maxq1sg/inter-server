import { Schema } from "express-validator";
import {
  MAX_EVENT_DESC_LENGTH,
  MAX_EVENT_NAME_LENGTH,
  MIN_EVENT_DESC_LENGTH,
  MIN_EVENT_NAME_LENGTH,
} from "./constants";

export const createEventSchema: Schema = {
  owner_id: {
    isInt: { errorMessage: "no such user!" },
  },

  "body.name": {
    trim: true,
    exists: {
      errorMessage: "name is required!",
    },
    isLength: {
      errorMessage: `name of the event should be from ${MIN_EVENT_NAME_LENGTH} to ${MAX_EVENT_NAME_LENGTH}`,
      options: { min: MIN_EVENT_NAME_LENGTH, max: MAX_EVENT_NAME_LENGTH },
    },
  },

  "body.description": {
    trim: true,
    exists: {
      errorMessage: "description is required!",
    },
    isLength: {
      errorMessage: `description of the event should be from ${MIN_EVENT_DESC_LENGTH} to ${MAX_EVENT_DESC_LENGTH}`,
      options: { max: MAX_EVENT_DESC_LENGTH },
    },

    customSanitizer: {
      options: (value) => value || null,
    },
  },
};
