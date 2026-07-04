// array que guarda todos os alunos cadastrados
var alunos = [];

// id que vai sendo incrementado a cada aluno novo
var proximoId = 1;

// guarda qual filtro está ativo (todos, aprovado, recuperacao ou reprovado)
var filtroAtual = "todos";

// se estiver editando algum aluno, guarda o id dele aqui. se não tiver editando, fica null
var idEditando = null;

// alunos de exemplo pra não ficar tudo vazio
alunos.push({ id: proximoId++, nome: "Ana Beatriz", frequencia: 96, notas: [8.5, 9, 8] });
alunos.push({ id: proximoId++, nome: "Carlos Eduardo", frequencia: 82, notas: [6, 5.5, 6.5] });
alunos.push({ id: proximoId++, nome: "Fernanda Costa", frequencia: 70, notas: [7, 8] });
alunos.push({ id: proximoId++, nome: "João Pedro", frequencia: 91, notas: [4, 3.5, 5] });

// coloca os campos de nota (2 no começo) quando a página carrega
criarCamposDeNota(2);
desenharTabela();

// cria os inputs de nota no formulário de cadastro
// obs: usa a classe "form-nota-input", que é diferente da classe usada
// nas notas de dentro da tabela (isso é importante pra não misturar os dois)
function criarCamposDeNota(quantidade, valores) {
  var div = document.getElementById("notas-list");
  div.innerHTML = "";

  for (var i = 0; i < quantidade; i++) {
    var input = document.createElement("input");
    input.type = "number";
    input.className = "nota-input form-nota-input";
    input.placeholder = "Nota " + (i + 1);
    // modificação feita ao rodar o codigo e perceber a palavra 'nota' em letras minuscylas
    if (valores && valores[i] !== undefined) {
      input.value = valores[i];
    }

    div.appendChild(input);
  }
}

// botão de "adicionar nota" do formulário
// modificaçao feita no html depois de perceber a palavra 'adicionar nota' em letra minuscula
function adicionarCampoNota() {
  var inputsAtuais = document.querySelectorAll(".form-nota-input");
  var valoresAtuais = [];
  for (var i = 0; i < inputsAtuais.length; i++) {
    valoresAtuais.push(inputsAtuais[i].value);
  }
  criarCamposDeNota(valoresAtuais.length + 1, valoresAtuais);
}

// calcula a média de um array de notas
function calcularMedia(notas) {
  var soma = 0;
  for (var i = 0; i < notas.length; i++) {
    soma = soma + notas[i];
  }
  var media = soma / notas.length;
  return Math.round(media * 10) / 10; // arredonda pra 1 casa decimal
}

// define a situação do aluno com base na média e na frequência
function calcularSituacao(media, frequencia) {
  if (frequencia < 75) {
    return { chave: "reprovado", texto: "Reprovado (falta)" };
  }
  if (media >= 7) {
    return { chave: "aprovado", texto: "Aprovado" };
  }
  if (media >= 5) {
    return { chave: "recuperacao", texto: "Em Recuperação" };
  }
  return { chave: "reprovado", texto: "Reprovado" };
}

// pega o nome de um aluno pelo id (usado em vários lugares)
function buscarAlunoPeloId(id) {
  for (var i = 0; i < alunos.length; i++) {
    if (alunos[i].id === id) {
      return alunos[i];
    }
  }
  return null;
}

