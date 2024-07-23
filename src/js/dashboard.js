document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        const userNameContainer = document.getElementById('user-name');

        if (userNameContainer) {
            userNameContainer.innerHTML = `Hi ${currentUser.fname}`;
        }

        const profileImgContainer = document.getElementById('profile-pic');

        if (profileImgContainer) {
            const profileImg = document.createElement('img');
            profileImg.src = currentUser.imgUrl;
            profileImg.alt = 'Profile Picture';
            profileImg.style.cursor = 'pointer';
            profileImg.classList.add('ml-3');

            profileImg.addEventListener('click', () => {
                window.location.href = 'settings.html';
            });

            profileImgContainer.appendChild(profileImg);
        }
    } else {
        console.error('No currentUser found in localStorage');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('bet-list') ? loadRoomsInDashboard() : '';
});

function renderRoomList(roomData, roomId) {
    return `
        <li class="mb-3 mr-sm-3" style="cursor: pointer;" data-room-id="${roomId}" onclick="selectRoom('${roomId}')">
            <img src="${roomData.imgUrl}" alt="">
            <div class="bet-info">
                <span>${roomData.title}</span>
                <h4>${roomData.subtitle}</h4>
                <h3> May 15 </h3>
            </div>
        </li>
    `;
}

function renderRoomDetails(roomData) {
    document.getElementById('room-title').innerText = roomData.title;
    document.getElementById('room-subtitle').innerText = roomData.subtitle;
    document.getElementById('room-description').innerText = roomData.description;
    document.getElementById('team1').innerHTML = `
        <img src="${roomData.team1.imgUrl}" alt=""><br>
        <h3>${roomData.team1.name}</h3>
    `;
    document.getElementById('team2').innerHTML = `
        <img src="${roomData.team2.imgUrl}" alt=""><br>
        <h3>${roomData.team2.name}</h3>
    `;
    
    const participantList = document.getElementById('participant-list');
    participantList.innerHTML = '';

    // todo: necessário pegar participante por ID.
    // roomData.participants.forEach(participant => {
    //     participantList.innerHTML += `<li><img src="${participant.imgUrl}" alt=""></li>`;
    // });

    // document.getElementById('participants-info').innerText = `${roomData.participants.map(p => p.name).join(', ')} and more are in this room...`;
    document.getElementById('join-room-link').href = `room_details.html?roomId=${roomData.link}`;
}

async function loadRoomsInDashboard() {
    const roomsData = await getRooms(); //funcao em rooms.js    
    const roomList = document.querySelector('#bet-list ul');
    roomList.innerHTML = '';

    let count = 0;
    for (const [link, roomData] of Object.entries(roomsData)) {
        if (count >= 3) break;
        if (roomData.ownerId === currentUser.id || (roomData.participants && roomData.participants.some(p => p.id === currentUser.id))) {
            roomList.innerHTML += renderRoomList(roomData, link);
            count++;
        }
    }

    if (count > 0) {
        selectRoom(Object.keys(roomsData)[0]);
    }

    if (count == 0) {
        
    } else {
        
    }
}

function selectRoom(roomId) {
    const roomListItems = document.querySelectorAll('#bet-list li');
    roomListItems.forEach(li => {
        if (li.getAttribute('data-room-id') === roomId) {
            li.classList.add('selected');
        } else {
            li.classList.remove('selected');
        }
    });

    getRooms().then(roomsData => {
        const roomData = roomsData[roomId];
        renderRoomDetails(roomData);
    }).catch(error => {
        console.error('Error selecting room:', error);
    });
}
