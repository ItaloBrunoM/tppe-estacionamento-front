interface Estacionamento {
  id: number;
  nome: string;
  total_vagas: number;
  endereco?: string | null;
  valor_primeira_hora?: number | null;
  valor_demais_horas?: number | null;
  valor_diaria?: number | null;
}

describe("Fluxo de Gerenciamento de Estacionamentos", () => {
  beforeEach(() => {
    cy.visit("/");

    // Fluxo de login
    cy.contains("button", "Entrar").click();
    cy.get('input[placeholder="Digite seu usuário"]').type("admin");
    cy.get('input[placeholder="Digite sua senha"]').type("admin123");
    cy.contains("button", "ENTRAR").click();

    // Interceptações
    cy.intercept("GET", "/api/estacionamentos/", {
      statusCode: 200,
      body: [],
    }).as("getEstacionamentosVazio");

    cy.intercept("POST", "/api/estacionamentos/").as("createEstacionamento");
  });

  it("Deve criar um novo estacionamento com sucesso", () => {
    // Clica no botão "ESTACIONAMENTO" (após login)
    cy.contains("a.sidebar-link", "ESTACIONAMENTO").click();

    // Aguarda chamada inicial
    cy.wait("@getEstacionamentosVazio");

    // Inicia criação
    cy.contains("button", "CRIAR ESTACIONAMENTO").click();

    const nomeEstacionamento = "Estacionamento Cypress TS";

    cy.get('input[placeholder="Ex: EasyPark"]').type(nomeEstacionamento);
    cy.get('input[placeholder="Ex: AV. 123, numero 23"]').type(
      "Rua do Teste, 456"
    );
    cy.get('input[placeholder="Ex: 123"]').type("200");
    cy.get('input[placeholder="Ex: 15.00"]').type("20.00");
    cy.get('input[placeholder="Ex: 5.00"]').type("20.00");
    cy.get('input[placeholder="Ex: 35.00"]').type("20.00");

    const estacionamentoCriado: Estacionamento = {
      id: 1,
      nome: nomeEstacionamento,
      total_vagas: 200,
      endereco: "Rua do Teste, 456",
      valor_primeira_hora: 20.0,
      valor_demais_horas: null,
      valor_diaria: null,
    };

    // Intercepta novo GET após criação
    cy.intercept("GET", "/api/estacionamentos/", {
      statusCode: 200,
      body: [estacionamentoCriado],
    }).as("getEstacionamentosAtualizado");

    // Salva
    cy.contains("button", "Salvar").click();

    // Verificações
    cy.wait("@createEstacionamento")
      .its("request.body")
      .should("deep.include", {
        nome: nomeEstacionamento,
        total_vagas: 200,
        valor_primeira_hora: 20,
      });

    cy.wait("@getEstacionamentosAtualizado");
    cy.contains(nomeEstacionamento).should("be.visible");
  });
});
