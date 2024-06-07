document.addEventListener('DOMContentLoaded', () => {
    const roomId = getRoomIdFromUrl();

    if (roomId) {
        getRooms().then(roomsData => {
            const roomData = roomsData[roomId];
            localStorage.setItem('roomData', JSON.stringify(roomData));
            if (roomData) {
                renderSpecificRoomDetails(roomData);
            } else {
                console.error('Room data not found.');
            }
        }).catch(error => {
            console.error('Error loading room data:', error);
        });
    } else {
        console.error('No selected room ID found in local storage.');
    }

    const copyRoomCodeLink = document.getElementById('copyRoomCodeLink');

    copyRoomCodeLink.addEventListener('click', function (event) {
        event.preventDefault();
        const roomId = getRoomIdFromUrl();
        if (roomId) {
            navigator.clipboard.writeText(roomId);
            showAlert('info', 'Room code copied to clipboard!');
        } else {
            showAlert('danger', 'Room code not found.');
        }
    });
});

function renderSpecificRoomDetails(roomData) {
    document.querySelector('#content h2').innerText = `${roomData.team1.name} vs ${roomData.team2.name}`;
    document.querySelector('#content h4').innerText = roomData.subtitle;
    document.querySelector('.sb-line .choice-img:first-child img').src = roomData.team1.imgUrl;
    document.querySelector('.sb-line .choice-img:first-child h3').innerText = roomData.team1.name;
    document.querySelector('.sb-line .choice-img:last-child img').src = roomData.team2.imgUrl;
    document.querySelector('.sb-line .choice-img:last-child h3').innerText = roomData.team2.name;
    document.querySelector('#content p').innerText = roomData.description;
}


function getRoomIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('roomId');
}


function showInputs() {
    const betType = document.getElementById('betType').value;
    const inputFields = document.getElementById('inputFields');
    inputFields.innerHTML = ''; // Clear previous inputs

    let numberOfInputs = 0;
    if (betType === 'straight') {
        numberOfInputs = 2;
    } else if (betType === 'multiple' || betType === 'system') {
        numberOfInputs = 5;
    }

    for (let i = 0; i < numberOfInputs; i++) {
        const div = document.createElement('div');
        div.className = 'input-container col-12';
        div.innerHTML = `<i class="fas fa-edit"></i><input type="text" class="form-control text-light" placeholder="Option ${i + 1}">`;
        inputFields.appendChild(div);
    }
}