// salva um aluno novo, ou atualiza se estiver editando
function salvarAluno() {
  var erro = document.getElementById("erro");
  erro.textContent = "";

  var nome = document.getElementById("input-nome").value.trim();
  var frequencia = parseFloat(document.getElementById("input-freq").value);

  // ATENÇÃO: antes isso pegava ".nota-input", só que essa classe também é
  // usada nos inputs de notas dentro da tabela, então quando já tinha aluno
  // cadastrado, o cadastro pegava as notas erradas junto (vim perceber depois de 1 hora de erros e erros em sequencia), corrigido pra
  // pegar só os inputs do formulário (".form-nota-input")
  var inputsNotas = document.querySelectorAll(".form-nota-input");
  var notas = [];

  if (nome === "") {
    erro.textContent = "digite o nome do aluno";
    return;
  }

  if (isNaN(frequencia) || frequencia < 0 || frequencia > 100) {
    erro.textContent = "frequência inválida, tem que ser de 0 a 100";
    return;
  }

  for (var i = 0; i < inputsNotas.length; i++) {
    var valor = parseFloat(inputsNotas[i].value);
    if (inputsNotas[i].value === "" || isNaN(valor) || valor < 0 || valor > 10) {
      erro.textContent = "preencha todas as notas (de 0 a 10)";
      return;
    }
    notas.push(valor);
  }

  if (notas.length < 2) {
    erro.textContent = "precisa cadastrar no mínimo 2 notas";
    return;
  }

  if (idEditando !== null) {
    // é uma edição, então acha o aluno e troca os dados dele
    var aluno = buscarAlunoPeloId(idEditando);
    aluno.nome = nome;
    aluno.frequencia = frequencia;
    aluno.notas = notas;
    mostrarAviso("Aluno atualizado!");
  } else {
    // é um cadastro novo
    alunos.push({ id: proximoId++, nome: nome, frequencia: frequencia, notas: notas });
    mostrarAviso("Aluno cadastrado!");
  }

  limparFormulario();
  desenharTabela();
}

// deixa o formulário pronto pra editar um aluno que já existe
function editarAluno(id) {
  var aluno = buscarAlunoPeloId(id);
  if (!aluno) return;

  idEditando = id;
  document.getElementById("input-nome").value = aluno.nome;
  document.getElementById("input-freq").value = aluno.frequencia;
  criarCamposDeNota(aluno.notas.length, aluno.notas);
  document.getElementById("btn-cancelar").style.display = "inline";
}

// cancela a edição e limpa o formulário
function cancelarEdicao() {
  limparFormulario();
}

// deixa o formulário limpo de novo (usado depois de salvar e no cancelar)
function limparFormulario() {
  idEditando = null;
  document.getElementById("input-nome").value = "";
  document.getElementById("input-freq").value = "100";
  document.getElementById("erro").textContent = "";
  document.getElementById("btn-cancelar").style.display = "none";
  criarCamposDeNota(2);
}

// remove um aluno da lista (pede confirmação antes da açao ser cncluida)
function removerAluno(id) {
  var aluno = buscarAlunoPeloId(id);
  if (!aluno) return;

  var confirmou = confirm("Remover o aluno " + aluno.nome + "?");
  if (!confirmou) return;

  // filtra o array tirando o aluno com esse id
  var novaLista = [];
  for (var i = 0; i < alunos.length; i++) {
    if (alunos[i].id !== id) {
      novaLista.push(alunos[i]);
    }
  }
  alunos = novaLista;

  if (idEditando === id) {
    limparFormulario();
  }

  mostrarAviso("Aluno removido.");
  desenharTabela();
}

// muda o filtro e redesenha a tabela
function filtrar(situacao) {
  filtroAtual = situacao;
  desenharTabela();
}

// mostra uma mensagem rápida no rodapé da página
function mostrarAviso(texto) {
  var aviso = document.getElementById("aviso");
  aviso.textContent = texto;
  setTimeout(function () {
    aviso.textContent = "";
  }, 2500);
}

// quando o usuário muda uma nota ou a frequência direto na tabela
function alterarNotaNaTabela(id, indiceNota, valor) {
  var aluno = buscarAlunoPeloId(id);
  if (!aluno) return;

  var v = parseFloat(valor);
  if (isNaN(v)) v = 0;
  if (v < 0) v = 0;
  if (v > 10) v = 10;

  aluno.notas[indiceNota] = v;
  desenharTabela();
}

