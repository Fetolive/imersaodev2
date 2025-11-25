const cardContainer = document.querySelector(".card-container");
let dados = [];
let debounceTimer;

async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar dados: ${resposta.statusText}`);
        }
        dados = await resposta.json();
        renderizarCards(dados);
    } catch (error) {
        console.error("Falha ao carregar os dados:", error);
        cardContainer.innerHTML = "<p>Não foi possível carregar as informações. Tente novamente mais tarde.</p>";
    }
}

function performSearch() {
    const termoBusca = document.getElementById("barraBusca").value.toLowerCase();
    const dadosFiltrados = dados.filter(dado => {
        return dado.nome.toLowerCase().includes(termoBusca) ||
               dado.descrição.toLowerCase().includes(termoBusca);
    });
    renderizarCards(dadosFiltrados);
}

function handleSearch() {
    // Limpa o timer anterior a cada nova tecla pressionada
    clearTimeout(debounceTimer);

    // Configura um novo timer para executar a busca após 300ms
    debounceTimer = setTimeout(performSearch, 300);
}



function renderizarCards(dadosParaRenderizar) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes

    if (dadosParaRenderizar.length === 0) {
        cardContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    const fragment = document.createDocumentFragment();

    dadosParaRenderizar.forEach(dado => {
        const article = document.createElement("article");
        article.classList.add("card");

        const h2 = document.createElement("h2");
        h2.textContent = dado.nome;

        const pAno = document.createElement("p");
        pAno.textContent = dado.ano;

        const pDesc = document.createElement("p");
        pDesc.textContent = dado.descrição;

        const a = document.createElement("a");
        a.href = dado.link;
        a.target = "_blank";
        a.rel = "noopener noreferrer"; // Boa prática de segurança
        a.textContent = "Saiba mais";

        article.append(h2, pAno, pDesc, a);
        fragment.appendChild(article);
    });

    cardContainer.appendChild(fragment);
}

function iniciar() {
    const barraBusca = document.getElementById("barraBusca");
    barraBusca.addEventListener("keyup", handleSearch);
    const botaoBusca = document.getElementById("botao-busca");
    botaoBusca.addEventListener("click", performSearch);
    carregarDados();
}

// Inicia a aplicação assim que o DOM estiver pronto
document.addEventListener("DOMContentLoaded", iniciar);