interface User {
    id: number;
    login: string;
    role: "admin" | "funcionario";
    id_pessoa: number;
    admin_id?: number | null;
    pessoa?: {
        id: number;
        nome: string;
        cpf: string;
        email: string | null;
    };
}

describe("Fluxo de Gerenciamento de Funcionários (Admin)", () => {
    let adminToken: string;
    let createdEmployeeId: number;
    let createdEmployeeLogin: string;

    beforeEach(() => {
        cy.loginComoAdmin().then((token) => {
            adminToken = token;
        });
    });

    it("Deve criar um novo funcionário e, em seguida, excluí-lo", () => {
        const uniqueSuffix = Date.now();
        const employeeName = `Funcionario Teste ${uniqueSuffix}`;
        const employeeCpf = `999999999${String(uniqueSuffix).slice(-2)}9`;
        const employeeEmail = `funcionario.teste.${uniqueSuffix}@example.com`;
        const employeeLogin = `func_login_${uniqueSuffix}`;
        const employeePassword = "senhaFuncionario123";

        cy.visit("/"); 
        cy.contains('a', 'USUARIO').click();
        cy.url().should('include', '/usuarios');

        cy.log("Criando novo funcionário via API...");
        cy.request({
            method: "POST",
            url: "http://localhost:8000/api/usuarios/",
            headers: {
                Authorization: `Bearer ${adminToken}`,
            },
            body: {
                pessoa_data: {
                    nome: employeeName,
                    cpf: employeeCpf,
                    email: employeeEmail,
                },
                user_data: {
                    login: employeeLogin,
                    password: employeePassword,
                    role: "funcionario",
                },
            },
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("id");
            expect(response.body.login).to.eq(employeeLogin);
            expect(response.body.role).to.eq("funcionario");
            expect(response.body).to.have.property("pessoa");
            expect(response.body.pessoa.nome).to.eq(employeeName);

            createdEmployeeId = response.body.id;
            createdEmployeeLogin = response.body.login;

            cy.log(`Funcionário criado: ID=${createdEmployeeId}, Login=${createdEmployeeLogin}`);
            cy.log(`Excluindo funcionário ${createdEmployeeLogin} (ID: ${createdEmployeeId})...`);
            cy.request({
                method: "DELETE",
                url: `http://localhost:8000/api/usuarios/${createdEmployeeId}`,
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
                failOnStatusCode: false,
            }).then((deleteResponse) => {
                expect(deleteResponse.status).to.eq(204);

                cy.log(`Funcionário ${createdEmployeeLogin} excluído com sucesso.`);

                cy.log(`Verificando se o funcionário ${createdEmployeeLogin} foi realmente excluído...`);
                cy.request({
                    method: "GET",
                    url: `http://localhost:8000/api/usuarios/${createdEmployeeId}`,
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                    failOnStatusCode: false,
                }).then((getResponse) => {
                    expect(getResponse.status).to.eq(404);
                    expect(getResponse.body.detail).to.eq("Usuário não encontrado");
                    cy.log(`Confirmação: Funcionário ${createdEmployeeLogin} não encontrado (404).`);
                });
            });
        });
    });
});