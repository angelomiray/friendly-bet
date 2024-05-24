document.addEventListener('DOMContentLoaded', () => {
    // Existing event listeners...

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
        ownerId: "", // currentuser
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

class Room {
    constructor({title, subtitle, description, imgUrl, team1, team2, link, ownerId}) {
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
