// A interface para o tipo de dado Evento, se você quiser usar
interface Evento {
    id: number;
    nome: string;
    // ... outros campos
  }
  
  describe("Fluxo de Gerenciamento de Eventos", () => {
    let estacionamentoDeTeste: { id: number; nome: string }; // Guarda os dados do estacionamento
  
    beforeEach(() => {
      // 1. Faz o login e obtém um token
      // @ts-ignore - Ignora o erro de tipo do comando customizado se o arquivo de tipos não for encontrado
      cy.loginComoAdmin().then((token) => {
        // 2. Cria o estacionamento necessário via API para o teste ser rápido e confiável
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
          // 3. Salva os dados do estacionamento criado
          estacionamentoDeTeste = response.body;
        });
      });
    });
  
    it("Deve criar um novo evento no estacionamento de teste", () => {
      // Intercepta as chamadas de API que serão feitas nesta página
      cy.intercept("POST", "/api/eventos/").as("createEvento");
      cy.intercept("GET", "/api/eventos/").as("getEventos");
  
      // O teste começa com a garantia de que um estacionamento existe
      cy.visit("/eventos"); // Supondo que a rota do frontend para eventos seja esta
      cy.wait('@getEventos'); // Espera a lista inicial de eventos carregar
  
      cy.contains("button", "CRIAR EVENTO").click();
  
      // Espera o modal aparecer e os dados do dropdown carregarem (se for assíncrono)
      // Uma pequena espera pode estabilizar o teste aqui
      cy.wait(500);
  
      const nomeDoNovoEvento = `Show de Teste ${Date.now()}`;
  
      // --- A LÓGICA QUE FALTAVA ---
  
      // 1. Seleciona o estacionamento criado no `beforeEach`
      // Usamos o ID para garantir que estamos selecionando o item correto
      cy.get('select').select(estacionamentoDeTeste.id.toString());
  
      // 2. Preenche o resto do formulário
      cy.get('input[placeholder="Ex: Show de Rock"]').type(nomeDoNovoEvento);
      cy.get('input[type="date"]').type('2025-12-31');
      cy.get('label:contains("Hora de Início") + input').type('20:00');
      cy.get('label:contains("Hora de Fim") + input').type('23:59');
      cy.get('input[placeholder="Ex: 50.00"]').type('150.75');
      
      // 3. Clica para salvar
      cy.contains("button", "Salvar").click();
  
      // 4. Verifica se a chamada à API foi feita com os dados corretos
      cy.wait('@createEvento').its('request.body').should('deep.include', {
        nome: nomeDoNovoEvento,
        id_estacionamento: estacionamentoDeTeste.id,
        valor_acesso_unico: 150.75
      });
  
      // 5. Verifica se o novo evento aparece na lista
      cy.contains(nomeDoNovoEvento).should('be.visible');
    });
  });