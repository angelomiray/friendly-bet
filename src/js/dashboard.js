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