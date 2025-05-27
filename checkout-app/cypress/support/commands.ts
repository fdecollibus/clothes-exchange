// Custom commands for Cypress

// Example: Custom command to add item to cart
Cypress.Commands.add('addItemToCart', (itemIndex = 0) => {
  cy.get('[data-testid="item-card"]').eq(itemIndex).find('[data-testid="add-to-cart"]').click();
});

// Example: Custom command to wait for API requests to complete
Cypress.Commands.add('waitForApi', () => {
  cy.intercept('**/api/**').as('apiRequest');
  cy.wait('@apiRequest');
}); 