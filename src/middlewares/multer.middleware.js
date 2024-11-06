
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination:function(req , file , cb){
        const location = path.join(__dirname, 'public/temp');
        return cb(null , location);
    },
    filename:function(req , file , cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname + '-' + uniqueSuffix)
    
    }
})
const uploadFile = multer({storage});
 module.exports = {uploadFile};