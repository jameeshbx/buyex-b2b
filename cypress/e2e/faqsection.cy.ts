describe('FAQ Section', () => {
    beforeEach(() => {
      // Visit the page where your FAQ component is rendered
      cy.visit('http://localhost:3002/') // Update with your actual path
    })
  
    it('should display the FAQ section header', () => {
      cy.contains('h1', 'All You Need To Know').should('be.visible')
      cy.contains('p', 'We\'ve got you covered').should('be.visible')
    })
  
    it('should display all FAQ questions', () => {
      // Assuming you have 9 FAQ items
      cy.get('[data-testid^="faq-item-"]').should('have.length', 9)
    })
  
    it('should show the first FAQ answer by default', () => {
      cy.get('[data-testid="faq-item-1"]')
        .should('contain', 'As a creative agency we work with you')
        .should('be.visible')
    })
  
    it('should toggle FAQ answers when clicked', () => {
      // Verify second FAQ is initially closed
      cy.get('[data-testid="faq-item-2"]')
        .should('not.contain', 'We offer flexible services')
  
      // Click on second FAQ
      cy.get('[data-testid="faq-item-2"]').click()
  
      // Verify answer is now visible
      cy.get('[data-testid="faq-item-2"]')
        .should('contain', 'We offer flexible services')
        .should('be.visible')
  
      // Verify first FAQ is now closed
      cy.get('[data-testid="faq-item-1"]')
        .should('not.contain', 'As a creative agency we work with you')
    })
  
    it('should show plus icon when closed and X icon when open', () => {
      // First item is open by default
      cy.get('[data-testid="faq-item-1"]').within(() => {
        cy.get('svg').should('have.attr', 'data-icon', 'x')
      })
  
      // Second item is closed by default
      cy.get('[data-testid="faq-item-2"]').within(() => {
        cy.get('svg').should('have.attr', 'data-icon', 'plus')
      })
  
      // Click second item
      cy.get('[data-testid="faq-item-2"]').click()
  
      // Now second item should show X icon
      cy.get('[data-testid="faq-item-2"]').within(() => {
        cy.get('svg').should('have.attr', 'data-icon', 'x')
      })
    })
  
    it('should display correct numbering for all FAQs', () => {
      for (let i = 1; i <= 9; i++) {
        const paddedNumber = i.toString().padStart(2, '0')
        cy.get(`[data-testid="faq-item-${i}"] [data-testid="faq-number"]`)
          .should('contain', paddedNumber)
      }
    })
  })