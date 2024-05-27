document.addEventListener('DOMContentLoaded', () => {
    const roomId = getRoomIdFromUrl();
    
    if (roomId) {
        getRooms().then(roomsData => {
            const roomData = roomsData[roomId];
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
