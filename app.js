import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import "./socket.js";

dotenv.config();

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json({ limit: "25MB" }));

app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 50000,
  })
);

import { router as adminRouter } from "./socket.js";

app.use("/playgroup/admin", adminRouter);

//socket Io connections
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
  
    // render the error page
    res.status(err.status || 500);
});  

app.use(cors({
  origin: '*'
}));

app.options('*', cors())

app.use(cookieParser());

app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    console.error(`Error catched! ${err}`);
  
    const error = {
      status: err.status || 500,
      message: err.message,
    };
  
    res.status(error.status).send(error);
});

function onError(error) {
    if (error.syscall !== "listen") {
      console.error(error);
    }
  
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
      default:
        console.error(error);
    }
  }
  
  function onListening() {
    const addr = app.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("\nListening on " + bind);
  }
  
  app.listen(6252);
  app.on("error", onError);
  app.on("listening", onListening);
  
  console.log("Server started on port " + 6252);