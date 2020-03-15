const replaceTemplate = (temp, item) => {
  return temp
    .replace(/{%PRODUCT_NAME%}/g, item.productName)
    .replace(/{%PRICE%}/g, item.price)
    .replace(/{%FROM%}/g, item.from)
    .replace(/{%NUTRIENTS%}/g, item.nutrients)
    .replace(/{%QUANTITY%}/g, item.quantity)
    .replace(/{%DESCRIPTION%}/g, item.description)
    .replace(/{%ID%}/g, item.id)
    .replace(/{%IMAGE%}/g, item.image)
    .replace(/{%NOT_ORGANIC%}/g, item.organic ? "" : "not-organic");
};

module.exports = { replaceTemplate };