function alterarFrequenciaNaTabela(id, valor) {
  var aluno = buscarAlunoPeloId(id);
  if (!aluno) return;

  var v = parseFloat(valor);
  if (isNaN(v)) v = 0;
  if (v < 0) v = 0;
  if (v > 100) v = 100;

  aluno.frequencia = v;
  desenharTabela();
}

// essa é a função principal onde monta a tabela toda de novo e recalcula tudo
function desenharTabela() {
  var corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = "";

  // primeiro calcula a média e a situação de cada aluno
  var listaComCalculo = [];
  for (var i = 0; i < alunos.length; i++) {
    var media = calcularMedia(alunos[i].notas);
    var situacao = calcularSituacao(media, alunos[i].frequencia);
    listaComCalculo.push({ aluno: alunos[i], media: media, situacao: situacao });
  }

  // descobre quem tem a maior e a menor média (só se tiver mais de 1 aluno cadastrado no sistema)
  var idMaior = null;
  var idMenor = null;
  if (listaComCalculo.length > 1) {
    var maiorValor = listaComCalculo[0].media;
    var menorValor = listaComCalculo[0].media;
    for (var i = 0; i < listaComCalculo.length; i++) {
      if (listaComCalculo[i].media > maiorValor) maiorValor = listaComCalculo[i].media;
      if (listaComCalculo[i].media < menorValor) menorValor = listaComCalculo[i].media;
    }
    if (maiorValor !== menorValor) {
      for (var i = 0; i < listaComCalculo.length; i++) {
        if (listaComCalculo[i].media === maiorValor && idMaior === null) idMaior = listaComCalculo[i].aluno.id;
        if (listaComCalculo[i].media === menorValor && idMenor === null) idMenor = listaComCalculo[i].aluno.id;
      }
    }
  }

  // agora desenha uma linha da tabela pra cada aluno (respeitando o filtro colocado)
  for (var i = 0; i < listaComCalculo.length; i++) {
    var item = listaComCalculo[i];

    if (filtroAtual !== "todos" && item.situacao.chave !== filtroAtual) {
      continue; // pula esse aluno, ele não passa no filtro
    }

    var linha = document.createElement("tr");

    if (item.aluno.id === idMaior) linha.className = "linha-maior";
    if (item.aluno.id === idMenor) linha.className = "linha-menor";

    // coluna do nome
    var tdNome = document.createElement("td");
    var textoNome = item.aluno.nome;
    if (item.aluno.id === idMaior) textoNome += " (maior média)";
    if (item.aluno.id === idMenor) textoNome += " (menor média)";
    tdNome.textContent = textoNome;
    linha.appendChild(tdNome);

    // coluna das notas (um input pra cada nota, editável na pagina web depois de rodar o codigo)
    var tdNotas = document.createElement("td");
    for (var n = 0; n < item.aluno.notas.length; n++) {
      var inputNota = document.createElement("input");
      inputNota.type = "number";
      inputNota.className = "nota-input";
      inputNota.value = item.aluno.notas[n];
      inputNota.setAttribute("data-id", item.aluno.id);
      inputNota.setAttribute("data-indice", n);
      inputNota.onchange = function () {
        var idDoAluno = parseInt(this.getAttribute("data-id"));
        var indice = parseInt(this.getAttribute("data-indice"));
        alterarNotaNaTabela(idDoAluno, indice, this.value);
      };
      tdNotas.appendChild(inputNota);
    }
    linha.appendChild(tdNotas);

    // coluna da frequência (também editável na pagina web depois de rodar o codigo)
    var tdFreq = document.createElement("td");
    var inputFreq = document.createElement("input");
    inputFreq.type = "number";
    inputFreq.className = "nota-input";
    inputFreq.value = item.aluno.frequencia;
    inputFreq.setAttribute("data-id", item.aluno.id);
    inputFreq.onchange = function () {
      var idDoAluno = parseInt(this.getAttribute("data-id"));
      alterarFrequenciaNaTabela(idDoAluno, this.value);
    };
    tdFreq.appendChild(inputFreq);
    tdFreq.appendChild(document.createTextNode("%"));
    linha.appendChild(tdFreq);

    // coluna da média
    var tdMedia = document.createElement("td");
    tdMedia.textContent = item.media.toFixed(1);
    linha.appendChild(tdMedia);

    // coluna da situação
    var tdSituacao = document.createElement("td");
    tdSituacao.textContent = item.situacao.texto;
    tdSituacao.className = item.situacao.chave;
    linha.appendChild(tdSituacao);

    // coluna com os botões de editar e remover
    var tdAcoes = document.createElement("td");

    var botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Editar";
    // modificação feita depois de perceber os nomes (editar e remover em letras minusculas)
    botaoEditar.onclick = function () {
      // truque pra pegar o id certo dentro do loop
      var idDoAluno = parseInt(this.getAttribute("data-id"));
      editarAluno(idDoAluno);
    };
    botaoEditar.setAttribute("data-id", item.aluno.id);

    var botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";
    // modificação feita depois de perceber os nomes (editar e remover em letras minusculas)
    botaoRemover.onclick = function () {
      var idDoAluno = parseInt(this.getAttribute("data-id"));
      removerAluno(idDoAluno);
    };
    botaoRemover.setAttribute("data-id", item.aluno.id);

    tdAcoes.appendChild(botaoEditar);
    tdAcoes.appendChild(botaoRemover);
    linha.appendChild(tdAcoes);

    corpo.appendChild(linha);
  }

  // por fim, atualiza as estatísticas gerais da turma
  atualizarEstatisticas(listaComCalculo);
}

