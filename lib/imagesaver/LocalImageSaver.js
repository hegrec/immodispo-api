var fs = require('fs');

function saveImage(buffer, fullFilePath, cb) {
    fs.writeFile(fullFilePath, buffer, function(err) {
        if (err) {
            cb(err);
        } else {
            cb(null, true);
        }
    })
}


function deleteImage(fullFilePath, cb) {
    fs.unlink(fullFilePath, function(err) {
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