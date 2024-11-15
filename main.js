const contentApi = document.querySelector("#content-div");

const getPokemons = (limit) => {
    let allPkmn = [];
    const urlApi = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;

    fetch(urlApi)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error al adquirir Pokémones");
            }
        })
        .then((pokemon) => {
            console.log(pokemon);
            let infoPkmns = pokemon.results;

            let pokePromise = infoPkmns.map((pokemon) => {
                return fetch(pokemon.url)
                    .then((pokeResponse) => pokeResponse.json())
                    .then((moreInfo) => {
                        let infoPoke = {
                            id: moreInfo.id,
                            name: pokemon.name.toUpperCase(),
                            types: moreInfo.types.map((tipo) => tipo.type.name),
                            img: moreInfo.sprites.front_default,
                            height: moreInfo.height,  
                            weight: moreInfo.weight,  
                            stats: moreInfo.stats.map(stat => ({  
                                name: stat.stat.name,
                                value: stat.base_stat
                            })),
                            abilities: moreInfo.abilities.map(ability => ability.ability.name) 
                        };
                        allPkmn.push(infoPoke);
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });
            })
            Promise.all(pokePromise).then(() => {
                
                allPkmn.sort((a, b) => a.id - b.id);
                createContainer(allPkmn);
                showInfo(allPkmn);
            });
        })
        .catch((error) => {
            console.error("error", error.message);
            contentApi.innerHTML = `Error al adquirir pokémones, ${error.message}`;
        });
};

const createContainer = (pokemons) => {
    let htmlContent = '';

    pokemons.forEach((pokemon) => {
        htmlContent += `
        <ul class="col-md-2 p-2 m-3" id="ul-pkmn" data-id="${pokemon.id}">
            <li class ="li-pkmn">
                <h2 id="name-pkmn">${pokemon.name}</h2>
                <div id="div-img" class="d-flex justify-content-center">
                    <img src="${pokemon.img}" alt="${pokemon.name}" id="img-pkmn" class="w-75">
                    <p id="id-pkmn">${pokemon.id}</p>
                </div>
            </li>   
        </ul>`;
    });
    contentApi.innerHTML = htmlContent;
};

const showInfo = (pokemons) => {
    const cardInfos = document.querySelectorAll("#ul-pkmn");

    cardInfos.forEach((cardInfo) => {
        cardInfo.addEventListener("click", () => {
            const pokemonId = parseInt(cardInfo.getAttribute("data-id"));
            const selectedPokemon = pokemons.find(pokemon => pokemon.id === pokemonId);
            if (selectedPokemon) {
                contentApi.innerHTML = 
                `<div id="div-info" class="">
                    <div class="d-flex justify-content-center">
                        <img src="${selectedPokemon.img}" alt="${selectedPokemon.name}" id ="img-pokemon">
                    </div>
                    <h2>${selectedPokemon.name}</h2>
                    <h4>Caracteristicas:</h4>
                    <p>Tipos: ${selectedPokemon.types.join(', ')}</p>
                    <p>Altura: ${(selectedPokemon.height / 10).toFixed(1)} m</p> 
                    <p>Peso: ${(selectedPokemon.weight / 10).toFixed(1)} kg</p>
                    <h4>Estadísticas base:</h4>
                    <ul>
                        ${selectedPokemon.stats.map(stat => `<li>${stat.name}: ${stat.value}</li>`).join('')}
                    </ul>
                    <h4>Habilidades:</h4>
                    <ul>
                        ${selectedPokemon.abilities.map(ability => `<li>${ability}</li>`).join('')}
                    </ul>
                    <button id="return-btn" onclick="window.location.reload()">Retroceder</button>
                </div>`;   
            }
        });
    });
};

document.addEventListener ('keyup', e => {
    if (e.target.matches('#search-pkmn')) {
        let searchValue = e.target.value.toLowerCase().trim(); 
        document.querySelectorAll ('.li-pkmn').forEach(pkmn=>{
            if (pkmn.textContent.toLowerCase().includes(searchValue)) {
                pkmn.parentElement.style.display = "block";
            }else {
                pkmn.parentElement.style.display = "none";
            }
        })

    }
})

getPokemons(150);
