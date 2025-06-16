describe("teste de login", () => {
    it('logando com usuário x', () => {
        cy.visit('localhost:8080/login');
        cy.log('entrei na pagina.');
    });
}) 