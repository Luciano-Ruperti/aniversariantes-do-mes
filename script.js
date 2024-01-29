function salvarNoLocalStorage() {
  // Obtém os valores dos campos de entrada
  var nome = document.getElementById("nome");
  var diaNascimento = document.getElementById("dia-nascimento");
  var mesNascimento = document.getElementById("mes-nascimento");
  var salvarBtn = document.getElementById("input-btn");

  // Cria um objeto com esses valores
  var pessoa = {
    nome: nome.value,
    diaNascimento: diaNascimento.value,
    mesNascimento: mesNascimento.value,
  };

  // Obtém o array de objetos do Local Storage
  var listaJSON = localStorage.getItem("lista");
  var lista = listaJSON ? JSON.parse(listaJSON) : [];

  // Adiciona o novo objeto ao array
  lista.push(pessoa);

  // ordena a lista por mes e dia
  function compare(a, b) {
    var mesA = Number(a.mesNascimento);
    var mesB = Number(b.mesNascimento);
    var diaA = Number(a.diaNascimento);
    var diaB = Number(b.diaNascimento);

    if (mesA < mesB) return -1;
    if (mesA > mesB) return 1;
    if (diaA < diaB) return -1;
    if (diaA > diaB) return 1;
    return 0;
  }

  lista.sort(compare);

  // Converte o array em uma string JSON
  var listaJSON = JSON.stringify(lista);

  // Salva a string JSON no Local Storage
  localStorage.setItem("lista", listaJSON);

  // Limpa os campos de input
  nome.value = "";
  diaNascimento.value = "";
  mesNascimento.value = "";

  // Coloca o foco no campo nome
  nome.focus();

  // retorna cor original do botão
  salvarBtn.blur();
}

// Busca aniversariante na local storage
function buscaAniversariante() {
  let dataAtual = new Date();
  let mesAtual = dataAtual.getMonth() + 1;
  let diaAtual = dataAtual.getDate();
  let msg1 = document.getElementById("msg1");
  let msg2 = document.getElementById("msg2");
  let searchBtn = document.getElementById("search-btn");

  let result = document.querySelector(".result");
  result.style.display = "flex";

  // obtem array lista do local storage
  let listaJSON = localStorage.getItem("lista");
  let lista = JSON.parse(listaJSON);

  // busca por equivalencias na lista
  let encontrou = false;
  for (var i = 0; i < lista.length; i++) {
    var pessoa = lista[i];
    // Busca aniversariantes do dia
    var aniversariantesDoDia = lista.filter(function (pessoa) {
      return (
        pessoa.mesNascimento == mesAtual && pessoa.diaNascimento == diaAtual
      );
    });
    if (aniversariantesDoDia.length > 0) {
      msg1.innerHTML = "Hoje é o aniversário de: ";
      aniversariantesDoDia.forEach(function (pessoa) {
        msg1.innerHTML += pessoa.nome + ". <br>";
      });
    } else {
      msg1.innerHTML = "Hoje não temos aniversariantes.";
    }

    // Busca próximos aniversariantes do mês
    var aniversariantesDoMes = lista.filter(function (pessoa) {
      return (
        pessoa.mesNascimento == mesAtual && pessoa.diaNascimento > diaAtual
      );
    });
    if (aniversariantesDoMes.length > 0) {
      msg2.innerHTML = "Próximos aniversariantes desse mês: ";
      aniversariantesDoMes.forEach(function (pessoa) {
        msg2.innerHTML +=
          pessoa.nome + ", dia: " + pessoa.diaNascimento + ". <br>";
      });
    } else {
      msg2.innerHTML = "Nesse mês, não teremos mais aniversariantes.";
    }
  }

  // Limpa os campos de entrada
  searchBtn.blur();

  // Fala resultado
  const textoFalado1 = msg1.textContent;
  const textoFalado2 = msg2.textContent;

  var msg = new SpeechSynthesisUtterance();
  msg.text = textoFalado1;
  window.speechSynthesis.speak(msg);

  var msg = new SpeechSynthesisUtterance();
  msg.text = textoFalado2;
  window.speechSynthesis.speak(msg);
}
