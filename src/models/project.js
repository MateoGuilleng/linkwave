import mongoose from "mongoose";

const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    banner: {
      type: String,
      required: false,
      default:
        "https://res.cloudinary.com/dudftt5ha/image/upload/v1716151679/yp1vcyfpqmn034jedg8n.jpg",
    },
    projectType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    comments: {
      type: Array,
      required: false,
    },
    stars: {
      type: Number,
      required: false,
    },
    starredBy: {
      type: Array,
      required: false,
    },
    files: {
      type: Array,
      required: false,
    },
    boxes: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
