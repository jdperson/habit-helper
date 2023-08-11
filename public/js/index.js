// ================== IMPORTS ==================

const User = require('../../models/User');

// =============================================



// ================== PAGE ELEMENTS ==================

const loginBtn = document.getElementById('login-btn');
const addFriendBtn = document.getElementsByClassName('add-friend-btn');

// ===================================================



// ================== GLOBAL VARS ==================

// =================================================



// ================== FUNC DEFS ==================

// ===============================================



// ================== PROCEDURE ==================

// ===============================================



// ================== LISTENERS ==================

const user = loginBtn.addEventListener('submit', async (e) => {
    try {
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(email, password)
        });
        return response;
    } catch (err) {
        console.log('Error logging in: ', err);
    }
});

addFriendBtn.addEventListener('submit', async (e) => {
    const newFriend = await User.findOne({ 
        where: { username: e.target.closest('a').textContent }
    });
    
    if (newFriend) {
        try {
            const response = await fetch('/api/user/addFriend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user.id, newFriend.id)
            });

            if (response) { console.log('Friend request sent'); }

        } catch (err) {
            console.log('Error adding friend: ', err);
        }
    };
});

// ===============================================