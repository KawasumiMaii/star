document.addEventListener('DOMContentLoaded', () => {
    const characterNameSelect = document.getElementById('characterName');
    const characterDetails = {
        name: document.querySelector('.character-name'),
        destiny: document.querySelector('.destiny'),
        health: document.querySelector('.health'),
        attack: document.querySelector('.attack'),
        defense: document.querySelector('.defense'),
        speed: document.querySelector('.speed'),
        energy: document.querySelector('.energy')
    };

    function updateCharacterDetails(character) {
        characterDetails.name.textContent = character.name;
        characterDetails.destiny.textContent = character.destinyName;
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
        .then(response => response.json())
        .then(characters => {
            // 清除“请选择角色”选项
            characterNameSelect.innerHTML = '';
            characters.forEach((character, index) => {
                const option = document.createElement('option');
                option.value = character.name;
                option.textContent = character.name;
                characterNameSelect.appendChild(option);
                // 默认选择第一个角色
                if (index === 0) {
                    characterNameSelect.value = character.name;
                    fetchCharacterData(character.name)
                        .then(characterData => updateCharacterDetails(characterData));
                }
            });
            characterNameSelect.disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch character list. Please try again later.');
        });

    characterNameSelect.addEventListener('change', () => {
        const selectedCharacterName = characterNameSelect.value;
        fetchCharacterData(selectedCharacterName)
            .then(characterData => updateCharacterDetails(characterData));
    });
});
