import { loginHelper } from '../../support/helpers/loginHelper';
import { productsPage } from '../../page-modules/productsPage';

const username = Cypress.env('standard_user');
const password = Cypress.env('password');

const firstName = 'Ralph';
const lastName = 'Rough';
const postalCode = '12345';

describe('Add to Cart Tests', () => {
    beforeEach(() => {
        // Visit the base URL before each test
        cy.visit(Cypress.env('baseUrl'));
    });

    it('should add, remove, and proceed to checkout a product to the cart', () => {
        //Login with valid credentials
        loginHelper.login(username, password);
        
        // Arrays to hold product data
        const itemNames = [];
        const itemPrices = [];

        // Loop through the first 3 items
        cy.get(productsPage.inventoryItem).each(($el, index) => {
        if (index < 3) {

            // Get Item Name
            cy.wrap($el).find(productsPage.inventoryItemName).invoke('text').then((name) => {
            itemNames.push(name.trim());
            });

            // Get Item Price
            cy.wrap($el).find(productsPage.inventoryItemPrice).invoke('text').then((price) => {
            itemPrices.push(price.trim());
            });

            // Click "Add to cart" button
            cy.wrap($el).find('button').contains(productsPage.addToCartButton).click();

            //Assert the value of the cart badge
            cy.get(productsPage.cartBadge).should('contain', (index + 1).toString());
        }
        }).then(() => {
            // After collecting, set aliases
            cy.wrap(itemNames).as('itemNames');
            cy.wrap(itemPrices).as('itemPrices');
        });

        // Proceed to the Cart
        cy.get(productsPage.cartBadge).click();

        // Assert the URL to ensure we are on the cart page
        cy.url().should('include', '/cart.html');

        // Assert the items in the cart
        cy.get('@itemNames').then((names) => {
            names.forEach((name, index) => {
                cy.get(productsPage.cartItem).eq(index).find(productsPage.inventoryItemName).should('contain', name);
            });
        });

        cy.get('@itemPrices').then((prices) => {
            prices.forEach((price, index) => {
                cy.get(productsPage.cartItem).eq(index).find(productsPage.inventoryItemPrice).should('contain', price);
            });
        });

        // Remove 1 of the items from the cart
        cy.get(productsPage.cartItem).first().find('button').contains(productsPage.removeButton).click();

        // Assert the cart badge is updated
        cy.get(productsPage.cartBadge).should('contain', '2');

        // Proceed to checkout
        cy.get(productsPage.checkoutButton).click();

        // Assert we are on the checkout page
        cy.url().should('include', '/checkout-step-one.html');

        // Assert fields are mandatory
        cy.get(productsPage.continueButton).click();
        cy.get(productsPage.checkoutAlert).should('be.visible');
        cy.get(productsPage.checkoutAlert).should('contain', 'Error: First Name is required');

        // Fill in the checkout form
        cy.get(productsPage.firstNameInput).type(firstName);
        cy.get(productsPage.lastNameInput).type(lastName);
        cy.get(productsPage.postalCodeInput).type(postalCode);

        // Click the continue button
        cy.get(productsPage.continueButton).click();

        // Assert we are on the checkout overview page
        cy.url().should('include', '/checkout-step-two.html');

        // Assert the subtotal, tax, and total labels
        cy.get(productsPage.subtotalLabel).should('be.visible');
        cy.get(productsPage.taxLabel).should('be.visible');
        cy.get(productsPage.totalLabel).should('be.visible');

        // Click the finish button
        cy.get(productsPage.finishButton).click();

        // Assert we are on the order confirmation page
        cy.url().should('include', '/checkout-complete.html');
        cy.get(productsPage.successMessage).should('contain', 'Thank you for your order!');

    });
});
