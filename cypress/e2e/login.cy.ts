/// <reference types="cypress" />

describe("Fluxo de Login e Logout", () => {
  it("Deve logar e deslogar corretamente", () => {
    cy.visit("/");
    cy.contains("button", "Entrar").click();
    cy.get('input[placeholder="Digite seu usuário"]').click().type("admin");
    cy.get('input[placeholder="Digite sua senha"]').click().type("admin");
    cy.contains("button", "ENTRAR").click();

    cy.contains("button", "admin").click();

    // Deve aparecer botão "Sair", clica nele
    cy.contains("button", "Sair").click();

    // Confirma o logout clicando em "Confirmar"
    cy.contains("button", "Confirmar").click();

    // Verifica se voltou para a tela inicial (login)
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    // ou se quiser só garantir que tem o botão entrar de novo:
    cy.contains("button", "Entrar").should("be.visible");
  });
});
