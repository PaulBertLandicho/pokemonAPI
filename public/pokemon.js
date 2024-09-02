const pokemonCount = 30;
const pokedex = {}; // {1 : {"name" : "bulbasaur", "img" : url, "types" : [...], "desc" : "...."} }

window.onload = async function() {

    // Fetch Pokémon data and populate the list
    for (let i = 1; i <= pokemonCount; i++) {
        await getPokemon(i);
    }

    
    // Generate Pokémon list items
    function populatePokemonList() {
    const pokemonListElement = document.getElementById("pokemon-list");
    pokemonListElement.innerHTML = '';
    for (let i = 1; i <= pokemonCount; i++) {
        let pokemonItem = document.createElement("div");
        pokemonItem.id = i;
        pokemonItem.className = "pokemon-item";
        pokemonItem.innerHTML = `
            <img src="${pokedex[i].img}" style="margin-left: 20px; width: 130px; height: 130px;" alt="${pokedex[i].name}">
            <div>
             
              <h2 style="margin-left: 15px; font-size: 20px;"> ${pokedex[i].name.charAt(0).toUpperCase() + pokedex[i].name.slice(1)}</h2>
            </div>
        `;
        pokemonItem.addEventListener("click", updatePokemon);
        pokemonListElement.append(pokemonItem);
    }
}
    // Generate Pokémon list items
    populatePokemonList();  

    // Display the first Pokémon description initially
    updatePokemon.call(document.querySelector(".pokemon-item"));
        document.getElementById("search-bar").addEventListener("input", filterPokemonList);

}

async function getPokemon(num) {
    let url = `https://pokeapi.co/api/v2/pokemon/${num}`;
    let res = await fetch(url);
    let pokemon = await res.json();

    let pokemonName = pokemon.name;
    let pokemonTypes = pokemon.types;
    let pokemonImg = pokemon.sprites.front_default;
    let pokemonStats = pokemon.stats;
    let pokemonMoves = pokemon.moves;

    res = await fetch(pokemon.species.url);
    let pokemonDesc = await res.json();
    pokemonDesc = pokemonDesc.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;

    pokedex[num] = {
        name: pokemonName,
        img: pokemonImg,
        types: pokemonTypes,
        desc: pokemonDesc,
        stats: pokemonStats,
        moves: pokemonMoves
    };
}

function updatePokemon() {
    const pokemonId = this.id;
    const pokemon = pokedex[pokemonId];

    // Update main content
    document.getElementById("pokemon-img").src = pokemon.img;
    const typesDiv = document.getElementById("pokemon-types");
    typesDiv.innerHTML = '';
    pokemon.types.forEach(type => {
        let typeSpan = document.createElement("span");
        typeSpan.innerText = type.type.name.toUpperCase();
        typeSpan.classList.add("px-2", "py-1", "mx-1", "border", "border-white", "rounded-lg", "text-white");
        typeSpan.classList.add(type.type.name); 
        typesDiv.append(typeSpan);
    });
    document.getElementById("pokemon-description").innerText = pokemon.desc;

    // Update modal content
    const modalImg = document.getElementById("modal-pokemon-img");
    modalImg.src = pokemon.img;
    document.getElementById("modal-pokemon-name").innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const modalTypesDiv = document.getElementById("modal-pokemon-types");
    modalTypesDiv.innerHTML = '';
    pokemon.types.forEach(type => {
        let typeSpan = document.createElement("span");
        typeSpan.innerText = type.type.name.toUpperCase();
        typeSpan.classList.add("px-2", "py-1", "mx-1", "border", "border-white", "rounded-lg", "text-white");
        typeSpan.classList.add(type.type.name); 
        modalTypesDiv.append(typeSpan);
    });

    // Update base stats
    const statsList = document.getElementById("modal-stats-list");
    statsList.innerHTML = '';
    pokemon.stats.forEach(stat => {
        let statItem = document.createElement("li");
        statItem.innerText = `${stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}: ${stat.base_stat}`;
        statsList.append(statItem);
    });

    // Update evaluation
    document.getElementById("modal-evaluation-text").innerText = `Evaluation for ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} would be shown here.`;

    // Update moves
    const movesList = document.getElementById("modal-moves-list");
    movesList.innerHTML = '';
    pokemon.moves.slice(0, 10).forEach(move => {
        let moveItem = document.createElement("li");
        moveItem.innerText = move.move.name.charAt(0).toUpperCase() + move.move.name.slice(1);
        movesList.append(moveItem);
    });

    // Set background color based on Pokémon type
    const modalContent = document.getElementById("modal-content");
    if (pokemon.types.length > 0) {
        const primaryType = pokemon.types[0].type.name; // Use the first type for background color
        modalContent.classList.remove(...Array.from(modalContent.classList).filter(cls => cls.startsWith('type-')));
        modalContent.classList.add(`type-${primaryType}`);
    }

    const openModal = () => {
        document.getElementById('modal-overlay').classList.add('show');
        document.getElementById('modal-content').classList.add('show');
    };

    const closeModal = () => {
        document.getElementById('modal-content').classList.remove('show');
        document.getElementById('modal-overlay').classList.remove('show');
    };

    document.getElementById('pokemon-img').addEventListener('click', openModal);
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);

    document.getElementById('modal-overlay').addEventListener('click', function(event) {
        // Check if the click was outside the modal content
        if (event.target === this) {
            closeModal();
        }
    });
}


    // splash-screen //
    
    document.addEventListener("DOMContentLoaded", function() {
        // Simulate loading time
        setTimeout(function() {

            // Hide the splash screen gradually //
            document.getElementById("splash-screen").classList.add('fade-out');

            // Show the content after the splash screen fades out //
            setTimeout(function() {
                document.getElementById("content").style.display = "block";
            }, 5000); // Wait for 3 seconds before showing the content

            // After fading out, remove the splash screen from the DOM
            setTimeout(function() {
                document.getElementById("splash-screen").remove();
            }, 4000); // Remove the splash screen after 4 seconds
        }, 1000); // Initial delay before starting fade-out
    });

    function switchPage(){
        // Fade out the content
        document.querySelector('.content').classList.add('fade-out');
        // Delay the redirection to see the transition effect
        setTimeout(function() {
            window.location.href = 'login';
        }, 500); // Adjust the timeout as needed (500ms = 0.5s)
    }

    function filterPokemonList() {
        const query = document.getElementById("search-bar").value.toLowerCase();
        const pokemonItems = document.querySelectorAll(".pokemon-item");
    
        pokemonItems.forEach(item => {
            const pokemonName = pokedex[item.id].name.toLowerCase();
            if (pokemonName.includes(query)) {
                item.style.display = "flex"; // Show item
            } else {
                item.style.display = "none"; // Hide item
            }
        });
    }
    