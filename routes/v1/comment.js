const router = require('express').Router();
const commentRouter = require('../../controllers/commentController');
const auth = require('../../middlewares/auth');

router.post('/:insurance', auth.isAuthenticated, commentRouter.addComment)
router.put('/:comment', auth.isAuthenticated, commentRouter.editComment)
router.delete('/:comment', auth.isAuthenticated, commentRouter.deleteComment)
router.get('/:insurance', auth.isAuthenticated, commentRouter.getAllComment)

module.exports = router;
