const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const server = require("http").createServer(app);
const config = require("./config/key");

//Routes
const indexRoutes = require("./routes");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(indexRoutes);

//Connecting to mongoose
mongoose
  .connect(config.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((res) => console.log("Database Connected"))
  .catch((err) => console.log(err));

server.listen(3000, () => {
  console.log("Server Connected");
});
