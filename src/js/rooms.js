
class Room {
    constructor({ title, subtitle, description, imgUrl, team1, team2, link, ownerId }) {
        this.title = title;
        this.subtitle = subtitle;
        this.description = description;
        this.imgUrl = imgUrl;
        this.team1 = team1;
        this.team2 = team2;
        this.link = link;
        this.ownerId = ownerId;
        this.participants = [];
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const createRoomButton = document.querySelector('button[type="submit"]');
    if (createRoomButton) {
        createRoomButton.addEventListener('click', submitRoom);
    }
});

async function submitRoom(event) {
    event.preventDefault();

    const title = document.querySelector('input[placeholder="Title"]').value;
    const subtitle = document.querySelector('input[placeholder="Subtitle"]').value;
    const description = document.querySelector('input[placeholder="Description"]').value;
    const imgUrl = document.querySelector('input[placeholder="Event picture"]').value;
    const teamCards = document.querySelectorAll('.team-card');
    const teams = Array.from(teamCards).map(card => {
        return {
            name: card.querySelector('h3').innerText,
            imgUrl: card.querySelector('img').src
        };
    });

    if (teams.length < 2) {
        alert('You need to add at least two teams.');
        return;
    }

    const roomData = new Room({
        title,
        subtitle,
        description,
        imgUrl,
        team1: teams[0],
        team2: teams[1],
        link: "", // sha256. no caso, será o proprio id/key
        ownerId: JSON.parse(localStorage.getItem('currentUser')).id,
    });

    try {
        const key = await saveRoom(roomData);
        roomData.link = key;
        // Optionally update the room with the generated key
        await fastUpdateRoom(key, roomData);

        // Reset the form and notify the user
        // document.getElementById('signin-form').reset();
        alert('Room created successfully!');
    } catch (error) {
        console.error('Error creating room:', error);
        alert('There was a problem creating the room.');
    }
}

async function saveRoom(roomData) {
    try {
        const response = await fetch('https://cordial-rivalry-default-rtdb.firebaseio.com/rooms.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        return responseData.name; // Firebase returns the unique key for the new record
    } catch (error) {
        console.error('Error saving room:', error);
        throw error;
    }
}

async function fastUpdateRoom(key, roomData) {
    try {
        await fetch(`https://cordial-rivalry-default-rtdb.firebaseio.com/rooms/${key}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomData),
        });
    } catch (error) {
        console.error('Error updating room:', error);
    }
}

// ROOMS.HTML

async function getRooms() {
    try {
        const response = await fetch('https://cordial-rivalry-default-rtdb.firebaseio.com/rooms.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const roomsData = await response.json();
        return roomsData;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
}

function renderRoom(roomData, roomId) {
    const roomCard = `
        <div class="card col-xl-3 col-lg-4 col-sm-5 p-0 mr-2 mb-2" style="background-color: rgba(255, 255, 255, 0.1);">
            <img class="card-img-top mb-0 p-3 img-fluid" src="${roomData.imgUrl}" alt="Card image">
            <div class="card-body">
                <h3 class="text-truncate">${roomData.title}</h3>
                <h4 class="text-truncate" style="color: wheat;">${roomData.subtitle}</h4>
                <div style="color: grey;">
                    <i class="far fa-calendar-alt mr-2" style="color: grey;"></i> ${'May 15'}
                </div>
            </div>
        </div>
    `;
    document.getElementById('roomsList').insertAdjacentHTML('beforeend', roomCard);
}

async function loadRooms() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.id) {
        console.error('No current user found in localStorage');
        return;
    }

    const roomsData = await getRooms();

    for (const [roomId, roomData] of Object.entries(roomsData)) {
        if (roomData.ownerId === currentUser.id || (roomData.participants && roomData.participants.includes(currentUser.id))) {
            renderRoom(roomData, roomId);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('roomsList') ? loadRooms() : '';    
});