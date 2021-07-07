const { cloudinary } = require("./config/cloudinary");
const express = require("express");
const app = express();
var cors = require("cors");
const multer = require("multer");
const { addNewProduct } = require("./controller/newProduct");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Get images
app.get("/api/images", async (req, res) => {
  const { resources } = await cloudinary.search
    .expression("folder:yuslovanny")
    .sort_by("public_id", "desc")
    .max_results(30)
    .execute();

  const publicIds = resources.map((file) => file.public_id);
  res.send(publicIds);
});

// Upload Images
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    // Pull out the file as string
    const fileString = req.body.file;

    // Upload product image to cloudinary
    const { public_id, format, secure_url } = await cloudinary.uploader.upload(
      fileString,
      {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      }
    );

    // console.log(secure_url);

    // Add product details to database
    const { statusCode } = await addNewProduct(
      req.body.data,
      public_id,
      format
    );

    statusCode === 200 &&
      res.send({ message: "Product Image Uploaded Successfully" });
  } catch (err) {
    res.status(500).json({ err: "Something went wrong" + err });
  }
});

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log("listening on 3003");
});
