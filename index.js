const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(cors());
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const categoriesRouter = require("./routes/categories");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage });

//use static files
app.use("/images", express.static("images"))

//Route only for upload file (image in this case)
app.post("/api/upload", upload.single("file"), (req, res) => {
  return res.status(200).json("File has been uploaded!");
});

const PORT = process.env.PORT || 5000;

const connectDb = async () => {
  try {
    // @ts-ignore
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1); // restart if error
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Auth route
app.use("/api/auth", authRouter);

//Users route
app.use("/api/users", usersRouter);

//posts route
app.use("/api/posts", postsRouter);

//categories route
app.use("/api/categories", categoriesRouter);

app;
connectDb();
app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
