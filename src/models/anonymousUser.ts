import { timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";

const anonymousUser = new mongoose.Schema(
  {
    anonId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const AnonymousUser = mongoose.model("AnonymousUser", anonymousUser);
