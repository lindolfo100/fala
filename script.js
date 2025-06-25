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

});
