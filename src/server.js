require("express-async-errors");
const AppError = require("./utils/AppError");

const express = require("express");
const routes = require("./routes");

const migrationsRun = require("./database/sqlite/migrations");
migrationsRun();

const app = express();
app.use(express.json());

app.use(routes);


app.use(( error, req, res, next ) => {
  if(error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.error(error);

  return res.status(500).json({
    status: "error", 
    message: error.message
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));