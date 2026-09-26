import { loginPage } from "../../page-modules/loginPage.js";

export const loginHelper = {
    login: (username, password) => {
        cy.clearAllLocalStorage();
	    cy.clearAllSessionStorage();
	    cy.clearLocalStorage();
        cy.get(loginPage.usernameInput).type(username);
        cy.get(loginPage.passwordInput).type(password);
        cy.get(loginPage.loginButton).click();
    }
};