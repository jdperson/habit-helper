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

async function populateFriends(user) {
    try {
        const response = await fetch('api/friendRequest/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user.id)
        });

        // Response will return all friend requests linked to this user.
        //
        // Display all with status 'accepted' to the friends list
        //
        // Display all incoming pending requests to requests list
        // incoming request => other_id == user.id
    } catch (err) {
        console.log('Error retrieving friends', err);
    }
}

// ===============================================



// ================== PROCEDURE ==================

// ===============================================



// ================== LISTENERS ==================

loginBtn.addEventListener('submit', async (e) => {
    try {
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(email, password)
        });
        
        // Send user to the dashboard, generate their tracking graph,
        // and populate their friends list + friend requests

        // window.location.replace('dashboard-link')
        // generateGraph(response.user)
        populateFriends(response.user);
    } catch (err) {
        console.log('Error logging in: ', err);
    }
});

addFriendBtn.addEventListener('submit', async (e) => {
    try {
        const newFriend = await fetch(`/api/user/${e.target.closest('input').textContent}`);

        if (newFriend) {
            try {
                const response = await fetch('/api/friendRequest/addFriend', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user.id, newFriend.id)
                });
        
                if (response) { console.log('Friend request sent'); }
        
            } catch (err) {
                console.log('Error adding friend: ', err);
            }
        }
    } catch (err) {
        console.log(`Could not find user with name ${e.target.closest('input').textContent}`);
    }
    
});

// ===============================================