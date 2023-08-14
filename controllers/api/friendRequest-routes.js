const router = require('express').Router();
const FriendRequest = require('../../models/FriendRequest');

router.get('/', async (req, res) => {
    try {
        const friendRequests = await FriendRequest.findAll({
            where: { user_id: req.body.id }
        });

        return res.status(200).json(friendRequests);
    } catch (err) {
        console.error('Error retrieving friend requests:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/addFriend', async (req, res) => {
    const { user_id, other_id } = req.body;
  
    try {
      const friendRequest = await FriendRequest.create([
        user_id,
        other_id,
        'pending'
      ]);
  
      return res.status(200).json(friendRequest);
    } catch (err) {
      console.error('Error sending friend request:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/accept/:id', async (req, res) => {
    const target = req.params.id;

    try {
        const result = await FriendRequest.update(
            { requestStatus: 'accepted' },
            { where:       {id: target} }
        )
        
        if (result[0] === 0) {
            return res.status(404).json({ message: 'Friend request not found' });
        }
        res.status(200).json({ message: 'Friend request accepted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/reject/:id', async (req, res) => {
    const target = req.params.id;

    try {
        const result = await FriendRequest.update(
            { requestStatus: 'rejected' },
            { where:       {id: target} }
        )
        
        if (result[0] === 0) {
            return res.status(404).json({ message: 'Friend request not found' });
        }
        res.status(200).json({ message: 'Friend request rejected' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;