const imageType = require('image-type');

module.exports = function(buffer) {
  return imageType(buffer);
};
