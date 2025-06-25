interface Evento {
    id: number;
    nome: string;
  }
  
  describe("Fluxo de Gerenciamento de Eventos", () => {
    let estacionamentoDeTeste: { id: number; nome: string }; 

    beforeEach(() => {
      cy.loginComoAdmin().then((token) => {
        cy.request({
          method: "POST",
          url: "http://localhost:8000/api/estacionamentos/",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            nome: `Estacionamento Base para Evento ${Date.now()}`,
            total_vagas: 150,
          },
        }).then((response) => {
          estacionamentoDeTeste = response.body;
        });
      });
    });
  
    it("Deve criar um novo evento no estacionamento de teste", () => {
      cy.intercept("POST", "/api/eventos/").as("createEvento");
      cy.intercept("GET", "/api/eventos/").as("getEventos");
      cy.visit("/eventos");
      cy.wait('@getEventos');
      cy.contains("button", "CRIAR EVENTO").click();  
      cy.wait(500);
  
      const nomeDoNovoEvento = `Show de Teste ${Date.now()}`;
  
      cy.get('select').select(estacionamentoDeTeste.id.toString());
      cy.get('input[placeholder="Ex: Show de Rock"]').type(nomeDoNovoEvento);
      cy.get('input[type="date"]').type('2025-12-31');
      cy.get('label:contains("Hora de Início") + input').type('20:00');
      cy.get('label:contains("Hora de Fim") + input').type('23:59');
      cy.get('input[placeholder="Ex: 50.00"]').type('150.75');
      cy.contains("button", "Salvar").click();
      cy.wait('@createEvento').its('request.body').should('deep.include', {
        nome: nomeDoNovoEvento,
        id_estacionamento: estacionamentoDeTeste.id,
        valor_acesso_unico: 150.75
      });
  
      cy.contains(nomeDoNovoEvento).should('be.visible');
    });
  });