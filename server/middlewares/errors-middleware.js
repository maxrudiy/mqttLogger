import { ApiError } from "../exceptions/api-error.js";

const errorLogger = (err, req, res, next) => {
  console.log(err);
  return next(err);
};
const errorResponce = (err, req, res, next) => {
  err instanceof ApiError
    ? res.status(err.status).json({ message: err.message, errors: err.errors })
    : res.status(500).json({ message: "Internal Server Error" });
};

export { errorLogger, errorResponce };
