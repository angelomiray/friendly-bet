// import {showAlert} from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Obtenha o objeto currentUser do localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        document.querySelector('.image-container img').src = currentUser.imgUrl;
        document.querySelector('.info[data-field="username"] h4').innerText = currentUser.username;
        document.querySelector('.info[data-field="fname"] h4').innerText = currentUser.fname;
        document.querySelector('.info[data-field="surname"] h4').innerText = currentUser.surname;
        document.querySelector('.info[data-field="email"] h4').innerText = currentUser.email;
    }
    
    document.querySelectorAll('[data-toggle="modal"]').forEach(button => {
        button.addEventListener('click', () => {
            const field = button.getAttribute('data-field');
            document.querySelector('#editModalLabel').innerText = `Edit ${field.charAt(0).toUpperCase() + field.slice(1)}`;
            document.querySelector('#fieldValue').value = currentUser[field];
            document.querySelector('#editForm').setAttribute('data-field', field);
        });
    });

    // Evento de submissão do formulário do modal
    document.querySelector('#editForm').addEventListener('submit', event => {
        event.preventDefault();
        const field = event.target.getAttribute('data-field');
        const newValue = document.querySelector('#fieldValue').value;

        currentUser[field] = newValue;

        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        document.querySelector(`.info[data-field="${field}"] h4`).innerText = newValue;
        
        $('#editModal').modal('hide');
    });


    document.querySelector('#saveChanges').addEventListener('click', async () => {
        try {
            const userId = currentUser.id;
            await updateUserInFirebase(userId, currentUser);
            showAlert('success', 'Changes saved successfully!');
        } catch (error) {
            showAlert('danger', 'Failed to save changes.');
        }
    });

});


document.addEventListener('DOMContentLoaded', function() {
    const deleteButton = document.getElementById('deleteAccountButton');

    deleteButton.addEventListener('click', async function() {
        const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (confirmation) {
            const userId = getCurrentUserId();
            try {
                await deleteUserAccount(userId);
                localStorage.removeItem('currentUser');
                showAlert('sucess', 'Your account has been deleted successfully.');
                
                window.location.href = '../html/index.html'; // Update this to the appropriate URL
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('danger', 'An error occurred while deleting your account. Please try again.');
            }
        }
    });
});

function getCurrentUserId() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.id : null;
}

async function deleteUserAccount(userId) {
    if (!userId) {
        throw new Error('User ID is required to delete account');
    }
    
    try {
        const response = await fetch(`https://cordial-rivalry-default-rtdb.firebaseio.com/users/${userId}.json`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        // Optionally, delete authentication credentials
        // await firebase.auth().currentUser.delete();
        
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
}
