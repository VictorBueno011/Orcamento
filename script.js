var controlecampo = 1;
function adicionar() {
  controlecampo++;
  document
    .getElementById("servicos")
    .insertAdjacentHTML(
      "beforeend",
      ' <div class="servicos-block"><label>Serviço ' +
        controlecampo +
        '</label><br><textarea name="servico' +
        controlecampo +
        '" id="servico1" cols="30" rows="4" placeholder="Ex:Polimento"></textarea><input type="number" id="VALOR' +
        controlecampo +
        '" placeholder="R$"><button id=adicionar' +
        controlecampo +
        '  type="button" onclick="adicionar()">+</button></div>'
    );
}
function calcular() {}
function esconderBtn() {
  document.getElementById("adicionar").style.display = "none";
}
function aparecer() {
  document.getElementById("adicionar").style.fontSize = "80px";
}
