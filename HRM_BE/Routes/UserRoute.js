const express=require('express');
const router = express.Router();
const {register,loginUser}=require('../Controller/UserController')

router.post('/signup', register);
router.post('/login', loginUser);

module.exports = router;