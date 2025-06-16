import { loginPageElements } from "./elements";

class AuthenticationPage {
  login(userEmail: string, userPassword: string): void {
    cy.get(loginPageElements.loginButton)
      .should("be.visible")
      .click()
      .type(userEmail);
  }
}

export const authenticationPage = new AuthenticationPage();
