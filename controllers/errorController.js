const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTerror = () =>
  new AppError("Invalid token, Please log in again", 401);
const handleJWTExpirederror = () =>
  new AppError("Your token has expired, Please login again.", 401);
const handleTypeError = () => {
  return new AppError("Something went totally wrong!!", 404);
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
     
    res.status(err.statusCode).json({
      status: err.status,
      name: err.name,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
     
    //res.status(err.statusCode).render("error");
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
      
    if (err.isOperational) {
      
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      //return res.status(err.statusCode).render("error", { mesg: err.message });
    } else {
       
      res.status(500).json({
        status: "error",
        message: "Something went very wrong",
      });
      // return res
      //   .status(err.statusCode)
      //   .render("error", { msg: "Something went very wrong" });
    }
    // } else {
    //   res.status(err.statusCode).render("error");
  }
};
function doNothing() {
  const e = "error";
}
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
   if (process.env.NODE_ENV === "development") {
      sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    // let error = { ...err };
      if (err.name === "CastError") err = handleCastErrorDB(err);
      if (err.code === 11000) err = handleDuplicateFieldsDB(err);
      if (err.name === "ValidationError") err = handleValidationErrorDB(err);
      if (err.name === "JsonWebTokenError") err = handleJWTerror();
      if (err.name === "TokenExpiredError") err = handleJWTExpirederror();
      if (err.name === "TypeError") err = handleTypeError();
      sendErrorProd(err, req, res);
  }
};
