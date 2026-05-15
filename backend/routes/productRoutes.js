const express = require('express')
const {protect} = require('../middleware/authMiddleware')
const {admin} = require('../middleware/adminMiddleware')
const multer = require('multer');
const upload = multer({dest:'uploads/'});

const {getProducts, getProductById, createProduct, updateProduct, deleteProduct} = require('../controllers/productController')
const router = express.Router();

router.route('/').get(getProducts).post(protect,admin, upload.single('imageUrl'), createProduct);
router.route('/:id').get(getProductById).put(protect, admin, upload.single('imageUrl'), updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;