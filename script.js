document.addEventListener('DOMContentLoaded', () => {
    const characterNameSelect = document.getElementById('characterName');
    const lightConeNameSelect = document.getElementById('lightConeName');

    const characterDetails = {
        name: document.querySelector('.character-name'),
        destiny: document.querySelector('.destiny'),
        health: document.querySelector('.health'),
        attack: document.querySelector('.attack'),
        defense: document.querySelector('.defense'),
        speed: document.querySelector('.speed'),
        energy: document.querySelector('.energy')
    };

    // 添加光锥属性展示元素
    const lightConeDetails = {
        name: document.querySelector('.lightcone-name'),
        destiny: document.querySelector('.lightcone-destiny'),
        health: document.querySelector('.lightcone-health'),
        attack: document.querySelector('.lightcone-attack'),
        defense: document.querySelector('.lightcone-defense'),
        description: document.querySelector('.lightcone-description')
    };

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

    function fetchLightConeData(name) {
        return fetch(`/api/lightcone?name=${name}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to fetch light cone data. Please try again later.');
                throw error;
            });
    }

    function updateLightConeDetails(lightCone) {
        lightConeDetails.name.textContent = lightCone.name;
        lightConeDetails.destiny.textContent = lightCone.destiny;
        lightConeDetails.health.textContent = lightCone.health;
        lightConeDetails.attack.textContent = lightCone.attack;
        lightConeDetails.defense.textContent = lightCone.defense;
        lightConeDetails.description.textContent = lightCone.description;
    }

    function updateCharacterDetails(character) {
        characterDetails.name.textContent = character.name;
        characterDetails.destiny.textContent = character.destiny;
        characterDetails.health.textContent = character.health;
        characterDetails.attack.textContent = character.attack;
        characterDetails.defense.textContent = character.defense;
        characterDetails.speed.textContent = character.speed;
        characterDetails.energy.textContent = character.energy;
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

    // 加载光锥列表
    fetch('/api/lightcones')
        .then(response => response.json())
        .then(lightCones => {
            lightConeNameSelect.innerHTML = '';
            lightCones.forEach((lightCone, index) => {
                const option = document.createElement('option');
                option.value = lightCone.name;
                option.textContent = lightCone.name;
                lightConeNameSelect.appendChild(option);
                if (index === 0) {
                    lightConeNameSelect.value = lightCone.name;
                    fetchLightConeData(lightCone.name)
                        .then(lightConeData => updateLightConeDetails(lightConeData));
                }
            });
            lightConeNameSelect.disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch light cone list. Please try again later.');
        });

    characterNameSelect.addEventListener('change', () => {
        const selectedCharacterName = characterNameSelect.value;
        fetchCharacterData(selectedCharacterName)
            .then(characterData => updateCharacterDetails(characterData));
    });

    // 监听光锥选择变化
    lightConeNameSelect.addEventListener('change', () => {
        const selectedLightConeName = lightConeNameSelect.value;
        fetchLightConeData(selectedLightConeName)
            .then(lightConeData => updateLightConeDetails(lightConeData));
    });
});
