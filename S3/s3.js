require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

async function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Body: fileStream,
    Bucket: bucketName,
    Key: file.filename,
  };

  try {
    const result = await s3.upload(uploadParams).promise();
    console.log("File uploaded successfully:", result.Location);
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
function getFile(key) {
  const downloadParams = {
    Bucket: bucketName,
    Key: key,
  };
  return s3.getObject(downloadParams).createReadStream();
}
module.exports = { uploadFile, getFile };
