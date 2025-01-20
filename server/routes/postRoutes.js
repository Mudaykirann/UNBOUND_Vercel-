const { Router } = require('express')
const { createPost, getPosts, getSinglePost, getCatPosts, getUserPosts, editPost, deletePost } = require('../controllers/postControllers')
const authMiddleware = require('../middlewares/authMiddleware')

const router = Router()

router.post('/', authMiddleware, createPost)
router.get('/', getPosts)
router.get('/:id', getSinglePost)
router.get('/categories/:category', getCatPosts)
router.get('/users/:id', getUserPosts)
router.patch('/:id', authMiddleware, editPost)
router.delete('/:id', authMiddleware, deletePost)


module.exports = router