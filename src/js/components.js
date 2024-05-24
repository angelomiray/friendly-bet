// SIDE BAR

const accountOptions = document.getElementById('account-options');
if (accountOptions) {
    accountOptions.innerHTML = `
    <nav class="navbar navbar-expand-xl navbar-light">                    
        <button class="navbar-toggler bg-dark" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav flex-column">
                <li class="nav-item">
                    <div class="logo navbar-brand">                
                        <img src="../img/logo.png" alt="Logo">
                        <span class="text-light">RIVALRY</span>
                    </div>
                </li>
                <li id="overview-item" class="nav-item">
                    <a class="nav-link" href="bets_dashboard.html">
                        <div class="option">
                            <i class="fas fa-chart-line"></i>
                            <span>Overview</span>
                        </div>
                    </a>
                </li>
                <li id="rooms-item" class="nav-item">
                    <a class="nav-link" href="rooms.html">
                        <div class="option">
                            <i class="fa-solid fa-dice-six"></i>
                            <span>Rooms</span>
                        </div>
                    </a>
                </li>
                <li id="bets-item" class="nav-item">
                    <a class="nav-link" href="#">
                        <div class="option">
                            <i class="fa-solid fa-money-bill"></i>
                            <span>Bets</span>
                        </div>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">
                        <div class="option">
                            <i class="fa-solid fa-tag"></i>
                            <span>Products</span>
                        </div>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">
                        <div class="option">
                            <i class="fa-solid fa-credit-card"></i>
                            <span>Payments</span>
                        </div>
                    </a>
                </li>
                <li id="settings-item" class="nav-item">
                    <a class="nav-link" href="settings.html">
                        <div class="option">
                            <i class="fa-solid fa-gear"></i>
                            <span>Settings</span>
                        </div>
                    </a>
                </li>
                <li id="signout-item" class="nav-item">
                    <a class="nav-link" href="#">
                        <div class="option">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Sign out</span>
                        </div>
                    </a>
                </li>
                <li class="nav-item">
                    <hr>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">
                        <div class="option">
                            <i class="fa-solid fa-message"></i>
                            <span class="option-text">Messages</span>
                        </div>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">
                        <div class="option">
                            <i class="fa-solid fa-bell"></i>
                            <span class="option-text">Notifications</span>
                            <i style="font-size: 14px;" class="fa-solid fa-3 notify-info"></i>
                        </div>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">
                        <div class="option">
                            <i class="fa-brands fa-rocketchat"></i>
                            <span class="option-text">Comments</span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </nav>`;
}

const overviewLink = document.getElementById('overview-item');
const roomsLink = document.getElementById('rooms-item');
const betsLink = document.getElementById('bets-item');
const settingsLink = document.getElementById('settings-item');
const signoutLink = document.getElementById('signout-item');

// Function to remove 'selected' class from all links
function removeSelectedClass() {
    const links = [overviewLink, roomsLink, betsLink, settingsLink];
    links.forEach(link => link.classList.remove('selected'));
}

// Add event listeners to each link
if (overviewLink) {
    overviewLink.addEventListener('click', () => {
        removeSelectedClass();
        overviewLink.classList.add('selected');
        localStorage.setItem('selectedItem', 'overview-item');
    });
}

if (roomsLink) {
    roomsLink.addEventListener('click', () => {
        removeSelectedClass();
        roomsLink.classList.add('selected');
        localStorage.setItem('selectedItem', 'rooms-item');
    });
}

if (betsLink) {
    betsLink.addEventListener('click', () => {
        removeSelectedClass();
        betsLink.classList.add('selected');
        localStorage.setItem('selectedItem', 'bets-item');
    });
}

if (settingsLink) {
    settingsLink.addEventListener('click', () => {
        removeSelectedClass();
        settingsLink.classList.add('selected');
        localStorage.setItem('selectedItem', 'settings-item');
    });
}

if (signoutLink) {
    signoutLink.addEventListener('click', () => {
        removeSelectedClass();
        overviewLink.classList.add('selected');
        localStorage.setItem('selectedItem', 'overview-item');
        
        // Modify currentUser in localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            currentUser.id = 'None';
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        // Redirect to the homepage
        window.location.href = 'index.html';
    });
}

// Retrieve the selected item from localStorage and apply the 'selected' class
document.addEventListener('DOMContentLoaded', () => {
    const selectedItem = localStorage.getItem('selectedItem');
    if (selectedItem) {
        const selectedElement = document.getElementById(selectedItem);
        if (selectedElement) {
            removeSelectedClass();
            selectedElement.classList.add('selected');
        }
    }
});
