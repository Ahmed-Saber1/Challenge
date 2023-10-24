const router = require('express').Router();
const { deleteItem, getAllItems, getItem, postItem, patchItem } = require('../../controllers/api');
const { authRequest, validate } = require('../../middlewares/authMiddleware')
const { sendDto, prepareBody } = require('../../middlewares/bodyTransform')

router.get('/:collection', authRequest, sendDto, getAllItems);

router.get('/:collection/:id', authRequest, sendDto, getItem);

router.post('/:collection', authRequest, validate, prepareBody, sendDto, postItem);

router.patch('/:collection/:id', authRequest, validate, prepareBody, sendDto, patchItem);

router.delete('/:collection/:id', authRequest, sendDto, deleteItem);

module.exports = router;
