// ===================================================================
//              1. DADOS DE CONFIGURAÇÃO (Global)
// ===================================================================

const alunos = [
  { email: "aluno1@escola.com", senha: "senha1" },
  { email: "aluno2@escola.com", senha: "senha2" },
  { email: "aluno3@escola.com", senha: "senha3" }
];

// ===================================================================
//          2. FUNÇÕES GLOBAIS (Logout e Renderização)
// ===================================================================

function logout() {
  localStorage.removeItem("usuarioSalvo");
  window.location.href = 'login.html';
}

function renderizarTabelaDocumentos() { } // Funções dummy

// ===================================================================
//  3. LÓGICA DE LOGIN E INICIALIZAÇÃO (Executa após o DOM carregar)
// ===================================================================

document.addEventListener("DOMContentLoaded", function () {
  // ===================================================================
  // LIMPAR STATUS AO REINICIAR O SERVIDOR OU RECARREGAR O PROJETO
  // ===================================================================
  if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    localStorage.removeItem('status_atividade_historia');
  }

  // Também limpa se o Live Server for fechado e reaberto (nova sessão)
  if (!sessionStorage.getItem('sessaoIniciada')) {
    localStorage.removeItem('status_atividade_historia');
    sessionStorage.setItem('sessaoIniciada', 'true');
  }

  const form = document.getElementById("formLogin");


  // ===================================================================
  // -- INÍCIO DA LÓGICA DE PAINEL (Não é a tela de login) --
  // ===================================================================
  if (!form) {
    renderizarTabelaDocumentos();

    // ---------------------------------------------------------------
    // VARIÁVEIS COMUNS (DECLARADAS NO TOPO DO ESCOPO)
    // ---------------------------------------------------------------
    const statusTag = document.querySelector('.atividade-header .tag');
    const blocoTarefas = document.querySelector('.bloco-tarefas');
    const btnAdicionarArquivo = document.querySelector('.btn-adicionar-arquivo');
    const btnMarcarConcluido = document.querySelector('.btn-marcar-concluido');

    const botoesRealizar = document.querySelectorAll(".btn-realizar");
    const btnTodasAtividades = document.querySelector(".btn-todas-atividades");
    const btnVerMais = document.querySelector(".btn-ver-mais");
    const listaAulas = document.querySelector(".lista-aulas");
    const botoesDetalhes = document.querySelectorAll(".btn-detalhes");


    // ===================================================================
    //       4 e 5. LÓGICA DE TROCA DE ABAS (Conteúdos/Atividades)
    // *CORRIGIDO: Estrutura da função e lógica de inicialização*
    // ===================================================================

    // ====================
    //  Abas Notas e Faltas
    // ====================
    document.querySelectorAll('.aba').forEach(botao => {
      botao.addEventListener('click', () => {
        const targetId = botao.getAttribute('data-target');

        // Remove ativo das abas
        document.querySelectorAll('.aba').forEach(b => b.classList.remove('aba-active'));
        botao.classList.add('aba-active');

        // Esconde todos os painéis
        document.querySelectorAll('.aba-content').forEach(p => p.style.display = 'none');

        // Mostra o painel selecionado
        document.getElementById(targetId).style.display = 'block';
      });
    });

    // Mostra automaticamente o painel inicial (Notas por matéria)
    const abaAtiva = document.querySelector('.aba.aba-active');
    if (abaAtiva) {
      const target = abaAtiva.getAttribute('data-target');
      const painelInicial = document.getElementById(target);
      if (painelInicial) painelInicial.style.display = 'block';
    }

    const abasControle = document.querySelectorAll('.abas-container .aba');
    const conteudosControle = document.querySelectorAll('.aba-content');

    if (abasControle.length > 0 && conteudosControle.length > 0) {
      // Lógica de Troca de Abas
      function trocarAbaConteudo(event) {
        const botaoClicado = event.currentTarget;
        const targetId = botaoClicado.getAttribute('data-target');

        abasControle.forEach(aba => aba.classList.remove('aba-active'));
        conteudosControle.forEach(conteudo => conteudo.style.display = 'none');

        botaoClicado.classList.add('aba-active');

        const conteudoAlvo = document.getElementById(targetId);
        if (conteudoAlvo) {
          conteudoAlvo.style.display = 'grid';
        }

        // Salva o ID da aba ativa no localStorage
        localStorage.setItem('abaAtivaContEatv', targetId);
      }

      abasControle.forEach(aba => {
        aba.addEventListener('click', trocarAbaConteudo);
      });

      // --- Lógica de Inicialização Aprimorada (Carrega do localStorage) ---
      const abaSalva = localStorage.getItem('abaAtivaContEatv');
      let abaParaAtivar = abaSalva;

      // Se não houver aba salva, usa o padrão 'atividades-tarefas' ou o 'aba-active' do HTML.
      if (!abaSalva) {
        // Tenta pegar o padrão do HTML, senão assume 'conteudos-aulas'
        abaParaAtivar = document.querySelector('.abas-container .aba-active')?.getAttribute('data-target') || 'conteudos-aulas';
      }

      const abaAtivaInicial = document.querySelector(`.abas-container button[data-target="${abaParaAtivar}"]`);
      const conteudoAtivoInicial = document.getElementById(abaParaAtivar);

      // Garante que todos os conteúdos sejam inicialmente escondidos
      conteudosControle.forEach(conteudo => {
        conteudo.style.display = 'none';
        // Remove a classe 'aba-active' de todos os botões por segurança
        document.querySelector(`.abas-container button[data-target="${conteudo.id}"]`)?.classList.remove('aba-active');
      });

      // Ativa e mostra a aba correta (salva ou padrão)
      if (abaAtivaInicial && conteudoAtivoInicial) {
        abaAtivaInicial.classList.add('aba-active');
        conteudoAtivoInicial.style.display = 'grid';
      }
    }
    // FIM DA SEÇÃO 4 e 5

    // ===================================================================
    //      6. LÓGICA DE COMENTÁRIOS (Botão "Adicionar Comentário")
    // ===================================================================

    const botoesComentario = document.querySelectorAll(".btn-adicionar-comentario");
    botoesComentario.forEach(botao => {
      botao.addEventListener("click", function () {
        if (botao.classList.contains("ativo")) return;
        botao.classList.add("ativo");
        botao.style.display = "none";
        const container = document.createElement("div");
        container.classList.add("comentario-input-container");
        const textarea = document.createElement("textarea");
        textarea.classList.add("comentario-textarea");
        textarea.placeholder = "Escreva seu comentário aqui...";
        const grupoBotoes = document.createElement("div");
        grupoBotoes.classList.add("comentario-botoes-grupo");
        const btnSalvar = document.createElement("button");
        btnSalvar.classList.add("btn-salvar-comentario");
        btnSalvar.textContent = "Salvar";
        const btnCancelar = document.createElement("button");
        btnCancelar.classList.add("btn-cancelar-comentario");
        btnCancelar.textContent = "Cancelar";
        grupoBotoes.appendChild(btnCancelar);
        grupoBotoes.appendChild(btnSalvar);
        container.appendChild(textarea);
        container.appendChild(grupoBotoes);
        botao.parentNode.insertBefore(container, botao);

        btnCancelar.addEventListener("click", () => {
          container.remove();
          botao.classList.remove("ativo");
          botao.style.display = "block";
        });

        btnSalvar.addEventListener("click", () => {
          const texto = textarea.value.trim();
          if (texto === "") {
            alert("Digite um comentário antes de salvar!");
            return;
          }
          const comentarioSalvo = document.createElement("div");
          comentarioSalvo.classList.add("comentario-salvo");
          comentarioSalvo.style.padding = "10px 0";
          comentarioSalvo.style.borderBottom = "1px solid var(--line)";
          comentarioSalvo.innerHTML = `<p style="font-size:14px; color:var(--text-primary); margin:0; word-wrap: break-word;">${texto}</p>`;
          botao.parentNode.insertBefore(comentarioSalvo, botao);
          container.remove();
          botao.classList.remove("ativo");
          botao.style.display = "block";
        });
      });
    });

    // ===================================================================
    //       7. LÓGICA DA PÁGINA DE DETALHE DE ATIVIDADE (acessarAtividades.html)
    // ===================================================================

    // Funções de Inicialização (Definida e executada APENAS se estiver na página)
    function carregarStatusDetalhe() {
      const status = localStorage.getItem('status_atividade_historia');

      // Se o status for 'entregue' ou 'concluido', sobrescreve o status do HTML
      if (status && statusTag) {
        statusTag.classList.remove('tag-pendente', 'tag-entregue', 'tag-concluido');

        if (status === 'entregue') {
          statusTag.textContent = "Entregue";
          statusTag.classList.add('tag-entregue');
          if (btnMarcarConcluido) btnMarcarConcluido.disabled = false;
        } else if (status === 'concluido') {
          statusTag.textContent = "Concluído";
          statusTag.classList.add('tag-concluido');
          if (btnMarcarConcluido) {
            btnMarcarConcluido.textContent = "Concluída";
            btnMarcarConcluido.disabled = true;
            btnMarcarConcluido.style.backgroundColor = "var(--tag-concluido-text)";
          }
        }

        // Oculta o botão 'Adicionar' se já estiver entregue/concluído
        if (status !== 'pendente' && btnAdicionarArquivo) {
          btnAdicionarArquivo.textContent = "Arquivo Enviado";
          btnAdicionarArquivo.disabled = true;
          // Opcional: Adicionar aqui a exibição do nome do arquivo salvo anteriormente, se houver.
        }
      }
    }

    // --- LÓGICA DA PÁGINA DE DETALHE DE ATIVIDADE (acessarAtividades.html) ---
    if (btnAdicionarArquivo) {

      // Carrega status previamente salvo (mantém sua lógica)
      const statusSalvo = localStorage.getItem('status_atividade_historia');
      if (statusSalvo === 'entregue' || statusSalvo === 'concluido') {
        if (statusTag) {
          statusTag.textContent = statusSalvo === 'entregue' ? 'Entregue' : 'Concluído';
          statusTag.classList.remove('tag-pendente', 'tag-entregue', 'tag-concluido');
          statusTag.classList.add(statusSalvo === 'entregue' ? 'tag-entregue' : 'tag-concluido');
        }
        btnAdicionarArquivo.textContent = "Arquivo Enviado";
        btnAdicionarArquivo.disabled = true;
        if (btnMarcarConcluido) {
          if (statusSalvo === 'concluido') {
            btnMarcarConcluido.textContent = "Concluída";
            btnMarcarConcluido.disabled = true;
            btnMarcarConcluido.style.backgroundColor = "var(--tag-concluido-text)";
          } else {
            btnMarcarConcluido.disabled = false;
          }
        }
      }

      // Aqui: cria o input file QUANDO o usuário clicar no botão
      btnAdicionarArquivo.addEventListener('click', function () {
        const seletor = document.createElement('input');
        seletor.type = 'file';
        seletor.accept = '*/*';

        seletor.addEventListener('change', function () {
          if (seletor.files.length > 0) {
            const nomeArquivo = seletor.files[0].name;
            localStorage.setItem('status_atividade_historia', 'entregue');
            alert(`Arquivo "${nomeArquivo}" enviado com sucesso!`);

            btnAdicionarArquivo.textContent = "Arquivo Enviado";
            btnAdicionarArquivo.disabled = true;

            if (statusTag) {
              statusTag.textContent = "Entregue";
              statusTag.classList.remove('tag-pendente', 'tag-concluido');
              statusTag.classList.add('tag-entregue');
            }

            if (btnMarcarConcluido) {
              btnMarcarConcluido.disabled = false;
            }

            const arquivoInfo = document.createElement('p');
            arquivoInfo.classList.add('arquivo-info');
            arquivoInfo.textContent = `📎 ${nomeArquivo}`;
            arquivoInfo.style.marginTop = "10px";
            arquivoInfo.style.fontSize = "14px";
            arquivoInfo.style.color = "var(--text-secondary)";
            blocoTarefas.appendChild(arquivoInfo);
          }
        });

        // abre o seletor de arquivo
        seletor.click();
      });

      // botão de "Marcar Concluído" (mantive sua lógica)
      if (btnMarcarConcluido) {
        btnMarcarConcluido.addEventListener('click', function () {
          btnMarcarConcluido.textContent = "Concluída";
          btnMarcarConcluido.disabled = true;
          btnMarcarConcluido.style.backgroundColor = "var(--tag-concluido-text)";

          if (statusTag) {
            statusTag.textContent = "Concluído";
            statusTag.classList.remove('tag-pendente', 'tag-entregue');
            statusTag.classList.add('tag-concluido');
          }

          localStorage.setItem('status_atividade_historia', 'concluido');
          alert("Atividade marcada como Concluída! Você pode navegar de volta para a lista.");
        });
      }

    } // fim if (btnAdicionarArquivo)


    // ===================================================================
    //       8. BOTÃO "ACESSAR TODAS AS ATIVIDADES"
    // ===================================================================

    if (btnTodasAtividades) {
      btnTodasAtividades.addEventListener("click", () => {
        // CORRIGIDO: Caminho relativo
        window.location.href = "contEatv.html";
      });
    }


    // ===================================================================
    //       9. BOTÕES DE NAVEGAÇÃO DE CARD (Na página de Listagem)
    // ===================================================================

    // Botão "Realizar tarefa"
    if (botoesRealizar.length > 0) {
      botoesRealizar.forEach(botao => {
        botao.addEventListener("click", () => {
          // CORRIGIDO: Caminho relativo
          window.location.href = "acessarAtividades.html";
        });
      });
    }

    // Botão "Ver detalhes"
    if (botoesDetalhes.length > 0) {
      botoesDetalhes.forEach(botao => {
        botao.addEventListener("click", () => {
          // CORRIGIDO: Caminho relativo
          window.location.href = "acessarAtividades.html";
        });
      });
    }


    // ===================================================================
    //       10. BOTÃO "VER TODOS OS TÓPICOS"
    // ===================================================================

    if (btnVerMais && listaAulas) {
      btnVerMais.addEventListener("click", () => {
        if (btnVerMais.classList.contains("expandido")) {
          const aulas = listaAulas.querySelectorAll(".topico-aula");
          aulas.forEach((aula, i) => {
            if (i >= 3) aula.style.display = "none";
          });
          btnVerMais.textContent = "Ver todos os 7 tópicos";
          btnVerMais.classList.remove("expandido");
        } else {
          const aulasExtras = [
            "Aula 4: Conflitos na Ásia e África",
            "Aula 5: O Fim da União Soviética",
            "Aula 6: A Queda do Muro de Berlim",
            "Aula 7: O Legado da Guerra Fria"
          ];
          const aulasExistentes = listaAulas.querySelectorAll(".topico-aula").length;
          if (aulasExistentes < 7) {
            aulasExtras.forEach(texto => {
              const p = document.createElement("p");
              p.classList.add("topico-aula");
              p.innerHTML = `<i class='bx bx-check-circle'></i> ${texto}`;
              listaAulas.insertBefore(p, btnVerMais);
            });
          } else {
            const aulas = listaAulas.querySelectorAll(".topico-aula");
            aulas.forEach(aula => aula.style.display = "flex");
          }
          btnVerMais.textContent = "Mostrar menos";
          btnVerMais.classList.add("expandido");
        }
      });
    }

    // ===================================================================
    //       11. CARREGAMENTO DO STATUS DA ATIVIDADE NA LISTAGEM
    // ===================================================================
    function aplicarStatusConcluido() {
      const atividadesGrid = document.getElementById('atividades-tarefas');
      if (!atividadesGrid) return;

      const statusHistoria = localStorage.getItem('status_atividade_historia');

      // Se o status for 'entregue' OU 'concluido', o card deve ser atualizado
      if (statusHistoria === 'entregue' || statusHistoria === 'concluido') {
        const cardHistoria = atividadesGrid.querySelector('.atividade-card.pendente');

        if (cardHistoria) {
          // 1. Mudar classe do card
          cardHistoria.classList.remove('pendente');
          cardHistoria.classList.add('completa');

          // 2. Atualiza a TAG de status
          const tag = cardHistoria.querySelector('.tag');

          // Determina o texto e a classe da tag com base no status
          if (statusHistoria === 'entregue') {
            tag.textContent = 'Entregue';
            tag.classList.remove('tag-pendente', 'tag-concluido');
            tag.classList.add('tag-entregue');
          } else if (statusHistoria === 'concluido') {
            tag.textContent = 'Concluído';
            tag.classList.remove('tag-pendente', 'tag-entregue');
            tag.classList.add('tag-concluido');
          }

          // 3. Atualiza o botão para "Ver detalhes"
          const botao = cardHistoria.querySelector('.btn-realizar');
          if (botao) {
            botao.textContent = 'Ver detalhes';
            botao.classList.remove('btn-realizar');
            botao.classList.add('btn-detalhes');
          }
        }
      }
    }
    aplicarStatusConcluido();

  } else {
    alert("Email ou senha incorretos!");
    senhaInput.style.border = "2px solid red";
  }

}); // Fim do DOMContentLoaded

