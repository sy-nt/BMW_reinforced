import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cmtRoute from "./routes/cmt.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import https from "node:https";
import fs from "fs";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(
    helmet({
        tcpTimestamps: false,
    })
);
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'");
    next();
});

const options = {
    key: fs.readFileSync(__dirname + "/ssl/server.key"),
    cert: fs.readFileSync(__dirname + "/ssl/server.crt"),
};
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
    cors({
        origin: [
            "http://3.227.150.6:3000",
            "https://localhost:3000",
            "http://52.0.222.231:3000",
        ],
    })
);
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
        const fileOriginalName = file.fieldname
            .toLowerCase()
            .split(" ")
            .join("-");
        cb(
            null,
            fileOriginalName +
                "-" +
                Date.now() +
                path.extname(file.originalname)
        );
    },
});
const upload = multer({
    storage,
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    },
});
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    console.log(`exiname:: ${extname}`);
    console.log(`mimetype:: ${mimetype}`);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        throw new Error("Invalid file type");
    }
}
/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", cmtRoute);
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        https.createServer(options, app).listen(PORT, () => {
            console.log(`Server Port: ${PORT}`);
        });
        // app.listen(PORT, () => {
        //     console.log(`Server port:: ${PORT}`);
        // });
    })
    .catch((error) => console.log(`${error} did not connect`));
