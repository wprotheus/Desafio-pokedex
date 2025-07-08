document.addEventListener("DOMContentLoaded", () => {
    const pokemonList = document.getElementById('pokemonList');
    const loadMoreButton = document.getElementById('loadMoreButton');
    const modal = document.getElementById("pokemon-modal");
    const closeButton = document.querySelector(".close-button");

    const maxRecords = 1300;
    const limit = 21;
    let offset = 0;

    function convertPokemonToLi(pokemon) {
        return `<li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
                    <hr>
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                        <img src="${pokemon.photo}" alt="${pokemon.name}">
                    </div>
                </li>`;
    }

    function showPokemonModal(pokemon) {
        const nameElement = document.getElementById("pokemon-name");
        const photoElement = document.getElementById("pokemon-photo");
        const typeElement = document.getElementById("pokemon-type");
        const weightElement = document.getElementById("pokemon-weight");
        const heightElement = document.getElementById("pokemon-height");

        const heightInMeters = pokemon.height ? (pokemon.height / 10).toFixed(2) : "-";
        const weightInKg = pokemon.weight ? (pokemon.weight / 10).toFixed(2) : "-";

        nameElement.textContent = pokemon.name || "-";
        photoElement.src = pokemon.photo || "";
        photoElement.alt = pokemon.name || "Imagem do Pokémon";
        typeElement.textContent = `Tipo: ${pokemon.type || "-"}`;
        weightElement.textContent = `Peso: ${weightInKg} Kg`;
        heightElement.textContent = `Altura: ${heightInMeters} metros`;

        modal.classList.add("show");
    }

    function clearPokemonModal() {
        document.getElementById("pokemon-name").textContent = "";
        document.getElementById("pokemon-photo").src = "";
        document.getElementById("pokemon-type").textContent = "";
        document.getElementById("pokemon-weight").textContent = "";
        document.getElementById("pokemon-height").textContent = "";
    }

    closeButton.addEventListener("click", () => {
        modal.classList.remove("show");
        clearPokemonModal();
    });

    // Fecha o modal ao clicar fora do conteúdo
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.remove("show");
            clearPokemonModal();
        }
    });

    function addPokemonClickEvent() {
        const pokemonElements = pokemonList.querySelectorAll('li.pokemon');
        pokemonElements.forEach((element) => {
            element.addEventListener("click", () => {
                const pokemonId = element.getAttribute("data-id");
                pokeApi.getPokemonDetail({url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`})
                    .then((pokemonDetail) => {
                        showPokemonModal(pokemonDetail);
                    });
            });
        });
    }

    function loadPokemonItens(offset, limit) {
        pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
            const newHtml = pokemons.map(convertPokemonToLi).join('');
            pokemonList.innerHTML += newHtml;
            addPokemonClickEvent();
        });
    }

    loadPokemonItens(offset, limit);

    loadMoreButton.addEventListener('click', () => {
        offset += limit;
        const qtdRecordsWithNextPage = offset + limit;

        if (qtdRecordsWithNextPage >= maxRecords) {
            const newLimit = maxRecords - offset;
            loadPokemonItens(offset, newLimit);
            loadMoreButton.parentElement.removeChild(loadMoreButton);
        } else {
            loadPokemonItens(offset, limit);
        }
    });
});