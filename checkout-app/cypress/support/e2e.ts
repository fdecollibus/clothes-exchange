// Import commands.js using ES2015 syntax:
import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      addItemToCart(itemIndex?: number): Chainable<void>;
      waitForApi(): Chainable<void>;
    }
  }
} 