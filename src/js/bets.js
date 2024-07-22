class Bet {
    constructor({ title, owner, roomId, type, imgUrl, option1, option2, option3, option4, option5 }) {
        this.title = title;
        this.owner = owner;
        this.roomId = roomId;
        this.type = type;
        this.status = true; // OPEN
        this.imgUrl = imgUrl;
        this.option1 = option1;
        this.option2 = option2;
        this.option3 = option3;
        this.option4 = option4;
        this.option5 = option5;
        //lembrar da entidade APOSTA, com o apostador, valor, etc
    }
}


document.getElementById('betForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const title = document.getElementById('betTitle').value;
    const type = document.getElementById('betType').value;
    const options = Array.from(document.querySelectorAll('#inputFields input')).map(input => input.value);
    const roomId = getRoomIdFromUrl(); // Obtém o roomId da URL
    const storedUser = localStorage.getItem('currentUser');
    const owner = storedUser ? JSON.parse(storedUser).id : null;

    // Obter a sala de forma assíncrona
    try {
        const room = await getRoomById(roomId);
        const imgUrl = room ? room.imgUrl : null;

        const newBet = new Bet({
            title,
            owner,
            roomId,
            type,
            imgUrl,
            option1: options[0] || "",
            option2: options[1] || "",
            option3: options[2] || "",
            option4: options[3] || "",
            option5: options[4] || ""
        });

        await saveBet(newBet);

        // Fechar o modal após a criação da aposta
        $('#newBetModal').modal('hide');

        // Redirecionar para a página com o roomId
        window.location.href = `room_details.html?roomId=${roomId}`;
    } catch (error) {
        console.error('Erro ao obter a sala:', error);
        // Lidar com o erro de acordo com a necessidade
    }
});


// function getRoomIdFromUrl() {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get('roomId');
// }


async function saveBet(betData) {
    try {
        const response = await fetch('https://cordial-rivalry-default-rtdb.firebaseio.com/bets.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(betData),
        });

        if (!response.ok) {
            throw new Error('Resposta de rede não foi ok');
        }

        const responseData = await response.json();
        return responseData.name; // Retorna a chave gerada pelo Firebase

    } catch (error) {
        console.error('Erro ao salvar aposta:', error);
        throw error; // Re-lança o erro para ser capturado na função submitUser
    }
}


// Fetch and Render BETS
async function getBets() {
    try {
        const response = await fetch('https://cordial-rivalry-default-rtdb.firebaseio.com/bets.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const betsData = await response.json();
        return betsData;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
}

function renderBet(betData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isOwner = currentUser && currentUser.id === betData.owner;

    const betHTML = `
        <div class="card mb-2">
            <div class="card-header d-flex justify-content-between align-items-center flex-wrap p-0 p-lg-4">
                <div class="d-flex align-items-center mb-lg-0 mb-4 col-lg-5 col-sm-12">
                    <img class="img-fluid" src="${betData.imgUrl}" alt="Room picture">
                    <div class="ml-3">
                        <h4>${betData.title}</h4>
                        <h5 style="color: grey;">Created May 15</h5>
                    </div>
                </div>
                <div class="bet-info col-lg-7 col-sm-12 d-flex flex-row align-items-center">
                    <h5 class="col-lg-3">${betData.type.toUpperCase()}</h5>
                    <h5 class="col-lg-3" style="color: greenyellow">${betData.status ? 'OPEN' : 'CLOSED'}</h5>
                    <a class="card-link col-lg-1" data-toggle="modal" href="#betModal-${betData.id}">
                        <i class="fas fa-dollar-sign"></i>
                    </a>
                    ${isOwner ? `
                        <div class="dropdown ml-3" style="background-color: none;">
                            <button class="btn" type="button" id="dropdownMenuButton-${betData.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton-${betData.id}">
                                <a class="dropdown-item" href="#" onclick="updateBet('${betData.id}')">Atualizar</a>
                                <a class="dropdown-item" href="#" onclick="deleteBet('${betData.id}')">Deletar</a>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    const betsList = document.getElementById('betsList');
    betsList.insertAdjacentHTML('beforeend', betHTML);

    // Adiciona o modal dinâmico
    createBetModal(betData);
}


function createBetModal(betData) {
    const options = [betData.option1, betData.option2, betData.option3, betData.option4, betData.option5].filter(option => option);

    const optionsHTML = options.map(option => `
        <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" value="${option}" id="${option}">
            <label class="form-check-label text-light" for="${option}">
                ${option}
            </label>
        </div>
    `).join('');

    const modalHTML = `
        <div class="modal fade" id="betModal-${betData.id}" tabindex="-1" role="dialog" aria-labelledby="betModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content custom-modal-content">
                    <div class="modal-header custom-modal-header">
                        <h5 class="modal-title" id="betModalLabel">Place Your Bet</h5>
                        <button type="button" class="close custom-close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body col-12">
                        <div class="col-12">
                            ${optionsHTML}
                            <div class="form-row align-items-center mt-3 col-12">
                                <div class="col-lg-9 col-sm-12">
                                    <input type="text" class="form-control mb-2" id="amount-${betData.id}" placeholder="Amount">
                                </div>
                                <div class="col-lg-3 col-sm-12">
                                    <button class="btn btn-success mb-2 col-12">Bet</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}


async function loadBets() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.id) {
        console.error('No current user found in localStorage');
        return;
    }

    const betsData = await getBets();
    console.log(betsData);
    window.bets = Object.entries(betsData).map(([id, bet]) => ({ id, ...bet }));

    renderBets(window.bets);
}

function renderBets(bets) {
    const betsList = document.getElementById('betsList');
    betsList.innerHTML = '';
    bets.forEach(bet => renderBet(bet));
}


async function deleteBet(betId) {
    if (confirm('Tem certeza de que deseja deletar esta aposta?')) {
        try {
            const response = await fetch(`https://cordial-rivalry-default-rtdb.firebaseio.com/bets/${betId}.json`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            showAlert('sucess', 'Aposta deletada com sucesso');
            window.location.reload();
        } catch (error) {
            console.error('Erro ao deletar aposta:', error);
        }
    }
}

