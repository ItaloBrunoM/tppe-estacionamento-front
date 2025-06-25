/// <reference types="cypress" />

describe("Fluxo de Login e Logout", () => {
  it("Deve logar e deslogar corretamente", () => {
    cy.visit("/");
    cy.contains("button", "Entrar").click();
    cy.get('input[placeholder="Digite seu usuário"]').click().type("admin");
    cy.get('input[placeholder="Digite sua senha"]').click().type("admin");
    cy.contains("button", "ENTRAR").click();

    cy.contains("button", "admin").click();

    cy.contains("button", "Sair").click();

    cy.contains("button", "Confirmar").click();

    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.contains("button", "Entrar").should("be.visible");
  });
});
