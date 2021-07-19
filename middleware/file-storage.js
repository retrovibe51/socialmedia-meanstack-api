const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({    // defines where multer should store files which it detectes in incoming request
    destination: (req, file, callback) => {    // destination is a function which is executed whenever multer tries to save a file it detected. callback() is a callback function
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = null;
        if(!isValid) {
            error = new Error("Invalid mime type");
        }
        callback(error, "imagesForStorage");
    },
    filename: (req, file, callback) => {    // for defining how to store the file (name, extension)
        const name = file.originalname.toString().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});

module.exports = multer({ storage: storage }).single("image");