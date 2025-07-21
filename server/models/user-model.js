import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    groups: { type: [String], default: ["user"] },
  },
  { timestamps: true }
);

const UserModel = model("User", UserSchema);

export { UserModel };
