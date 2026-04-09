var express = require('express');
var router = express.Router();
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

//----- Create R2 client -----
const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.R2_BUCKETNAME;



//========================================
//          getting files
//========================================

// Usage: GET /r2/get/file?key=someFileName
// Returns a signed URL valid for 1 hour
router.get('/get/file', async (req, res) => {
  try {
    //error handling
    if (!req.query.key) {
      return res.status(400).json({ error: "key parameter is required" });
    }

    //create command
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: req.query.key,
    });
    
    //make request
    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
    res.status(200).json({ url: signedUrl });

  } catch (err) {
    console.error(`Something went wrong trying to get file: ${err}\n`);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Usage: GET /r2/list/files?prefix=someFolder/
// prefix is optional — omit to list all files
router.get('/list/files', async (req, res) => {
  try {
    
    //create command
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: req.query.prefix || '',
    });

    //make request
    const Result = await r2.send(command);
    const files = (Result.Contents || []).map(f => ({
      key: f.Key,
      size: f.Size,
      lastModified: f.LastModified,
    }));

    res.status(200).json({ files });

  } catch (err) {
    console.error(`Something went wrong trying to list files: ${err}\n`);
    res.status(500).json({ error: "Internal server error" });
  }
});


//======================================
//         Upload requests
//======================================

// Usage: POST /r2/upload/file
// Body: multipart/form-data with field "file", optional field "folder"
router.post('/upload/file', upload.single('file'), async (req, res) => {
  try {

    //error handling
    if (!req.file) {
      return res.status(400).json({ error: "file is required" });
    }

    //create command
    const folder = req.body.folder ? `${req.body.folder}/` : '';
    const key = `${folder}${Date.now()}-${req.file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    //make request
    await r2.send(command);
    res.status(201).json({ message: "File uploaded successfully", key });

  } catch (err) {
    console.error(`Something went wrong trying to upload file: ${err}\n`);
    res.status(500).json({ error: "Internal server error" });
  }
});



//======================================
//        Delete requests
//======================================


// Usage: DELETE /r2/delete/file?key=someFileName.png
router.delete('/delete/file', async (req, res) => {
  try {
    //error handling
    if (!req.query.key) {
      return res.status(400).json({ error: "key parameter is required" });
    }

    //create command
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: req.query.key,
    });

    //make request
    await r2.send(command);
    res.status(200).json({ message: "File deleted successfully" });

  } catch (err) {
    console.error(`Something went wrong trying to delete file: ${err}\n`);
    res.status(500).json({ error: "Internal server error" });
  }
});




module.exports = router;
