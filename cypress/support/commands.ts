/// <reference types="cypress" />

// Adicionamos a tipagem para o nosso novo comando
declare module "cypress" {
  interface Chainable {
    loginComoAdmin(): Chainable;
  }
}

// -- Este é o comando customizado --
Cypress.Commands.add("loginComoAdmin", () => {
  cy.log("Executando login como Administrador...");

  cy.intercept("POST", "/api/token").as("loginRequest");

  cy.visit("/");
  cy.contains("button", "Entrar").click();

  cy.contains("h2", "Login").should("be.visible");

  cy.get('input[placeholder="Digite seu usuário"]').type("admin");
  cy.get('input[placeholder="Digite sua senha"]').type("admin");
  cy.contains("button", "ENTRAR").click();

  return cy.wait("@loginRequest").then((interception) => {
    return interception.response?.body?.access_token;
  });
});
