import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    profile_image: {
      type: String,
      required: false,
    },
    profession: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    socialProfiles: {
      type: Array,
      required: false,
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