// Função para abrir o modal de atualização com os dados da aposta
function updateBet(betId) {
    // Encontre a aposta com base no betId
    const bet = window.bets.find(b => b.id === betId);
    
    if (!bet) {
        console.error('Bet not found:', betId);
        return;
    }

    // Preenche os campos do formulário com os dados da aposta
    document.getElementById('betTitle').value = bet.title;
    document.getElementById('betType').value = bet.type;
    const options = [bet.option1, bet.option2, bet.option3, bet.option4, bet.option5];

    // Limpe os campos de opções existentes
    const inputFields = document.getElementById('inputFields');
    inputFields.innerHTML = '';

    options.forEach((option, index) => {
        if (option) {
            const optionHTML = `
                <div class="input-container col-12">
                    <i class="fas fa-check"></i>
                    <input type="text" class="form-control" id="option${index + 1}" value="${option}" placeholder="Option ${index + 1}">
                </div>
            `;
            inputFields.insertAdjacentHTML('beforeend', optionHTML);
        }
    });

    // Atualize o ID do formulário para incluir o betId
    document.getElementById('betForm').setAttribute('data-bet-id', betId);

    // Abra o modal
    $('#newBetModal').modal('show');
}

// Função para atualizar a aposta
document.getElementById('betForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const betId = this.getAttribute('data-bet-id');
    const title = document.getElementById('betTitle').value;
    const type = document.getElementById('betType').value;
    const options = Array.from(document.querySelectorAll('#inputFields input')).map(input => input.value);

    const updatedBet = {
        title,
        type,
        option1: options[0] || "",
        option2: options[1] || "",
        option3: options[2] || "",
        option4: options[3] || "",
        option5: options[4] || ""
    };

    try {
        await updateBetInDatabase(betId, updatedBet);

        // Fechar o modal após a atualização da aposta
        $('#newBetModal').modal('hide');

        // Recarregar a lista de apostas
        loadBets();
    } catch (error) {
        console.error('Erro ao atualizar aposta:', error);
    }
});


async function updateBetInDatabase(betId, updatedBet) {
    try {
        const response = await fetch(`https://cordial-rivalry-default-rtdb.firebaseio.com/bets/${betId}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBet),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar aposta:', error);
        throw error; // Re-lança o erro para ser capturado na função submitUser
    }
}



document.addEventListener('DOMContentLoaded', async () => {

    loadBets();
});