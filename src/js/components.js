
// SIDE BAR

const accountOptions = document.getElementById('account-options');
accountOptions ? accountOptions.innerHTML = ` <nav class="navbar navbar-expand-xl navbar-light">                    

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
        <li class="nav-item">
            <a class="nav-link" href="bets_dashboard.html">
                <div class="option selected">
                    <i class="fas fa-chart-line"></i>
                    <span>Overview</span>
                </div>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link" href="rooms.html">
                <div class="option">
                    <i class="fa-solid fa-dice-six"></i>
                    <span>Rooms</span>
                </div>
            </a>
        </li>

        <li class="nav-item">
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

        <li class="nav-item">
            <a class="nav-link" href="settings.html">
                <div class="option">
                    <i class="fa-solid fa-gear"></i>
                    <span>Settings</span>
                </div>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link" href="index.html">
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
                    <!--     -->
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
                    <!-- <i class="fa-solid fa-3 notify-info"></i> -->
                </div>
            </a>
        </li>

    </ul>
</div>

</nav> ` : '';