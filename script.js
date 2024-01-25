function salvarNoLocalStorage() {
  // Obtém os valores dos campos de entrada
  var nome = document.getElementById("nome").value;
  var diaNascimento = document.getElementById("dia-nascimento").value;
  var mesNascimento = document.getElementById("mes-nascimento").value;

  // Cria um objeto com esses valores
  var pessoa = {
    nome: nome,
    diaNascimento: diaNascimento,
    mesNascimento: mesNascimento,
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

  console.log(pessoa);
  console.log(lista);
}

// Busca aniversariante na local storage
function buscaAniversariante() {
  let dataAtual = new Date();
  let mesAtual = dataAtual.getMonth() + 1;
  let diaAtual = dataAtual.getDate();
  let msg1 = document.getElementById("msg1");
  let msg2 = document.getElementById("msg2");

  // obtem array lista do local storage
  let listaJSON = localStorage.getItem("lista");
  let lista = JSON.parse(listaJSON);

  // busca por equivalencias na lista
  let encontrou = false;
  for (var i = 0; i < lista.length; i++) {
    var pessoa = lista[i];

    if (pessoa.mesNascimento == mesAtual && pessoa.diaNascimento == diaAtual) {
      msg1.innerHTML = "Hoje é o aniversário de " + pessoa.nome;
      encontrou = true;
      var aniversariantesDoMes = lista.filter(function (pessoa) {
        return (
          pessoa.mesNascimento == mesAtual && pessoa.diaNascimento > diaAtual
        );
      });
      if (aniversariantesDoMes.length > 0) {
        msg2.innerHTML = "Próximos aniversariantes desse mês: ";
        aniversariantesDoMes.forEach(function (pessoa) {
          msg2.innerHTML +=
            pessoa.nome + ", Dia: " + pessoa.diaNascimento + "<br>";
        });
      } else {
        msg2.innerHTML = "Nesse mes não teremos mais aniversariantes";
      }
    }
  }

  if (!encontrou) {
    msg1.innerHTML = "Hoje não temos aniversariantes";
    var aniversariantesDoMes = lista.filter(function (pessoa) {
      return (
        pessoa.mesNascimento == mesAtual && pessoa.diaNascimento > diaAtual
      );
    });
    if (aniversariantesDoMes.length > 0) {
      msg2.innerHTML = "Próximos aniversariantes desse mês: ";
      aniversariantesDoMes.forEach(function (pessoa) {
        msg2.innerHTML +=
          pessoa.nome + ", Dia: " + pessoa.diaNascimento + "<br>";
      });
    } else {
      msg2.innerHTML = "Nesse mes não teremos mais aniversariantes";
    }
  }

  const textoFalado1 = msg1.textContent;
  const textoFalado2 = msg2.textContent;

  var msg = new SpeechSynthesisUtterance();
  msg.text = textoFalado1;
  window.speechSynthesis.speak(msg);

  var msg = new SpeechSynthesisUtterance();
  msg.text = textoFalado2;
  window.speechSynthesis.speak(msg);
}
