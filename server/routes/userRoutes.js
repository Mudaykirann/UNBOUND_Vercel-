const { Router } = require('express')
const { registeredUser, loginUser, getAuthors, getUser, EditUser, changeAvatar } = require('../controllers/userControllers')
const authMiddleware = require('../middlewares/authMiddleware')



const router = Router()

router.post('/register', registeredUser)
router.post('/login', loginUser)
router.get('/', getAuthors)
router.get('/:id', getUser)
router.post('/change-avatar', authMiddleware, changeAvatar)
router.patch('/edit-user', authMiddleware, EditUser)


module.exports = router;