const express = require("express");

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const favicon = require("serve-favicon");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// security
app.use(helmet());
app.use(cors());
app.use(compression());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/client/build")));
app.use(favicon(path.join(__dirname, "public", "fav.svg")));

app.use(logger("dev"));

const limiter = rateLimit({
  max: 100,
  windoMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

app.use("/", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(
  express.urlencoded({
    extended: true,
  })
);
// body parser
app.use(cookieParser());
// nosql query injection
app.use(mongoSanitize());

// data xss
app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  
  next();
});

// routers
const indexRouter = require("./routes/indexRouter");

// routes
app.use('/', indexRouter);
 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.get("*", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
