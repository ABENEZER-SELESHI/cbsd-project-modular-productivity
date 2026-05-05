const { Router } = require('express');
const ctrl = require('../controllers/noteController');

const router = Router();

router.get('/',     ctrl.index);
router.get('/:id',  ctrl.show);
router.post('/',    ctrl.create);
router.put('/:id',  ctrl.update);   // PUT replaces PATCH
router.delete('/:id', ctrl.destroy);

module.exports = router;
