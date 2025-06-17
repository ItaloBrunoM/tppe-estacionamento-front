interface Estacionamento {
    id: number;
    nome: string;
    total_vagas: number;
    endereco?: string | null;
    valor_primeira_hora?: number | null;
    valor_demais_horas?: number | null;
    valor_diaria?: number | null;
  }
  
  describe('Fluxo de Gerenciamento de Estacionamentos', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/estacionamentos/', {
        statusCode: 200,
        body: [],
      }).as('getEstacionamentosVazio');
  
      cy.intercept('POST', '/api/estacionamentos/').as('createEstacionamento');
    });
  
    it('Deve criar um novo estacionamento com sucesso', () => {
      cy.visit('/estacionamentos');
      cy.wait('@getEstacionamentosVazio'); // Espera a chamada inicial terminar
  
      cy.contains('button', 'CRIAR ESTACIONAMENTO').click();
  
      const nomeEstacionamento = 'Estacionamento Cypress TS';
      cy.get('input[placeholder="Ex: EasyPark"]').type(nomeEstacionamento);
      cy.get('input[placeholder="Ex: AV. 123, numero 23"]').type('Rua do Teste, 456');
      cy.get('input[placeholder="Ex: 123"]').type('200');
      cy.get('input[placeholder="Ex: 15.00"]').type('20.00');
      cy.get('input[placeholder="Ex: 5.00"]').type('20.00');
      cy.get('input[placeholder="Ex: 35.00"]').type('20.00');
  
      const estacionamentoCriado: Estacionamento = {
        id: 1,
        nome: nomeEstacionamento,
        total_vagas: 200,
        endereco: 'Rua do Teste, 456',
        valor_primeira_hora: 20.00,
        valor_demais_horas: null,
        valor_diaria: null
      };
  
      cy.intercept('GET', '/api/estacionamentos/', {
        statusCode: 200,
        body: [estacionamentoCriado], // Retorna uma lista com o novo item
      }).as('getEstacionamentosAtualizado');
  
      cy.contains('button', 'Salvar').click();
  
      cy.wait('@createEstacionamento').its('request.body').should('deep.include', {
        nome: nomeEstacionamento,
        total_vagas: 200,
        valor_primeira_hora: 20,
      });
  
      cy.wait('@getEstacionamentosAtualizado');
  
      cy.contains(nomeEstacionamento).should('be.visible');
    });
  });