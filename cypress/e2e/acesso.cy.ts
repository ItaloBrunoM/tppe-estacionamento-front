describe("Fluxo Simplificado de Acesso (Entrada e Saída)", () => {

  beforeEach(() => {
    cy.loginComoAdmin();
    cy.visit("/");
  });

  it("Deve simular o registro de entrada e saída de um veículo através da UI", () => {
    const placaVeiculo = `SIMPL${Cypress._.random(0, 1e4)}`; 

    cy.log("Navegando para a aba de Acesso via Sidebar");
    cy.contains("a", "REGISTRO DE ENTRADA/SAÍDA").click(); 
    cy.url().should("include", "/acesso"); 

    cy.log("Digitando a placa do veículo");
    cy.get('input[placeholder="Ex: XYX1111"]') 
      .should("be.visible") 
      .type(placaVeiculo); 

    cy.log('Clicando em "Marcar Acesso"');
    cy.get("button")
      .contains("Marcar Acesso") 
      .should("be.visible") 
      .click(); 

    cy.log('Clicando em "Registrar Saída" para a placa');
    cy.contains("ul.list li span", placaVeiculo)
      .should("be.visible")
      .parents("li")
      .find("button")
      .contains("Registrar Saída")
      .should("be.visible")
      .click();
  });
});
