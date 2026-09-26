import { loginHelper} from "../../support/helpers/loginHelper";
import { loginPage } from "../../page-modules/loginPage";

describe('Login Tests', () => {
    const username = Cypress.expose('standard_user');
    const password = Cypress.expose('password');

    beforeEach(() => {
        // Visit the base URL before each test
        cy.visit(Cypress.expose('baseUrl'));
    });

    function clearInputs() {
        // Clear the username and password inputs before each test
        cy.get(loginPage.usernameInput).clear();
        cy.get(loginPage.passwordInput).clear();
    }

    it('should test log in with blank credentials', () => {
        // Negative test case: Attempt to login with blank credentials
        cy.get(loginPage.loginButton).click();
        cy.get(loginPage.errorMessage).should('be.visible');
        cy.get(loginPage.errorMessage).should('contain', 'Username is required');
    });

    it('should test login with invalid credentials', () => {
        // Negative test case: Attempt to login with invalid credentials
        loginHelper.login(Cypress.expose('invalidUsername'), Cypress.expose('invalidPassword'));
        cy.get(loginPage.errorMessage).should('be.visible');
        cy.get(loginPage.errorMessage).should('contain', 'Epic sadface: Username and password do not match any user in this service');
    });

    it('should test login with valid credentials', () => {
        // Clear inputs before the test
        clearInputs();

        // Positive test case: Attempt to login with valid credentials
        loginHelper.login(username, password);
        cy.url().should('include', '/inventory.html');
    });

});
    
