new Vue({
    el: '#app',
    data: {
        currentSection: 'home',
        eventos: [],
        ingressos: [],
        novoEvento: {
            nome: '',
            data: '',
            local: '',
            descricao: '',
            valorIngresso: 0
        },
        novoIngresso: {
            evento: '',
            tipo: '',
            quantidade: 0
        },
        tipoRelatorio: 'financeiro',
        relatorio: '',
        nextEventId: 1,
        nextIngressoId: 1
    },
    methods: {
        showSection(sectionId) {
            this.currentSection = sectionId;
        },
        criarEvento() {
            const novoEvento = {
                id: this.nextEventId++,
                ...this.novoEvento,
                valorIngresso: parseFloat(this.novoEvento.valorIngresso)
            };
            this.eventos.push(novoEvento);
            this.novoEvento = {
                nome: '',
                data: '',
                local: '',
                descricao: '',
                valorIngresso: 0
            };
            alert('Evento criado com sucesso!');
        },
        gerarIngressos() {
            const eventoSelecionado = this.eventos.find(e => e.id === this.novoIngresso.evento);
            if (!eventoSelecionado) {
                alert('Por favor, selecione um evento válido.');
                return;
            }
            const novoIngresso = {
                id: this.nextIngressoId++,
                ...this.novoIngresso,
                evento: eventoSelecionado
            };
            this.ingressos.push(novoIngresso);
            this.novoIngresso = {
                evento: '',
                tipo: '',
                quantidade: 0
            };
            alert('Ingressos gerados com sucesso!');
        },
        gerarRelatorio() {
            if (this.tipoRelatorio === 'financeiro') {
                const totalVendas = this.ingressos.reduce((total, ingresso) => {
                    return total + (ingresso.evento.valorIngresso * ingresso.quantidade);
                }, 0);
                this.relatorio = `Relatório Financeiro:\nTotal de vendas: R$ ${totalVendas.toFixed(2)}`;
            } else {
                const totalParticipantes = this.ingressos.reduce((total, ingresso) => {
                    return total + ingresso.quantidade;
                }, 0);
                this.relatorio = `Relatório de Participantes:\nTotal de participantes: ${totalParticipantes}`;
            }
        },
        editarEvento(evento) {
            const novoNome = prompt('Novo nome do evento:', evento.nome);
            if (novoNome) {
                evento.nome = novoNome;
                alert('Evento atualizado com sucesso!');
            }
        },
        excluirEvento(evento) {
            if (confirm(`Tem certeza que deseja excluir o evento "${evento.nome}"?`)) {
                this.eventos = this.eventos.filter(e => e.id !== evento.id);
                this.ingressos = this.ingressos.filter(i => i.evento.id !== evento.id);
                alert('Evento excluído com sucesso!');
            }
        },
        editarIngresso(ingresso) {
            const novaQuantidade = prompt('Nova quantidade de ingressos:', ingresso.quantidade);
            if (novaQuantidade) {
                ingresso.quantidade = parseInt(novaQuantidade, 10);
                alert('Ingresso atualizado com sucesso!');
            }
        },
        excluirIngresso(ingresso) {
            if (confirm(`Tem certeza que deseja excluir os ingressos do tipo "${ingresso.tipo}"?`)) {
                this.ingressos = this.ingressos.filter(i => i.id !== ingresso.id);
                alert('Ingressos excluídos com sucesso!');
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('pt-BR');
        }
    }
});