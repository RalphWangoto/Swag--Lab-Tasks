import { loginHelper} from "../../support/helpers/loginHelper";
import { LoginPage } from "../../page-modules/loginPage";

describe('Login Tests', () => {
    const username = Cypress.env('standard_user');
    const password = Cypress.env('password');
    
    beforeEach(() => {
        // Visit the base URL before each test
        cy.visit(Cypress.env('baseUrl'));
    });

    function clearInputs() {
        // Clear the username and password inputs before each test
        cy.get(LoginPage.usernameInput).clear();
        cy.get(LoginPage.passwordInput).clear();
    }

    it('should test log in with blank credentials', () => {
        // Negative test case: Attempt to login with blank credentials
        cy.get(LoginPage.loginButton).click();
        cy.get(LoginPage.errorMessage).should('be.visible');
        cy.get(LoginPage.errorMessage).should('contain', 'Username is required');
    });

    it('should test login with invalid credentials', () => {
        // Negative test case: Attempt to login with invalid credentials
        loginHelper.login(Cypress.env('invalidUsername'), Cypress.env('invalidPassword'));
        cy.get(LoginPage.errorMessage).should('be.visible');
        cy.get(LoginPage.errorMessage).should('contain', 'Epic sadface: Username and password do not match any user in this service');
    });

    it('should test login with valid credentials', () => {
        // Clear inputs before the test
        clearInputs();

        // Positive test case: Attempt to login with valid credentials
        loginHelper.login(username, password);
        cy.url().should('include', '/inventory.html');
    });

});
    
