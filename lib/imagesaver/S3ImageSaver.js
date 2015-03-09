var amazonOpts = {
        provider: 'amazon',
        keyId: 'AKIAJVUFIPQ25IMXT2NA',
        key: 'ovT5T8AMpBcAcs491JlzjDx32fReMctK4O9O7UoG', // access key id
        region: 'us-west-2'
    },
    pkgcloud = require('pkgcloud'),
    streamifier = require('streamifier'),
    amazonClient = pkgcloud.storage.createClient(amazonOpts);

function saveImage(buffer, filename, cb) {
    var writeStream = amazonClient.upload({
        container: 'immodispo-listingimages',
        remote: filename
    }),
    readStream = streamifier.createReadStream(buffer);

    writeStream.on('error', function(err) {
        cb(err);

    });

    writeStream.on('success', function(file) {
        cb(null, file);
    });

    readStream.pipe(writeStream);
}

function deleteImage(fileName, cb) {
    amazonClient.removeFile('immodispo-listingimages', fileName, function(err, result) {
       if (err) {
           return cb(err);
       }

       cb(null, result);
    });
}

module.exports = {
    saveImage: saveImage,
    deleteImage: deleteImage
};