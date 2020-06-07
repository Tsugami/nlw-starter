async function getStates() {
  return fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
  ).then((res) => res.json());
}

async function getCitiesByStateId(stateId) {
  return fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios`
  ).then((res) => res.json());
}

async function populateUFs() {
  let ufSelect = document.querySelector("select[name=uf]");
  const states = await getStates();

  for (const state of states) {
    ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`;
  }
}

async function handleCities(event) {
  let citySelect = document.querySelector("select[name=city]");
  let stateSelect = document.querySelector("input[name=state]");

  citySelect.innerHTML = '<option value="">Selecione a Cidade</option>  ';
  citySelect.disabled = true;

  const indexSelectedState = event.target.selectedIndex;
  stateSelect.value = event.target.options[indexSelectedState].text;

  const stateId = event.target.value;
  const cities = await getCitiesByStateId(stateId);

  for (const city of cities) {
    citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`;
  }

  citySelect.disabled = false;
}

populateUFs();
document
  .querySelector("select[name=uf]")
  .addEventListener("change", handleCities);

const itemsToCollect = document.querySelectorAll(".items-grid li");

for (const item of itemsToCollect) {
  item.addEventListener("click", handleSelectItem);
}

const selectedItems = [];
function handleSelectItem(event) {
  const itemLi = event.target;
  const itemId = itemLi.dataset.id;

  itemLi.classList.toggle("selected");

  const alreadySelected = selectedItems.indexOf(itemId);

  if (alreadySelected >= 0) {
    selectedItems.splice(alreadySelected, 1);
  } else {
    selectedItems.push(itemId);
  }
}
