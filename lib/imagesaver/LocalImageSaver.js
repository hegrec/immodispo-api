var fs = require('fs'),
    Path = require('path');

function saveImage(buffer, fileName, cb) {
    var imagePath = Path.join(__dirname, '../../content', fileName);
    fs.writeFile(imagePath, buffer, function(err) {
        if (err) {
            cb(err);
        } else {
            cb(null, true);
        }
    })
}


function deleteImage(fileName, cb) {
    var imagePath = Path.join(__dirname, '../../content', fileName);
    fs.unlink(imagePath, function(err) {
        if (err) {
            cb(err);
        } else {
            cb(null, true);
        }
    })
}

module.exports = {
    saveImage: saveImage,
    deleteImage: deleteImage
};
