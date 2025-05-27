// Custom commands for Cypress

// Example: Custom command to login as admin
Cypress.Commands.add('loginAsAdmin', () => {
  cy.visit('/login');
  cy.get('input[name="email"]').type('admin@example.com');
  cy.get('input[name="password"]').type('password123');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Example: Custom command to wait for API requests to complete
Cypress.Commands.add('waitForApi', () => {
  cy.intercept('**/api/**').as('apiRequest');
  cy.wait('@apiRequest');
}); 