import mongoose from "mongoose";

const UrlClickSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      index: true,
    },

    ip: {
      type: String,
    },

    browser: {
      type: String,
    },

    os: {
      type: String,
    },

    device: {
      type: String,
      default: "desktop",
    },

    referer: {
      type: String,
      default: "direct",
    },
  },
  {
    timestamps: true,
  }
);

export const UrlClick = mongoose.model("UrlClick", UrlClickSchema);
