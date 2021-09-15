import { Schema } from "express-validator";

const MINIMAL_QUERY_LENGTH = 1;

export const searchEventSchema: Schema = {
  query: {
    trim: true,
    isLength: {
      errorMessage: "Your query should not be empty!",
      options: { min: MINIMAL_QUERY_LENGTH },
    },
  },
  categories: {
    custom: {
      options: (value) => {
        return value?.length > 0;
      },
    },
    errorMessage: "Select at least one category!",
  },
};
