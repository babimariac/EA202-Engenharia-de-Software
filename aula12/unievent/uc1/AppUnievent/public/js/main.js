new Vue({
    el: '#app',
    data: {
        currentSection: 'home',
        eventos: [],
        ingressos: [],
    },
    methods: {
        showSection(sectionId) {
            if (sectionId === 'eventos') {
                // Redireciona para a página de seleção de eventos
                window.location.href = 'seleção_de_eventos.html';
            } else {
                this.currentSection = sectionId;
                document.querySelectorAll('main section').forEach(section => {
                    section.style.display = section.id === sectionId ? 'block' : 'none';
                });
            }
        },
        criarEvento(event) {
            event.preventDefault();
            // Implementar lógica para criar evento
            console.log('Criar evento');
        },
        gerarIngressos(event) {
            event.preventDefault();
            // Implementar lógica para gerar ingressos
            console.log('Gerar ingressos');
        },
        gerarRelatorio() {
            // Implementar lógica para gerar relatório
            console.log('Gerar relatório');
        }
    },
    mounted() {
        // Adicionar event listeners
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const sectionId = event.target.getAttribute('href').slice(1);
                this.showSection(sectionId);
            });
        });

        document.getElementById('evento-form').addEventListener('submit', this.criarEvento);
        document.getElementById('ingresso-form').addEventListener('submit', this.gerarIngressos);
        document.getElementById('gerar-relatorio').addEventListener('click', this.gerarRelatorio);
    }
});