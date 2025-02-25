async function getChampion() {
    const champName = document.getElementById("championName").value.trim();
    const formattedName = champName.charAt(0).toUpperCase() + champName.slice(1).toLowerCase();
    const url = `https://ddragon.leagueoflegends.com/cdn/14.1.1/data/en_US/champion/${formattedName}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Champion not found!");

        const data = await response.json();
        const champData = data.data[formattedName];

        // Create Skin Selection First
        let skinButtons = `<h3>Select Skin</h3><div id="skin-container">`;
        champData.skins.forEach(skin => {
            skinButtons += `
                <button class="skin-button" onclick="changeSkin('${formattedName}', ${skin.num})">
                    ${skin.name === "default" ? champData.name : skin.name}
                </button>
            `;
        });
        skinButtons += `</div>`;

        // Display Champion Info
        let content = `
            ${skinButtons}
            <img id="champion-skin" src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${formattedName}_0.jpg">
            <h2>${champData.name} - ${champData.title}</h2>
            <p><b>Role:</b> ${champData.tags.join(", ")}</p>
            <p><b>Full Lore:</b> ${champData.lore}</p>
            <h3>Abilities</h3>
        `;

        // Passive Ability
        content += `
            <div class="skill">
                <h4>Passive - ${champData.passive.name}</h4>
                <img src="https://ddragon.leagueoflegends.com/cdn/14.1.1/img/passive/${champData.passive.image.full}" width="50">
                <p>${champData.passive.description}</p>
            </div>
        `;

        // Spells (Q, W, E, R)
        const spellKeys = ["Q", "W", "E", "R"];
        champData.spells.forEach((spell, index) => {
            content += `
                <div class="skill">
                    <h4>${spellKeys[index]} - ${spell.name}</h4>
                    <img src="https://ddragon.leagueoflegends.com/cdn/14.1.1/img/spell/${spell.image.full}" width="50">
                    <p>${spell.description}</p>
                </div>
            `;
        });

        document.getElementById("champion-info").innerHTML = content;
    } catch (error) {
        document.getElementById("champion-info").innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}

function changeSkin(championName, skinNum) {
    document.getElementById("champion-skin").src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_${skinNum}.jpg`;
}
