document.addEventListener('DOMContentLoaded', () => {
    const characterNameSelect = document.getElementById('characterName');
    const characterDetails = {
        name: document.querySelector('.character-name'),
        health: document.querySelector('.health'),
        attack: document.querySelector('.attack'),
        defense: document.querySelector('.defense'),
        speed: document.querySelector('.speed'),
        energy: document.querySelector('.energy')
    };

    function updateCharacterDetails(character) {
        characterDetails.name.textContent = character.name;
        characterDetails.health.textContent = character.health;
        characterDetails.attack.textContent = character.attack;
        characterDetails.defense.textContent = character.defense;
        characterDetails.speed.textContent = character.speed;
        characterDetails.energy.textContent = character.energy;
    }

    function fetchCharacterData(name) {
        return fetch(`/api/character?name=${name}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to fetch character data. Please try again later.');
                throw error;
            });
    }

    fetch('/api/characters')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(character => {
                const option = document.createElement('option');
                option.value = character.name;
                option.textContent = character.name;
                characterNameSelect.appendChild(option);
            });

            if (data.length > 0) {
                characterNameSelect.value = data[0].name;
                return fetchCharacterData(data[0].name);
            } else {
                throw new Error('No character data found');
            }
        })
        .then(updateCharacterDetails)
        .catch(error => {
            console.error('Error:', error);
        });

    characterNameSelect.addEventListener('change', () => {
        const selectedName = characterNameSelect.value;
        if (selectedName) {
            fetchCharacterData(selectedName)
                .then(updateCharacterDetails);
        }
    });
});
