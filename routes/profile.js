var express = require('express');
var router = express.Router();


const path = require('path');

const sizeMax = 2 * 1024 * 1024;


const uploadDirectory = path.join(__dirname, '../public/uploads');


const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirectory)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const fileExtension = path.extname(file.originalname); // Obtener la extensión del archivo original
      cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension)
    }
  })
  

  //image/png mimetype-a duten fitxategiak bakarrik onartuko dira. (hau da, PNG formatukoak bakarrik onartuko dira)
  const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.png', '.jpg']; // Mota onartuak
    const isValidExtension = allowedExtensions.includes(path.extname(file.originalname).toLowerCase()); // Fitxategiaren mota onartuak diren edo ez begiratu
    if (isValidExtension) { // Fitxategiaren mota onartuak badira
      cb(null, true);
    } else {
      cb(new Error('Extensioa ez da onartzen. Soilik .png edo .jpg formatuko fitxategiak onartzen dira.'), false);
    }
  };

  const limits = {
    fileSize: sizeMax,
  };

  const upload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
});


router.get('/', function(req, res, next) {
    res.redirect('form.html');
});

router.post('/', upload.single('avatar'), function (req, res, next) {
    console.log(req.file);
    const fileLink = `<a href="http://localhost:3000/uploads/${req.file.filename}">http://localhost:3000/uploads/${req.file.filename}</a>`;
    res.send(`Zure izena: ${req.body.username}. Fitxategia: ${fileLink}`);
})


module.exports = router;