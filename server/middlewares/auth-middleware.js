import { ApiError } from "../exceptions/api-error.js";
import TokenService from "../services/token-service.js";

const AuthMiddleware = (group) => (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer")) {
      return next(ApiError.Forbidden());
    }
    const accessToken = authorization.substring(7);
    if (!accessToken) {
      return next(ApiError.Forbidden());
    }
    const payload = TokenService.verifyAccessToken(accessToken);
    if (!payload || !payload.groups.find((value) => value === group)) {
      return next(ApiError.Forbidden());
    }
    req.user = payload;
    return next();
  } catch (err) {
    return next(ApiError.Forbidden());
  }
};

export { AuthMiddleware };
