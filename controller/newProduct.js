const client = require("./../config/dbConfig");

exports.addNewProduct = async (
  productDetails,
  productImageUrl,
  imageFormat
) => {
  const { productName, productPrice } = JSON.parse(productDetails);
  const sliceUrl = productImageUrl.split("/");
  try {
    const response = await client.insert({
      table: "products",
      records: [
        {
          image_url: sliceUrl[1],
          imgExtension: `r${imageFormat}`,
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
