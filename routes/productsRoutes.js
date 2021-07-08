// Player router
const router = require("express").Router();
const {
  uploadProduct,
  getProducts,
  deleteProduct,
} = require("../controllers/productsController");
const multer = require("multer");

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

// Routes
router.post("/upload", upload.single("file"), uploadProduct);
router.get("/all", getProducts);
router.put("/delete", deleteProduct);

module.exports = router;
