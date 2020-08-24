const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const server = require("http").createServer(app);
const config = require("./config/key");
const exphbs = require("express-handlebars");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);

//Auth
const register = require("./auth/register");
const login = require("./auth/login");
const google = require("./auth/google");
const github = require("./auth/github");

//Passport
const passport = require("passport");

//Routes
const indexRoutes = require("./routes");
const callRoutes = require("./routes/call");
const { execArgv } = require("process");

//Connecting to mongoose
mongoose
  .connect(config.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((res) => console.log("Database Connected"))
  .catch((err) => console.log(err));

app.use(
  session({
    secret: config.secret,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use(express.static("public"));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

register(passport);
login(passport);
google(passport);
github(passport);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Add the auth routes after initializing passport as those will cause the router to be added to the stack earlier than you intend.
app.use(indexRoutes);
app.use(callRoutes);

io.on("connect", (socket) => {
  socket.on("join-room", (id) => {
    socket.broadcast.emit("user-connected", id);
    console.log("joined: ", id);

    socket.on("disconnect", () => {
      socket.broadcast.emit("user-disconnected", id);
    });
  });
});

server.listen(3000, () => {
  console.log("Server Connected");
});
