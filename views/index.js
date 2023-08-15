// ================== IMPORTS ==================

const User = require('../../models/User');
const { Configuration, OpenAIApi } = require('openai');

// =============================================



// ================== PAGE ELEMENTS ==================

const loginBtn = document.getElementById('login-btn');
const addFriendBtn = document.getElementsByClassName('add-friend-btn');
const friendsList = document.getElementById('friends-list');
const requestsList = document.getElementById('friend-request-list');
const gptInput = document.getElementById('gpt-prompt-input').value.trim();
const promptGPTbtn = document.getElementById('prompt-gpt-btn');
const chatLog = document.getElementById('chat-log');

// ===================================================



// ================== GLOBAL VARS ==================

const gptURL = 'https://api.openai.com/v1/engines/davinci-codex/completions';

// =================================================



// ================== FUNC DEFS ==================

async function populateFriends(user) {
    try {
        const response = await fetch('api/friendRequest/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user.id)
        });

        for (i = 0; i < response.length; i++) {

            // Display all with status 'accepted' to the friends list
            if (response[i].requestStatus === 'accepted') {
                const friend = document.createElement('li');
                const friendName = document.createElement('h4');
                const friendStatus = document.createElement('p');

                // Determine which user sent the request, 
                // then get the friend's username

                // if this user sent the request
                if (response[i].user_id === user.id) {
                    const userData = await fetch(`/api/users/${response[i].other_id}`);
                    friendName.textContent = userData.username;
                    friendStatus.textContent = userData.status;

                    friend.append(friendName, friendStatus);
                    friendsList.append(friend);
                } 
                // if the other user sent the request 
                else {
                    const userData = await fetch(`/api/users/${response[i].user_id}`);
                    friendName.textContent = userData.username;
                    friendStatus.textContent = userData.status;

                    friend.append(friendName, friendStatus);
                    friendsList.append(friend);
                }
            }

            // Display all incoming pending requests to requests list
            // check for a pending response where another user has sent the request to this user
            if ( (response[i].requestStatus === 'pending') && (response[i].other_id === user.id) ) {
                const pendingRequest = document.createElement('li');
                const requestUsername = document.createElement('h4');
                const acceptBtn = document.createElement('button');
                const rejectBtn = document.createElement('button');

                const userData = await fetch(`/api/users/${response[i].user_id}`);
                requestUsername.textContent = userData.username;

                acceptBtn.textContent = '+';
                rejectBtn.textContent = '-';

                pendingRequest.append(requestUsername, acceptBtn, rejectBtn);
                requestsList.append(pendingRequest);
            }
        }
    } catch (err) {
        console.log('Error retrieving friends', err);
    }
};

async function getGPTResponse(prompt) {
    try {
        const response = await fetch(gptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 250
            })
        });

        const responseData = await response.json();
        return responseData.choices[0].text;
    } catch (err) {
        console.error(err);
        return 'Error fetching chat response.';
    }
};

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

promptGPTbtn.addEventListener('submit', async (e) => {
    // append user message to chat log
    const newPrompt = document.createElement('li');
    const promptText = document.createElement('p');

    promptText = gptInput;

    newPrompt.append(promptText);
    chatLog.append(newPrompt);

    // append GPT response to chat log
    const newResponse = document.createElement('li');
    const responseText = document.createElement('p');

    responseText = await getGPTResponse(promptText);

    newResponse.append(responseText);
    chatLog.append(newResponse);
});

// ===============================================