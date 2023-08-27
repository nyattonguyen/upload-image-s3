const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cors = require("cors");
const fs = require("fs");
const util = require("util");

const unlinkFile = util.promisify(fs.unlink);
const app = express();

const { uploadFile, getFile } = require("./s3");
app.use(cors());
app.post("/images", upload.single("image"), async (req, res) => {
  const file = req.file;
  console.log(file);
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  console.log(result);
  res.send("OK");
});

app.get("/images/:key", async (req, res) => {
  const key = req.params.key;
  const result = getFile(key);
  result.pipe(res);
});

app.listen(8080, () => console.log("Server running on port 8080"));
