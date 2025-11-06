// === Pesquisa por nome ===
const botaoPesquisar = document.getElementById("botaoPesquisar");
const barraDePesquisa = document.getElementById("barraDePesquisa");
const resultados = document.getElementById("resultadosPesquisa");

botaoPesquisar.addEventListener("click", () => {
  const termo = barraDePesquisa.value.trim();
  if (!termo) {
    resultados.innerHTML =
      "<li class='list-group-item'>Digite algo para buscar.</li>";
    return;
  }

  fetch(
    `http://localhost:3001/pesquisarEstabelecimentos?q=${encodeURIComponent(
      termo
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      resultados.innerHTML = "";
      if (data.length === 0) {
        resultados.innerHTML =
          "<li class='list-group-item'>Nenhum estabelecimento encontrado.</li>";
      } else {
        data.forEach((estabelecimento) => {
          const li = document.createElement("li");
          li.classList.add("list-group-item");
          li.textContent = estabelecimento.nome_estabelecimento;
          li.addEventListener("click", () => {
            localStorage.setItem(
              "estabelecimentoSelecionado",
              estabelecimento.id_estabelecimento
            );
            window.location.href = "estabelecimento.html";
          });
          resultados.appendChild(li);
        });
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar estabelecimentos:", error);
      resultados.innerHTML =
        "<li class='list-group-item'>Erro ao buscar dados.</li>";
    });
});

// === Carregar lista inicial ===
document.addEventListener("DOMContentLoaded", () => {
  carregarEstabelecimentos();
});

// === Carregar estabelecimentos com/sem filtros ===
function carregarEstabelecimentos() {
  const gluten = document.getElementById("filtroGluten")?.checked;
  const lactose = document.getElementById("filtroLactose")?.checked;

  let url = "http://localhost:3001/estabelecimentos";
  const params = [];

  if (gluten) params.push("gluten=true");
  if (lactose) params.push("lactose=true");

  if (params.length > 0) url += "?" + params.join("&");

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const lista = document.getElementById("listaProximos");
      lista.innerHTML = "";

      if (data.length === 0) {
        lista.innerHTML = "<p>Nenhum estabelecimento encontrado.</p>";
        return;
      }

      data.forEach((estab) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
          <img src="http://localhost:3001/${
            estab.img_estabelecimento || "imgs/default.jpg"
          }" alt="${estab.nome_estabelecimento}">
          <h3 class="nomeest">${estab.nome_estabelecimento}</h3>
          <p class="cidadeest">${estab.cidade_estabelecimento || ""}</p>
          <button class="ver-mais">Ver Mais</button>
        `;

        card.querySelector(".ver-mais").addEventListener("click", () => {
          localStorage.setItem(
            "estabelecimentoSelecionado",
            estab.id_estabelecimento
          );
          window.location.href = "estabelecimento.html";
        });

        lista.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Erro ao carregar estabelecimentos:", err);
    });
}

// === Filtros (botão aplicar) ===
document.getElementById("aplicarFiltros").addEventListener("click", () => {
  carregarEstabelecimentos();
});
