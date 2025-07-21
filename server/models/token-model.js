import { model, Schema } from "mongoose";

const TokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  refreshToken: { type: String, required: true },
});

const TokenModel = model("Token", TokenSchema);

export { TokenModel };
