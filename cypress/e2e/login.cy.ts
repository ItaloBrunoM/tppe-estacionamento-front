/// <reference types="cypress" />

describe("teste de login", () => {
    it('logando com usuário x', () => {
        cy.visit('http://localhost:3000/login');
        cy.log('entrei na pagina.');
    });
}) 