// SCRIPTS DE CRUD DE USUÁRIO

class User {
    constructor({ id, username, fname, surname, email, pw, imgUrl }) {
        this.id = id;
        this.username = username;   
        this.fname = fname;
        this.surname = surname;
        this.email = email;
        this.pw = pw;
        this.imgUrl = imgUrl;
        this.rooms = [];
        this.bets = []; 
    }

    addRoom(room) {
        this.rooms.push(room);
    }

    addBet(bet) {
        this.bets.push(bet);
    }
}


let currentUser = new User({
    id: 'None',
    fname: 'None',
    surname: 'None',
    username: 'None',
    email: 'None',
    imgUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    pw: 'None',
});


let createUserForm;
let loginForm;


document.addEventListener('DOMContentLoaded', function () {

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }

    //caso seja a tela de cadastro, ele adiciona o evento ao form
    createUserForm = document.getElementById('signup-form');
    if (createUserForm) {
        createUserForm.addEventListener('submit', submitUser);
    }

    //caso seja a tela de login, ele adiciona o evento ao form
    loginForm = document.getElementById('signin-form');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }

    const loginComponent = document.getElementById('login');

    if (loginComponent && currentUser.id !== 'None') {

        loginComponent.innerHTML = '';
        loginComponent.className = 'ml-auto d-flex flex-column align-items-center'

        const userInfo = document.createElement('span');
        userInfo.textContent = `Welcome, ${currentUser.fname} ${currentUser.surname}`;
        userInfo.className = 'text-light mr-3'

        const dashboardLink = document.createElement('a');
        dashboardLink.href = 'bets_dashboard.html';
        dashboardLink.textContent = 'Go to your Bets Dashboard';

        // Adiciona os elementos ao loginComponent
        loginComponent.appendChild(userInfo);
        loginComponent.appendChild(document.createTextNode(' ')); // Espaço entre o nome e o link
        loginComponent.appendChild(dashboardLink);
    }
});

/* USER CREATION - SIGN UP */

async function submitUser(event) {
    event.preventDefault();

    const formData = new FormData(createUserForm);
    const password = formData.get('pw');
    const confirmPassword = formData.get('confirm-pw');

    if (password !== confirmPassword) {
        console.error('As senhas não coincidem.');
        showAlert('danger', 'As senhas fornecidas não coincidem.');
        return;
    }

    //todo: verificar se não há um email igual já cadastrado
    const emailInUse = await getUserByEmail(formData.get('email'));
    if (emailInUse) {
        showAlert('danger', 'Email fornecido já está em uso.');
        return;
    }

    const userData = new User({
        username: formData.get('username'),
        fname: formData.get('fname'),
        surname: formData.get('surname'),
        email: formData.get('email'),
        pw: await sha256(formData.get('pw')),
        imgUrl: formData.get('imgUrl')
    });

    try {
        const key = await saveUser(userData);
        // Adiciona a chave ao objeto userData
        userData.id = key;
        // Atualiza o usuário com a chave como parte dos dados
        await fastUpdateUser(key, userData);

        createUserForm.reset();
        showAlert('success', 'Perfil criado com sucesso!');
    } catch (error) {
        showAlert('danger', 'Houve um problema ao criar o seu perfil.');
    }
}
// Função para adicionar usuário na API
async function saveUser(userData) {
    try {
        const response = await fetch('https://cordial-rivalry-default-rtdb.firebaseio.com/users.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
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

// Função para atualizar o usuário com a chave gerada
async function fastUpdateUser(key, userData) {
    try {
        const response = await fetch(`https://cordial-rivalry-default-rtdb.firebaseio.com/users/${key}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
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


async function getUserById(userId) {
    try {
        const response = await fetch(`https://cordial-rivalry-default-rtdb.firebaseio.com/users/${userId}.json`, {
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

async function getUserByEmail(email) {
    try {
        const response = await fetch('https://cordial-rivalry-default-rtdb.firebaseio.com/users.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Resposta de rede não foi ok');
        }

        const usersData = await response.json();

        if (!usersData) {
            return false;
        }

        const userId = Object.keys(usersData).find(key => {
            return usersData[key].email === email;
        });

        if (!userId) {
            return false;
        }

        return usersData[userId];

    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        throw error;
    }
}


/* USER LOGIN - SIGN IN */

async function login(event) {
    event.preventDefault();

    const result = await verifyCredentials();


    if (result == false) {
        showAlert('danger', 'Email ou senha inválidos.');
        return;
    }



    currentUser.id = result.id;
    currentUser.username = result.username;
    currentUser.fname = result.fname;
    currentUser.surname = result.surname;
    currentUser.email = result.email;
    currentUser.pw = result.pw;
    currentUser.imgUrl = result.imgUrl;


    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    console.log('here login ' + currentUser);
    window.location.href = '../html/index.html';
}

async function verifyCredentials() {
    const formData = new FormData(loginForm);

    try {
        const email = formData.get('email');
        const hashedPassword = await sha256(formData.get('pw'));
        const user = await getUserByEmail(email);

        if (!user) {
            return false;
        }

        if (user.email !== email || user.pw !== hashedPassword) {
            return false;
        }

        return user;

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showAlert('danger', 'Houve um problema ao fazer login.');
        return false;
    }
}


/* USER UPDATE - SETTINGS */

document.addEventListener('DOMContentLoaded', function () {

    const editForm = document.getElementById('editForm');

    if (editForm) {
        const infos = document.querySelectorAll('.info button');
        const editModal = $('#editModal');
        const fieldValue = document.getElementById('fieldValue');
        const saveChangesBtn = document.getElementById('saveChanges');
        let currentField;

        infos.forEach(button => {
            button.addEventListener('click', function () {
                const infoDiv = this.closest('.info');
                currentField = infoDiv.getAttribute('data-field');
                const value = infoDiv.querySelector('h4').textContent;

                // Set modal field values
                fieldValue.value = value;
                editModal.attr('data-field', currentField);

                // Show modal
                editModal.modal('show');
            });
        });
    }

});

async function updateUserInFirebase(userId, userData) {
    console.log('here');
    try {
        const response = await fetch(`https://cordial-rivalry-default-rtdb.firebaseio.com/users/${userId}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        return responseData;

    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}
