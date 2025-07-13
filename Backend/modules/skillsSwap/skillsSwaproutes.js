const express = require('express');
const {   createSwapRequest,assignSwapper,getAllSwapRequests,getIncomingSwaps} = require('./skillsSwapcontrollers');

const router = express.Router();

router.post('/swap', createSwapRequest);
router.post('/swap/assign', assignSwapper);
router.get('/swap/all', getAllSwapRequests);
 router.get('/swap/incoming', getIncomingSwaps);
module.exports = router;