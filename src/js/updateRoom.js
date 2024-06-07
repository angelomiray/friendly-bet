document.addEventListener('DOMContentLoaded', () => {
    // Obtenha o objeto roomData do localStorage
    const roomData = JSON.parse(localStorage.getItem('roomData'));
    // this.title = title;
    // this.subtitle = subtitle;
    // this.description = description;
    // this.imgUrl = imgUrl;
    // this.team1 = team1;
    // this.team2 = team2;
    // this.link = link;
    // this.ownerId = ownerId;
    // this.participants = [];
    if (roomData) {
        document.querySelector('.image-container img').src = roomData.imgUrl;
        document.querySelector('.info[data-field="title"] h4').innerText = roomData.title;
        document.querySelector('.info[data-field="subtitle"] h4').innerText = roomData.subtitle;
        document.querySelector('.info[data-field="description"] h4').innerText = roomData.description;
        document.querySelector('.info[data-field="teamOneName"] h4').innerText = roomData.team1.name;
        document.querySelector('.info[data-field="teamOneUrl"] h4').innerText = roomData.team1.imgUrl;
        document.querySelector('.info[data-field="teamTwoName"] h4').innerText = roomData.team2.name;
        document.querySelector('.info[data-field="teamTwoUrl"] h4').innerText = roomData.team2.imgUrl;
    }

    document.querySelectorAll('[data-toggle="modal"]').forEach(button => {
        button.addEventListener('click', () => {
            const field = button.getAttribute('data-field');
            document.querySelector('#editModalLabel').innerText = `Edit ${field.charAt(0).toUpperCase() + field.slice(1)}`;
            document.querySelector('#fieldValue').value = roomData[field];
            document.querySelector('#editForm').setAttribute('data-field', field);
        });
    });

    // Evento de submissão do formulário do modal
    document.querySelector('#editForm').addEventListener('submit', event => {
        event.preventDefault();
        const field = event.target.getAttribute('data-field');
        const newValue = document.querySelector('#fieldValue').value;

        roomData[field] = newValue;

        localStorage.setItem('roomData', JSON.stringify(roomData));

        document.querySelector(`.info[data-field="${field}"] h4`).innerText = newValue;

        $('#editModal').modal('hide');
    });


    document.querySelector('#saveChanges').addEventListener('click', async () => {
        try {
            const roomId = roomData.link;
            await updateRoom(roomId, roomData);
            showAlert('success', 'Changes saved successfully!');
        } catch (error) {
            showAlert('danger', 'Failed to save changes.');
        }
    });

});


async function updateRoom(roomId, roomData) {    

    try {
        const response = await fetch(`https://cordial-rivalry-default-rtdb.firebaseio.com/rooms/${roomId}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();

        localStorage.setItem('roomData', JSON.stringify(roomData));

        return responseData;

    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}