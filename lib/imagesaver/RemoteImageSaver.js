const mime = require('mime-types');
const storage = require('@google-cloud/storage');
const streamifier = require('streamifier');

const gcs = storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GCS_KEYFILE
});

const bucket = gcs.bucket('immodispo-images');

function saveImage(buffer, filename) {
  const contentType = mime.lookup(filename);
  const file = bucket.file(filename);
  const readStream = streamifier.createReadStream(buffer);
  const writeStream = file.createWriteStream({
    gzip: true,
    metadata: { contentType },
    resumable: false,
    public: true
  });

  return new Promise((resolve, reject) => {
    readStream.pipe(writeStream)
      .on('error', (err) => reject(err))
      .on('finish', () => resolve())
  });
}

function deleteImage(fileName) {
  return bucket
    .file(fileName)
    .delete();
}

module.exports = {
    saveImage: saveImage,
    deleteImage: deleteImage
};
