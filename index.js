const express = require("express");
const app = express();
var cors = require("cors");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const productRouters = require("./routes/productsRoutes");

app.use("/products/", productRouters);

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log("listening on 3003");
});
