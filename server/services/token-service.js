import jwt from "jsonwebtoken";
import { TokenModel } from "../models/token-model.js";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

class TokenService {
  createToken({ ...payload }) {
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { algorithm: "HS256", expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { algorithm: "HS256", expiresIn: "30d" });
    return { accessToken, refreshToken };
  }
  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({ userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }
    return await TokenModel.create({ userId, refreshToken });
  }
  async deleteToken(refreshToken) {
    return await TokenModel.deleteOne({ refreshToken });
  }
  async findToken(refreshToken) {
    return await TokenModel.findOne({ refreshToken }).populate("userId");
  }
  verifyAccessToken(accessToken) {
    try {
      return jwt.verify(accessToken, JWT_ACCESS_SECRET);
    } catch (err) {
      return null;
    }
  }
  verifyRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return null;
    }
  }
}

export default new TokenService();
