var controlecampo = 1;
function adicionar() {
  controlecampo++;
  document
    .getElementById("servicos")
    .insertAdjacentHTML(
      "beforeend",
      ' <div class="servicos-block"><label>Serviço 1</label><br><textarea name="servico' +
        controlecampo +
        '" id="servico1" cols="30" rows="4" placeholder="Ex:Polimento"></textarea><input type="number" id="VALOR' +
        controlecampo +
        '" placeholder="R$"><button type="button" onclick="adicionar()">+</button></div>'
    );
}
