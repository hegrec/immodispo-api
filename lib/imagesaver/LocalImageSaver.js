const fs = require('fs');
const Path = require('path');

function saveImage(buffer, fileName) {
  const path = Path.join(__dirname, '../../content', fileName);

  return new Promise((resolve, reject) => fs.writeFile(path, buffer, (err) => err ? reject(err) : resolve(true)));
}


function deleteImage(fileName, cb) {
  const imagePath = Path.join(__dirname, '../../content', fileName);

  return new Promise((resolve, reject) => fs.unlink(imagePath, (err) => err ? reject(err) : resolve(true)));

}

module.exports = {
  saveImage: saveImage,
  deleteImage: deleteImage
};
