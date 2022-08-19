// var controlecampo = 1;
// function adicionar() {
//   controlecampo++;
//   document
//     .getElementById("servicos")
//     .insertAdjacentHTML(
//       "beforeend",
//       ' <div class="servicos-block"><label onclick="esconderBtn()">Serviço ' +
//         controlecampo +
//         '</label><br><textarea name="servico' +
//         controlecampo +
//         '" id="servico1" cols="30" rows="4" placeholder="Ex:Polimento"></textarea><input type="number" id="valor' +
//         controlecampo +
//         '" placeholder="R$"><button class="btn" id=adicionar' +
//         controlecampo +
//         ' type="button" onclick="adicionar()">+</button></div>'
//     );
// }

function calcular() {
  let valor1 = document.getElementById("valor1").value;
  let valor2 = document.getElementById("valor2").value;
  let valor3 = document.getElementById("valor3").value;
  let valor4 = document.getElementById("valor4").value;
  let valor5 = document.getElementById("valor5").value;
  var total = Number(valor1 + valor2 + valor3 + valor4 + valor5);
  document.getElementById("resultado").value = total;
  // alert(total);
}

// function esconderBtn() {
//   document.getElementById("adicionar").style.display = "none";
//   document.getElementById("adicionar2").style.display = "none";
//   document.getElementById("adicionar3").style.display = "none";
//   document.getElementById("adicionar4").style.display = "none";
//   document.getElementById("adicionar5").style.display = "none";
//   document.getElementById("adicionar6").style.display = "none";
// }
