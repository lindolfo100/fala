document.addEventListener('DOMContentLoaded', () => {

    // --- PARTE 1: FUNÇÃO DE FALA (TEXT-TO-SPEECH) ---
    const cartoesDeComunicacao = document.querySelectorAll('#comunicacao .cartao');
    const tarefasDaAgenda = document.querySelectorAll('#agenda .cartao-tarefa');

    // Função que "fala" o texto
    function falar(texto) {
        // Cancela qualquer fala anterior para não sobrepor
        window.speechSynthesis.cancel();

        // Cria a mensagem para ser falada
        const mensagem = new SpeechSynthesisUtterance(texto);
        
        // Define a língua para Português do Brasil
        mensagem.lang = 'pt-BR';
        mensagem.rate = 1.0; // Velocidade da fala (1 é normal)
        
        // Pede ao navegador para falar a mensagem
        window.speechSynthesis.speak(mensagem);
    }

    // Adiciona o evento de clique a todos os cartões de comunicação
    cartoesDeComunicacao.forEach(cartao => {
        cartao.addEventListener('click', () => {
            // Pega o texto do atributo "data-texto"
            const textoParaFalar = cartao.dataset.texto;
            if (textoParaFalar) {
                falar(textoParaFalar);
            }
        });
    });

    // Adiciona o evento de clique a todos os cartões de tarefa (OPCIONAL, mas útil)
    tarefasDaAgenda.forEach(cartao => {
        cartao.addEventListener('click', () => {
            const textoParaFalar = cartao.dataset.texto;
            if (textoParaFalar) {
                falar(textoParaFalar);
            }
        });
    });

    // --- PARTE 2: ARRASTAR E SOLTAR (DRAG AND DROP) ---
    const quadroComunicacao = document.getElementById('quadro-comunicacao');
    const listaManha = document.getElementById('lista-manha');
    const listaTarde = document.getElementById('lista-tarde');
    const listaNoite = document.getElementById('lista-noite');

    // Configuração para o quadro de comunicação
    new Sortable(quadroComunicacao, {
        group: 'comunicacao', // Nome do grupo
        animation: 150, // Animação suave
        ghostClass: 'sortable-ghost' // Classe CSS para o "fantasma" do item
    });

    // Configuração para as listas da agenda (mesmo grupo para permitir mover entre elas)
    const configAgenda = {
        group: 'agenda', // Todas as colunas da agenda compartilham este grupo
        animation: 150,
        ghostClass: 'sortable-ghost'
    };

    new Sortable(listaManha, configAgenda);
    new Sortable(listaTarde, configAgenda);
    new Sortable(listaNoite, configAgenda);

    // --- PARTE 3: LÓGICA DA CONVERSA GUIADA ---
    const perguntaTexto = document.getElementById('pergunta-texto');
    const respostasContainer = document.getElementById('respostas-container');
    const feedbackTexto = document.getElementById('feedback-texto');
    const proximaPerguntaBtn = document.getElementById('proxima-pergunta');

    const cenariosConversa = [
        {
            pergunta: "Uma pessoa diz: 'Oi, tudo bem?'",
            opcoes: ["Tudo bem!", "Tchau", "Maçã"],
            respostaCorreta: "Tudo bem!"
        },
        {
            pergunta: "Alguém pergunta: 'Qual é o seu nome?'",
            opcoes: ["Obrigado", "Meu nome é Leo", "Eu gosto de brincar"],
            respostaCorreta: "Meu nome é Leo"
        },
        {
            pergunta: "Você quer agradecer por um presente. O que você diz?",
            opcoes: ["Por favor", "De nada", "Muito obrigado"],
            respostaCorreta: "Muito obrigado"
        },
        {
            pergunta: "É hora de ir embora. O que você fala para se despedir?",
            opcoes: ["Oi!", "Tchau!", "Com licença"],
            respostaCorreta: "Tchau!"
        }
    ];

    let cenarioAtual = 0;
    let respostaDada = false;

    function carregarCenario(index) {
        respostaDada = false;
        const cenario = cenariosConversa[index];

        // Atualiza a pergunta e a lê em voz alta
        perguntaTexto.textContent = cenario.pergunta;
        falar(cenario.pergunta);

        // Limpa as respostas anteriores e o feedback
        respostasContainer.innerHTML = '';
        feedbackTexto.textContent = '';
        proximaPerguntaBtn.classList.add('hidden');

        // Cria e adiciona os botões de resposta
        cenario.opcoes.forEach(opcao => {
            const botao = document.createElement('button');
            botao.textContent = opcao;
            botao.className = 'botao-resposta';
            botao.addEventListener('click', handleResposta);
            respostasContainer.appendChild(botao);
        });
    }

    function handleResposta(evento) {
        if (respostaDada) return; // Impede múltiplos cliques
        respostaDada = true;

        const botaoClicado = evento.target;
        const respostaSelecionada = botaoClicado.textContent;
        const cenario = cenariosConversa[cenarioAtual];

        // Desativa todos os botões após a escolha
        const todosBotoes = respostasContainer.querySelectorAll('.botao-resposta');
        todosBotoes.forEach(b => b.disabled = true);

        if (respostaSelecionada === cenario.respostaCorreta) {
            botaoClicado.classList.add('correto');
            feedbackTexto.textContent = "Isso mesmo! Muito bem!";
            falar("Isso mesmo!");
        } else {
            botaoClicado.classList.add('errado');
            feedbackTexto.textContent = `Quase! A resposta certa era: "${cenario.respostaCorreta}"`;
            falar(`A resposta certa é: ${cenario.respostaCorreta}`);
            // Mostra qual era a resposta correta
            todosBotoes.forEach(b => {
                if (b.textContent === cenario.respostaCorreta) {
                    b.classList.add('correto');
                }
            });
        }

        // Mostra o botão para ir para a próxima pergunta
        proximaPerguntaBtn.classList.remove('hidden');
    }

    proximaPerguntaBtn.addEventListener('click', () => {
        cenarioAtual++;
        // Se chegar ao fim, volta para o início
        if (cenarioAtual >= cenariosConversa.length) {
            cenarioAtual = 0;
        }
        carregarCenario(cenarioAtual);
    });

    // Inicia o primeiro cenário de conversa
    carregarCenario(cenarioAtual);
});
