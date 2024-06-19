document.addEventListener('DOMContentLoaded', () => {
    const teamImgUrl = document.getElementById('teamImgUrl');

    if (teamImgUrl) {
        teamImgUrl.addEventListener('input', () => {
            const teamImg = document.getElementById('teamImg');
            teamImg.src = teamImgUrl.value; // Corrigido para 'value' em vez de 'nodeValue'
        });
    }

    const addTeamForm = document.getElementById('addTeamForm');

    if (addTeamForm) {
        addTeamForm.addEventListener('submit', event => {
            event.preventDefault();

            const teamName = document.getElementById('teamNameField').value;
            const teamImgUrlValue = document.getElementById('teamImgUrl').value;

            const teamCardsContainer = document.getElementById('teamCardsContainer');
            const currentTeamCount = teamCardsContainer.children.length;

            if (currentTeamCount >= 2) {
                showAlert('danger', 'Você só pode adicionar até 2 times.');
                return;
            }

            if (teamName && teamImgUrlValue) {
                const newTeamCard = document.createElement('div');
                newTeamCard.className = 'team-card col-lg-5 col-12 mb-3 d-flex align-items-center justify-content-between';
                newTeamCard.innerHTML = `
                    <div class="d-flex align-items-center">
                        <img id="team${currentTeamCount + 1}ImgUrl" src="${teamImgUrlValue}">
                        <h3 id="team${currentTeamCount + 1}Name">${teamName}</h3>
                    </div>                    
                    <button class="delete-btn p-1" style="display: none; background-color: transparent; border: none;">
                        <i style="font-size: 22px; margin-top: auto;" class="fas fa-trash-alt text-danger"></i>
                    </button>
                `;

                // Add hover effect to show delete button
                newTeamCard.addEventListener('mouseover', () => {
                    newTeamCard.querySelector('.delete-btn').style.display = 'block';
                });

                newTeamCard.addEventListener('mouseout', () => {
                    newTeamCard.querySelector('.delete-btn').style.display = 'none';
                });

                // Add click event to delete button
                newTeamCard.querySelector('.delete-btn').addEventListener('click', () => {
                    teamCardsContainer.removeChild(newTeamCard);
                });

                teamCardsContainer.appendChild(newTeamCard);

                // Reset form and close modal
                addTeamForm.reset();
                document.getElementById('teamImg').src = '';
                $('#addTeamModal').modal('hide');
            } else {
                // Optionally, you can show an error message here
                showAlert('secondary', 'Please provide both team name and image URL.');
            }
        });
    }
});



document.getElementById('createRoomButton').addEventListener('click', async (event) => {
    event.preventDefault(); // Evita o comportamento padrão do botão de submit

    // Coleta os dados do formulário
    const title = document.querySelector('input[placeholder="Title"]').value;
    const subtitle = document.querySelector('input[placeholder="Subtitle"]').value;
    const description = document.querySelector('input[placeholder="Description"]').value;
    const imgUrl = document.querySelector('input[placeholder="Event picture"]').value;

    // Coleta os dados dos times adicionados
    const team1Name = document.getElementById('team1Name') ? document.getElementById('team1Name').textContent : null;
    const team1ImgUrl = document.getElementById('team1ImgUrl') ? document.getElementById('team1ImgUrl').src : null;
    const team2Name = document.getElementById('team2Name') ? document.getElementById('team2Name').textContent : null;
    const team2ImgUrl = document.getElementById('team2ImgUrl') ? document.getElementById('team2ImgUrl').src : null;

    if (!team1Name || !team1ImgUrl || !team2Name || !team2ImgUrl) {
        alert('Você deve adicionar dois times.');
        return;
    }

    const team1 = { name: team1Name, imgUrl: team1ImgUrl };
    const team2 = { name: team2Name, imgUrl: team2ImgUrl };

    // Gera um link SHA-256 para a sala
    const link = await sha256(title + subtitle + description);

    // Obtém o ID do proprietário do local storage
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = JSON.parse(currentUserString);
    const ownerId = currentUser.id;

    // Cria uma nova instância da sala
    const newRoom = new Room({ title, subtitle, description, imgUrl, team1, team2, link, ownerId });

    try {
        // Salva a sala no Firebase
        const roomId = await saveRoom(newRoom);
        newRoom.link = roomId;
        fastUpdate(roomId, newRoom);
        console.log('Sala criada com sucesso! ID:', roomId);
    } catch (error) {
        console.error('Erro ao criar a sala:', error);
    }
});


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
            throw new Error('Resposta de rede não foi ok');
        }

        const responseData = await response.json();
        return responseData.name; // Retorna a chave gerada pelo Firebase

    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        throw error; // Re-lança o erro para ser capturado na função submitUser
    }
}


async function fastUpdate(key, roomData) {
    try {
        const response = await fetch(`https://cordial-rivalry-default-rtdb.firebaseio.com/rooms/${key}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomData),
        });

        if (!response.ok) {
            throw new Error('Resposta de rede não foi ok');
        }

        // return await response.json(); // Se precisar usar a resposta no futuro

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error; // Re-lança o erro para ser capturado na função submitUser
    }
}
