const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require("./config/database");
const APIError = require("./helpers/APIError");
const httpStatus = require("http-status");
const cluster = require("cluster");
const http = require("http");
const process = require("process");
const os = require("os");

const cpus = os.cpus;
 const numCPUs = cpus().length;

const path = require("path");

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ limit: "15gb", extended: true }));
app.use(bodyParser.json({ limit: "15gb" }));

app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "Dummy",
    resave: true,
    saveUninitialized: true,
  })
);


db.connection().then((database) => {
  module.exports = database;
 app.use("/api/product", require("./routes/product.route"));
 

  app.use((err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
      const error = new APIError(err.details, err.statusCode, true);
      return next(error);
    } else if (!(err instanceof APIError)) {
      const apiError = new APIError(
        err.message,
        err.status,
        err.name === "UnauthorizedError" ? true : err.isPublic
      );
      return next(apiError);
    }
    return next(err);
  });

  app.use((req, res, next) => {
    const err = new APIError("API Not Found", httpStatus.NOT_FOUND, true);
    return next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status).json({
      error: {
        message: err.isPublic ? err.message : httpStatus[err.status],
      },
    });
  });
 if (cluster.isPrimary) {
   console.log(`Primary ${process.pid} is running`);

   // Fork workers.
   for (let i = 0; i < numCPUs; i++) {
     cluster.fork();
   }

   cluster.on("exit", (worker, code, signal) => {
     console.log(`worker ${worker.process.pid} died`);
   });
 } else {
   // Workers can share any TCP connection
   // In this case it is an HTTP server
   http
     .createServer((req, res) => {
       res.writeHead(200);
       res.end("hello world\n");
     })
     .listen( `${port}`);

   console.log(`Worker ${process.pid} started`);
 }

});
