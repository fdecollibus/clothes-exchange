describe('Admin Dashboard', () => {
  beforeEach(() => {
    // Visit the admin login page
    cy.visit('http://localhost:5174/login');
    
    // Login as admin
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Wait for dashboard to load
    cy.url().should('include', '/dashboard');
  });

  it('should display seller list', () => {
    cy.get('[data-testid="seller-list"]').should('exist');
    cy.get('[data-testid="seller-item"]').should('have.length.at.least', 1);
  });

  it('should edit seller information', () => {
    // Click edit button on first seller
    cy.get('[data-testid="seller-item"]').first().find('[data-testid="edit-seller"]').click();
    
    // Update seller information
    cy.get('input[name="name"]').clear().type('Updated Seller Name');
    cy.get('input[name="email"]').clear().type('updated@example.com');
    cy.get('button[type="submit"]').click();
    
    // Verify update
    cy.get('[data-testid="seller-item"]').first().should('contain', 'Updated Seller Name');
  });

  it('should view seller items', () => {
    // Click view items button on first seller
    cy.get('[data-testid="seller-item"]').first().find('[data-testid="view-items"]').click();
    
    // Verify items list
    cy.get('[data-testid="items-list"]').should('exist');
    cy.get('[data-testid="item-row"]').should('have.length.at.least', 1);
  });

  it('should delete an item', () => {
    // Go to consolidated items view
    cy.get('[data-testid="consolidated-items"]').click();
    
    // Delete first item
    cy.get('[data-testid="item-row"]').first().find('[data-testid="delete-item"]').click();
    cy.get('[data-testid="confirm-delete"]').click();
    
    // Verify item is removed
    cy.get('[data-testid="item-row"]').first().should('not.exist');
  });

  it('should update item status', () => {
    // Go to consolidated items view
    cy.get('[data-testid="consolidated-items"]').click();
    
    // Update status of first item
    cy.get('[data-testid="item-row"]').first().find('[data-testid="edit-item"]').click();
    cy.get('select[name="status"]').select('sold');
    cy.get('button[type="submit"]').click();
    
    // Verify status update
    cy.get('[data-testid="item-row"]').first().should('contain', 'Verkauft');
  });

  it('should download seller PDF', () => {
    // Click download PDF button on first seller
    cy.get('[data-testid="seller-item"]').first().find('[data-testid="download-pdf"]').click();
    
    // Verify download
    cy.readFile('cypress/downloads/seller-items.pdf').should('exist');
  });

  it('should download consolidated PDF', () => {
    // Go to consolidated items view
    cy.get('[data-testid="consolidated-items"]').click();
    
    // Click download PDF button
    cy.get('[data-testid="download-consolidated"]').click();
    
    // Verify download
    cy.readFile('cypress/downloads/all-items.pdf').should('exist');
  });

  it('should download labels PDF', () => {
    // Go to consolidated items view
    cy.get('[data-testid="consolidated-items"]').click();
    
    // Click download labels button
    cy.get('[data-testid="download-labels"]').click();
    
    // Verify download
    cy.readFile('cypress/downloads/all-labels.pdf').should('exist');
  });
}); 