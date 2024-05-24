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

            if (teamName && teamImgUrlValue) {
                const teamCardContainer = document.getElementById('teamCardsContainer');

                const newTeamCard = document.createElement('div');
                newTeamCard.className = 'team-card col-lg-5 col-12 mb-3 d-flex align-items-center justify-content-between';
                newTeamCard.innerHTML = `
                    <div class="d-flex align-items-center">
                        <img src="${teamImgUrlValue}">
                        <h3>${teamName}</h3>
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
                    teamCardContainer.removeChild(newTeamCard);
                });

                teamCardContainer.appendChild(newTeamCard);

                // Reset form and close modal
                addTeamForm.reset();
                document.getElementById('teamImg').src = '';
                $('#addTeamModal').modal('hide');
            } else {
                // Optionally, you can show an error message here
                alert('Please provide both team name and image URL.');
            }
        });
    }
});
