const client = require("../config/dbConfig");
const { cloudinary } = require("../config/cloudinary");

// Upload product image to clooudinary
exports.uploadProduct = async (req, res) => {
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

    // Add product details to database
    const { statusCode } = await this.addNewProduct(
      req.body.data,
      public_id,
      format
    );

    statusCode === 200 &&
      res.send({ message: "Product Image Uploaded Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong" + JSON.stringify(err));
  }
};

// Add product to database
exports.addNewProduct = async (
  productDetails,
  productImageUrl,
  imageFormat
) => {
  const { productName, productPrice } = JSON.parse(productDetails);
  const sliceUrl = productImageUrl.split("/");
  console.log(productImageUrl);
  try {
    const response = await client.insert({
      table: "products",
      records: [
        {
          image_url: sliceUrl[1],
          imgExtension: `${imageFormat}r`,
          productName: productName,
          productPrice: productPrice,
        },
      ],
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    // Store is a reserved word so wrap with backtick -reason
    const allProducts = await client.query("SELECT * FROM `store`.products");
    res.send(allProducts);
  } catch (error) {
    console.error(error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const imgDeleteResponse = await cloudinary.uploader.destroy(
      `yuslovanny/${req.body.image_url}`,
      function (result) {
        console.log(result);
      }
    );

    console.log(imgDeleteResponse, "cloud");

    // Wait for the image to get delete from cloudinary
    // imgDeleteResponse &&
    client.delete(
      {
        table: "products",
        hashValues: [req.body.image_url],
      },
      (err, res) => {
        if (err) console.log(err);
        else console.log(res);
      }
    );
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
