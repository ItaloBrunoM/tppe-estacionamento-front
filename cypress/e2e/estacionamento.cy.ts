describe('Fluxo de Gerenciamento de Estacionamentos', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('POST', '/api/token').as('loginRequest');
    cy.contains('button', 'Entrar').click();
    cy.get('input[placeholder="Digite seu usuário"]').type('admin');
    cy.get('input[placeholder="Digite sua senha"]').type('admin123');
    cy.contains('button', 'ENTRAR').click();
    cy.wait('@loginRequest');
  });

  it('Deve criar um novo estacionamento com sucesso, tratando nomes duplicados', () => {
    cy.contains('a.sidebar-link', 'ESTACIONAMENTO').click();
    cy.wait(500);

    const attemptToCreateEstacionamento = (attempt: number) => {
      const nomeEstacionamento = `Estacionamento de Teste #${attempt}`;

      cy.intercept('POST', '/api/estacionamentos/').as('createEstacionamento');
      cy.intercept('GET', '/api/estacionamentos/').as('getEstacionamentosAtualizado');

      cy.contains('button', 'CRIAR ESTACIONAMENTO').click();
      
      cy.get('input[placeholder="Ex: EasyPark"]').clear().type(nomeEstacionamento);
      cy.get('input[placeholder="Ex: AV. 123, numero 23"]').clear().type('Rua da Retentativa Final');
      cy.get('input[placeholder="Ex: 123"]').clear().type('250');
      cy.get('input[placeholder="Ex: 15.00"]').type('20');
      cy.get('input[placeholder="Ex: 5.00"]').type('9');
      cy.get('input[placeholder="Ex: 35.00"]').type('40');
      
      cy.contains('button', 'Salvar').click();
      
      cy.wait('@createEstacionamento').then((interception) => {
        if (interception.response?.statusCode === 409) {
          cy.log(`Nome duplicado encontrado (tentativa ${attempt}). Tentando novamente...`);
          cy.get('.modal-overlay .btn-cancelar').click();
          attemptToCreateEstacionamento(attempt + 1);
        } else {
          cy.log('Estacionamento criado com sucesso na API!');
          cy.wait('@getEstacionamentosAtualizado');
          cy.contains(nomeEstacionamento).should('be.visible');
        }
      });
    };

    attemptToCreateEstacionamento(1);
  });
});