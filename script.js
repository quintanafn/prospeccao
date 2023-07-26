const apiKey = "AIzaSyDU_zPD4OTZ_1YsRMt_FbXnjtDRBkSswMg";
const spreadsheetId = "1j2NcRWjP7QC5unRgbC_FvZbgrQpsV7jrcil16ECnUvw";
const sheetName = "dados";
let rowIndex = parseInt(localStorage.getItem("currentRow")) || 1;

// Função que carrega os dados dos clientes
function carregarPerfilCliente() {
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A${rowIndex}:G${rowIndex}?key=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      exibirPerfilCliente(data.values[0])
    console.log(data.values[0])
  })
    
    .catch((error) => console.error("Erro ao obter dados da planilha:", error));
}

// Função para exibir os dados do perfil do cliente na página
function exibirPerfilCliente(cliente) {
  const [nomeEmpresarial, nomeResponsavel, imagem, telefone, status, nicho, observacao, cnpj, instagram, facebook, site] = cliente;

  function atualizarCampo(nomeCampo, valor) {
    const campoElement = document.querySelector(`.${nomeCampo} .field-content`);
    campoElement.textContent = valor;
  }

  atualizarCampo("company-name", nomeEmpresarial);
  atualizarCampo("contact-name", nomeResponsavel);
  document.getElementById("company-photo").src = imagem;
  atualizarCampo("phone-number", telefone);
  atualizarCampo("status", status);
  atualizarCampo("niche", nicho);
  atualizarCampo("cnpj", cnpj);
  atualizarCampo("insta", instagram);
  atualizarCampo("face", facebook);
  atualizarCampo("site", site);
  

  // Defina o valor inicial do campo de observação
  const observacaoElement = document.querySelector(".observation");
  observacaoElement.value = observacao;

  // Adicione o evento para atualizar a observação na planilha quando houver alterações
  observacaoElement.addEventListener("input", () => atualizarObservacao(observacaoElement.value));
}

// Função para atualizar a observação do perfil do cliente e salvar na planilha
function atualizarObservacao(valor) {
  const cliente = [undefined, undefined, undefined, undefined, undefined, undefined, valor];
  salvarPerfilCliente(cliente);
}

// Função para salvar os dados do perfil do cliente na planilha
function salvarPerfilCliente(cliente) {
  const range = `${sheetName}!A${rowIndex}:G${rowIndex}`;
  const params = {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [cliente],
    }),
  };

  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW&key=${apiKey}`, params)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao salvar os dados na planilha.");
      } else {
        // Atualizar o campo de observação localmente após salvar na planilha
        const observacaoElement = document.querySelector(".observation");
        observacaoElement.value = cliente[6];
      }
    })
    .catch((error) => console.error(error));
}

// Funções para navegar entre os perfis de clientes
function previousProfile() {
  if (rowIndex > 1) {
    rowIndex--;
    carregarPerfilCliente();
    localStorage.setItem("currentRow", rowIndex);
  }
}

function nextProfile() {
  rowIndex++;
  carregarPerfilCliente();
  localStorage.setItem("currentRow", rowIndex);
}

// Adicione o seguinte código JavaScript
const socialIcons = document.querySelectorAll('.profile-field.insta, .profile-field.face, .profile-field.site');
const addButtonSocial = document.querySelector('.round-button-social');

let timer;

function showAddButton() {
  addButtonSocial.classList.add('show-button');
}

function hideAddButton() {
  addButtonSocial.classList.remove('show-button');
}

socialIcons.forEach(icon => {
  icon.addEventListener('mouseover', () => {
    showAddButton();
    clearTimeout(timer);
  });

  icon.addEventListener('mouseout', () => {
    timer = setTimeout(hideAddButton, 2000);
  });
});


// Carrega o primeiro perfil do cliente ao carregar a página
carregarPerfilCliente();