// atualiza a parte de estatísticas (média da turma, maior, menor, contadores)
function atualizarEstatisticas(listaComCalculo) {
  if (listaComCalculo.length === 0) {
    document.getElementById("media-turma").textContent = "-";
    document.getElementById("maior-media").textContent = "-";
    document.getElementById("maior-nome").textContent = "-";
    document.getElementById("menor-media").textContent = "-";
    document.getElementById("menor-nome").textContent = "-";
    document.getElementById("qtd-aprovado").textContent = 0;
    document.getElementById("qtd-recuperacao").textContent = 0;
    document.getElementById("qtd-reprovado").textContent = 0;
    return;
  }

  var somaDasMedias = 0;
  var maior = listaComCalculo[0];
  var menor = listaComCalculo[0];

  var qtdAprovado = 0;
  var qtdRecuperacao = 0;
  var qtdReprovado = 0;

  for (var i = 0; i < listaComCalculo.length; i++) {
    var item = listaComCalculo[i];
    somaDasMedias = somaDasMedias + item.media;

    if (item.media > maior.media) maior = item;
    if (item.media < menor.media) menor = item;

    if (item.situacao.chave === "aprovado") qtdAprovado++;
    if (item.situacao.chave === "recuperacao") qtdRecuperacao++;
    if (item.situacao.chave === "reprovado") qtdReprovado++;
  }

  var mediaDaTurma = Math.round((somaDasMedias / listaComCalculo.length) * 10) / 10;

  document.getElementById("media-turma").textContent = mediaDaTurma.toFixed(1);
  document.getElementById("maior-media").textContent = maior.media.toFixed(1);
  document.getElementById("maior-nome").textContent = maior.aluno.nome;
  document.getElementById("menor-media").textContent = menor.media.toFixed(1);
  document.getElementById("menor-nome").textContent = menor.aluno.nome;

  document.getElementById("qtd-aprovado").textContent = qtdAprovado;
  document.getElementById("qtd-recuperacao").textContent = qtdRecuperacao;
  document.getElementById("qtd-reprovado").textContent = qtdReprovado;
}
