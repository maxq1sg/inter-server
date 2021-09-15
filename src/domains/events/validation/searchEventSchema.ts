import { Schema } from "express-validator";

export const searchEventSchema: Schema = {
  categories: {
    custom: {
      options: (value) => {
        return value?.length > 0;
      },
    },
    errorMessage: "Select at least one category!",
  },
};
