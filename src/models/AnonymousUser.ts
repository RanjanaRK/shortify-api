import mongoose from "mongoose";

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
