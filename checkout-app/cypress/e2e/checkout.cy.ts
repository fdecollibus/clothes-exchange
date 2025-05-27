describe('Checkout Process', () => {
  beforeEach(() => {
    // Visit the checkout page
    cy.visit('http://localhost:5175');
  });

  it('should display empty cart message initially', () => {
    cy.get('[data-testid="empty-cart"]').should('exist');
  });

  it('should add items to cart', () => {
    // Add first item to cart
    cy.get('[data-testid="item-card"]').first().find('[data-testid="add-to-cart"]').click();
    
    // Verify item is in cart
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
  });

  it('should remove items from cart', () => {
    // Add item to cart
    cy.get('[data-testid="item-card"]').first().find('[data-testid="add-to-cart"]').click();
    
    // Remove item from cart
    cy.get('[data-testid="cart-item"]').first().find('[data-testid="remove-from-cart"]').click();
    
    // Verify cart is empty
    cy.get('[data-testid="empty-cart"]').should('exist');
  });

  it('should complete checkout process', () => {
    // Add item to cart
    cy.get('[data-testid="item-card"]').first().find('[data-testid="add-to-cart"]').click();
    
    // Click checkout button
    cy.get('[data-testid="checkout-button"]').click();
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('exist');
    cy.get('[data-testid="receipt-summary"]').should('exist');
  });

  it('should download receipt', () => {
    // Add item to cart
    cy.get('[data-testid="item-card"]').first().find('[data-testid="add-to-cart"]').click();
    
    // Complete checkout
    cy.get('[data-testid="checkout-button"]').click();
    
    // Download receipt
    cy.get('[data-testid="download-receipt"]').click();
    
    // Verify download
    cy.readFile('cypress/downloads/receipt.pdf').should('exist');
  });

  it('should show error when trying to checkout empty cart', () => {
    // Try to checkout with empty cart
    cy.get('[data-testid="checkout-button"]').click();
    
    // Verify error message
    cy.get('[data-testid="error-message"]').should('contain', 'Warenkorb ist leer');
  });

  it('should filter items by seller', () => {
    // Select a seller from dropdown
    cy.get('[data-testid="seller-select"]').select('1');
    
    // Verify items are filtered
    cy.get('[data-testid="item-card"]').should('have.length.at.least', 1);
  });

  it('should search items', () => {
    // Type in search box
    cy.get('[data-testid="search-input"]').type('test item');
    
    // Verify search results
    cy.get('[data-testid="item-card"]').should('have.length.at.least', 1);
  });
}); 