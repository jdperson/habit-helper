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

                const friendsList = document.getElementById('friends-list');

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

                acceptBtn.setAttribute('type', 'submit');
                rejectBtn.setAttribute('type', 'submit');

                acceptBtn.setAttribute('class', 'accept-btn');
                rejectBtn.setAttribute('class', 'reject-btn');
                
                const requestsList = document.getElementById('friend-request-list');

                pendingRequest.append(requestUsername, acceptBtn, rejectBtn);
                requestsList.append(pendingRequest);
            }
        }
    } catch (err) {
        console.log('Error retrieving friends', err);
    }
};

async function getGPTResponse(prompt) {
    const gptURL = 'https://api.openai.com/v1/engines/davinci-codex/completions';

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

const addFriendHandler = async (e) => {
    try {
        const newFriend = await fetch(`/api/users/${e.target.closest('input').textContent}`);

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
};

const acceptRequestHandler = async (e) => {
    const requesterUsername = e.target.closest('h4').textContent;

    const userData = await fetch(`/api/users/${requesterUsername}`);

    const isAccepted = await fetch(`/api/friendRequest/accept/${userData.id}`);

    if (isAccepted) {
        e.target.closest('li').remove();

        const currUser = await fetch(`/api/users/${req.session.user_id}`);
        populateFriends(currUser);
    }
};

const rejectRequestHandler = async (e) => {
    const requesterUsername = e.target.closest('h4').textContent;

    const userData = await fetch(`/api/users/${requesterUsername}`);

    const isRejected = await fetch(`/api/friendRequest/reject/${userData.id}`);

    if (isRejected) { e.target.closest('li').remove(); }
};

const gptHandler = async (e) => {
    // append user message to chat log
    const newPrompt = document.createElement('li');
    const promptText = document.createElement('p');

    const gptInput = document.getElementById('gpt-prompt-input').value.trim();
    promptText = gptInput;

    const chatLog = document.getElementById('chat-log');
    newPrompt.append(promptText);
    chatLog.append(newPrompt);

    // append GPT response to chat log
    const newResponse = document.createElement('li');
    const responseText = document.createElement('p');

    responseText = await getGPTResponse(promptText);

    newResponse.append(responseText);
    chatLog.append(newResponse);
};

document
    .querySelector('add-friend-btn')
    .addEventListener('submit', addFriendHandler);

document
    .querySelector('.accept-btn')
    .addEventListener('submit', acceptRequestHandler);

document
    .querySelector('.reject-btn')
    .addEventListener('submit', rejectRequestHandler);

document
    .querySelector('#prompt-gpt-btn')
    .addEventListener('submit', gptHandler);