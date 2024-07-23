
// Example Room Class
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

// Fetch and Render Rooms
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

async function getRoomById(roomId) {
    try {
        const response = await fetch(`https://cordial-rivalry-default-rtdb.firebaseio.com/rooms/${roomId}.json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Resposta de rede não foi ok');
        }

        const userData = await response.json();
        return userData;

    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        throw error;
    }
}

function renderRoom(roomData, roomId) {
    const roomCardHTML = `
        <div class="room-card col-xl-3 col-lg-4 col-sm-5 p-0 mr-2 mb-2" data-room-id="${roomData.link}">
            <div class="card-img-container">
                <img class="card-img-top" src="${roomData.imgUrl}" alt="Card image">
            </div>
            <div class="card-body">
                <h3 class="text-truncate">${roomData.title}</h3>
                <h4 class="text-truncate" style="color: wheat;">${roomData.subtitle}</h4>
                <div class="card-date">
                    <i class="far fa-calendar-alt mr-2"></i> ${'May 15'}
                </div>
            </div>
        </div>
    `;

    const roomsList = document.getElementById('roomsList');
    roomsList.insertAdjacentHTML('beforeend', roomCardHTML);

    const roomCard = roomsList.querySelector(`.room-card[data-room-id="${roomData.link}"]`);
    roomCard.addEventListener('click', () => {
        window.location.href = `room_details.html?roomId=${roomData.link}`;
    });
}



async function loadRooms() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.id) {
        console.error('No current user found in localStorage');
        return;
    }

    const roomsData = await getRooms();
    window.rooms = Object.entries(roomsData).map(([id, room]) => ({ id, ...room }));

    renderRooms(window.rooms);
}

function renderRooms(rooms) {
    document.getElementById('roomsList').innerHTML = '';
    rooms.forEach(room => renderRoom(room, room.id));
}

// Filter Rooms
function filterRooms(query) {
    const filteredRooms = window.rooms.filter(room => room.title.toLowerCase().includes(query.toLowerCase()));
    renderRooms(filteredRooms);
}

document.addEventListener('DOMContentLoaded', () => {
    loadRooms();

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        filterRooms(query);
    });
});
