const { getDB } = require('../../config/db');

const createSwapRequest = async (req, res) => {
  try {
    const {
      requesterEmail,
      skillOffered,
      skillRequested,
      message
    } = req.body;

    if (!requesterEmail || !skillOffered || !skillRequested) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // IST Timestamp
    const utcNow = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(utcNow.getTime() + istOffset);

    const db = getDB();

    const newRequest = {
      requesterEmail,
      skillOffered,
      skillRequested,
      message: message || '',
      targetEmail: null,
      matchedWith: null,
      status: 'pending',
      timestamp: istNow
    };

    const result = await db.collection('swapRequests').insertOne(newRequest);

    res.status(201).json({
      message: 'Swap request created successfully',
      requestId: result.insertedId
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const assignSwapper = async (req, res) => {
  try {
    const { requesterEmail, targetEmail } = req.body;

    if (!requesterEmail || !targetEmail) {
      return res.status(400).json({ message: 'Missing requesterEmail or targetEmail' });
    }

    const db = getDB();

    // 1. Get requester (user-1)'s pending request
    const requestA = await db.collection('swapRequests').findOne({
      requesterEmail,
      status: 'pending'
    });

    if (!requestA) {
      return res.status(404).json({ message: 'Requester’s pending swap not found' });
    }

    // 2. Get a request from user-2 (targetEmail) whose skillOffered matches what user-1 wants
    const requestB = await db.collection('swapRequests').findOne({
      requesterEmail: targetEmail,
      skillOffered: requestA.skillRequested,
      status: 'pending'
    });

    if (!requestB) {
      return res.status(404).json({
        message: 'No matching offer found from target user'
      });
    }

    // 3. Update only user-1's request to assign target
    await db.collection('swapRequests').updateOne(
      { _id: requestA._id },
      {
        $set: {
          targetEmail,
          status: 'matched', // waiting for target to accept
          matchedWith: {
            email: targetEmail,
            skillOffered: requestB.skillOffered
          }
        }
      }
    );

    // 4. Check if a reverse match also exists (target user needs what requester offers)
    const reverseMatch = requestB.skillRequested === requestA.skillOffered;

    if (reverseMatch) {
      // Update user-2’s request as matched too
      await db.collection('swapRequests').updateOne(
        { _id: requestB._id },
        {
          $set: {
            targetEmail: requesterEmail,
            status: 'matched',
            matchedWith: {
              email: requesterEmail,
              skillOffered: requestA.skillOffered,
              skillRequested: requestA.skillRequested
            }
          }
        }
      );

      // ✅ Log full match only if reverse match exists
      console.log(`🎉 Full Swap match!
      - ${requesterEmail} (offers: ${requestA.skillOffered}, wants: ${requestA.skillRequested})
      - ${targetEmail} (offers: ${requestB.skillOffered}, wants: ${requestB.skillRequested})`);
    }

    // ✅ Respond regardless
    res.status(200).json({
      message: reverseMatch
        ? 'Both users fully matched successfully'
        : 'Target user’s skill matched and request assigned. Awaiting their confirmation.'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllSwapRequests = async (req, res) => {
  try {
    const db = getDB();

    // You can filter only pending ones if needed:
    const allRequests = await db.collection('swapRequests')
      .find({ status: 'pending' })  // remove this filter to get all
      .toArray();

    res.status(200).json({
      message: 'All swap requests fetched successfully',
      data: allRequests
    });

  } catch (err) {
    console.error('Error fetching all swap requests:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getIncomingSwaps = async (req, res) => {
  try {
    const userEmail = req.query.email;
    console.log('Fetching incoming swaps for:', userEmail);
    if (!userEmail) {
      return res.status(400).json({ message: 'Missing user email' });
    }

    const db = getDB();

    // Find all requests where this user is the assigned swapper
    const incoming = await db.collection('swapRequests')
      .find({ targetEmail: userEmail })
      .toArray();

    res.status(200).json({
      message: 'Incoming swap requests fetched successfully',
      data: incoming
    });

  } catch (err) {
    console.error('Error fetching incoming swaps:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
module.exports = {
  createSwapRequest,
  assignSwapper,
  getAllSwapRequests,
  getIncomingSwaps
};
