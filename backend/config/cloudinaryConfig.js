import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';


cloudinary.config({
    cloud_name: 'dgn6teusy',
    api_key: '842422141726933',
    api_secret: 'r8EdpLE33qGtbk46UToCKmVwLL8'
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'produits', 
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
});

const parser = multer({ storage });

export { cloudinary, parser };
