const multer = require('multer');
const path = require('path');

// Où stocker les fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // dossier uploads à la racine du backend
  },
  filename: function (req, file, cb) {
    // Ex : produit-1632323232.jpg
    cb(null, 'produit-' + Date.now() + path.extname(file.originalname));
  }
});

// Filtrer uniquement les images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
