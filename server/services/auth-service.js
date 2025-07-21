import bcrypt from "bcrypt";
import { UserDTO } from "../dtos/user-dto.js";
import { ApiError } from "../exceptions/api-error.js";
import { UserModel } from "../models/user-model.js";
import TokenService from "./token-service.js";

class AuthService {
  async createOrUpdate(username, password) {
    const passHash = await bcrypt.hash(password, 3);

    let userData;
    userData = await UserModel.findOneAndUpdate({ username }, { password }, { upsert: true, new: true, setDefaultsOnInsert: true });
    if (!userData) {
      userData = await UserModel.create({
        username,
        password: passHash,
      });
    }

    const userDto = new UserDTO(userData);
    const tokens = TokenService.createToken(userDto);
    await TokenService.saveToken(userDto.userId, tokens.refreshToken);
    return {
      tokens,
      user: userDto,
    };
  }

  async login(username, password) {
    const userData = await UserModel.findOne({ username });
    if (!userData) {
      throw ApiError.BadRequest(`User with ${username} not found`);
    }
    const passIsValid = await bcrypt.compare(password, userData.password);
    if (!passIsValid) {
      throw ApiError.BadRequest("Wrong password");
    }
    const userDto = new UserDTO(userData);
    const tokens = TokenService.createToken(userDto);
    await TokenService.saveToken(userDto.userId, tokens.refreshToken);
    return {
      tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    return await TokenService.deleteToken(refreshToken);
  }

  async refresh(refreshToken) {
    const tokenData = await TokenService.findToken(refreshToken);
    const payload = TokenService.verifyRefreshToken(refreshToken);
    if (!tokenData || !payload || tokenData.userId.id !== payload.userId) {
      throw ApiError.BadRequest("Wrong token");
    }
    const userDto = new UserDTO(tokenData.userId);
    const tokens = TokenService.createToken(userDto);
    await TokenService.saveToken(userDto.userId, tokens.refreshToken);
    return {
      tokens,
      user: userDto,
    };
  }
}

export default new AuthService();
