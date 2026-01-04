import mongoose from "mongoose";

const UrlClickSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    required: true,
  },
  ip: String,
  userAgent: String,
  referer: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const UrlClick = mongoose.model("UrlClick", UrlClickSchema);
