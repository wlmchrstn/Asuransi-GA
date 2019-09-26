const router = require('express').Router();
const commentRouter = require('../../controllers/commentController');

router.post('/:insurance', commentRouter.addComment)
router.put('/:comment', commentRouter.editComment)
router.delete('/:comment', commentRouter.deleteComment)
router.get('/:insurance', commentRouter.getAllComment)

module.exports = router;
