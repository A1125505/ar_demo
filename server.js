const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static('public'));
app.use(fileUpload());
app.use(express.json());

const CONFIG_FILE = path.join(__dirname, 'markerConfig.json');
const ASSETS_DIR = path.join(__dirname, 'public/assets');

// 上傳表單
app.post('/upload', (req, res) => {
  const { markerId, markerType, contentType, videoUrl } = req.body;
  let patternFile = null, imageFile = null;

  if(req.files) {
    if(req.files.patternFile) {
      patternFile = 'assets/' + req.files.patternFile.name;
      req.files.patternFile.mv(path.join(__dirname, 'public/assets', req.files.patternFile.name));
    }
    if(req.files.imageFile) {
      imageFile = 'assets/' + req.files.imageFile.name;
      req.files.imageFile.mv(path.join(__dirname, 'public/assets', req.files.imageFile.name));
    }
  }

  // 更新 JSON
  const config = fs.existsSync(CONFIG_FILE) ? JSON.parse(fs.readFileSync(CONFIG_FILE)) : [];
  config.push({
    id: markerId,
    type: markerType,
    patternFile,
    contentType,
    videoUrl,
    imageFile
  });

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  res.json({ message: '新增成功!' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
