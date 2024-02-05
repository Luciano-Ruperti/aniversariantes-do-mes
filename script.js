function salvarNoLocalStorage() {
  // Obtém os valores dos campos de entrada
  let nome = document.getElementById("nome");
  let diaNascimento = document.getElementById("dia-nascimento");
  let mesNascimento = document.getElementById("mes-nascimento");
  let salvarBtn = document.getElementById("input-btn");
  let msgErro = document.getElementById("msg-erro");

  msgErro.innerText = "";

  let preencheu = validaInformacoes(nome, diaNascimento, mesNascimento);

  if (preencheu) {
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
}

function validaInformacoes(nome, diaNascimento, mesNascimento) {
  nome = nome.value;
  dia = Number(diaNascimento.value);
  mes = Number(mesNascimento.value);
  console.log(nome, dia, mes);
  const mesesCom30Dias = [4, 6, 9, 11];
  const mesesCom31Dias = [1, 3, 5, 7, 8, 10, 12];
  let preencheu = false;
  let msgErro = document.getElementById("msg-erro");
  msgErro.style.color = "rgb(255, 5, 5)";

  // verifica se preencheu todos os campos
  if (nome === "" || dia === 0 || mes === 0) {
    msgErro.innerText = "* Preencha os três campos *";
    // verifica se o nome é válido
  } else if (!/^[\p{L}\s]*$/gu.test(nome) || nome.length < 2) {
    msgErro.innerText = "* Nome inválido *";
  }
  // verifica se o mês é válido
  else if (mes < 1 || mes > 12) {
    msgErro.innerText = "* Mês inválido *";
  } // verifica se o dia é válido
  else if (
    dia < 1 ||
    (mes === 2 && dia > 29) ||
    (mesesCom30Dias.includes(mes) && dia > 30) ||
    (mesesCom31Dias.includes(mes) && dia > 31)
  ) {
    msgErro.innerText = "* Dia inválido *";
  } else {
    preencheu = true;
    msgErro.innerText = "* Contato adicionado *";
    msgErro.style.color = "green";
  }
  return preencheu;
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
        if (msg1.innerHTML === "Hoje é o aniversário de: ") {
          msg1.innerHTML += pessoa.nome + ". <br>";
        } else {
          msg1.innerHTML += "e também de: " + pessoa.nome + ". <br>";
        }
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
