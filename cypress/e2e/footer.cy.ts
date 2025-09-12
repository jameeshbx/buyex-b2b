describe('Footer Component', () => {
    beforeEach(() => {
      cy.visit(' http://localhost:3000') // Change path if Footer is not on home page
    })
  
    it('should display the logo', () => {
      cy.get('img[alt="Buyex Forex Logo"]').should('be.visible')
    })
  
    it('should display Quick Links section', () => {
      cy.contains('Quick Links').should('be.visible')
      const quickLinks = [
        "What we provide",
        "About Us",
        "Why Us",
        "What you gain",
        "Who all can benefit",
        "Help Center",
      ]
      quickLinks.forEach(link => {
        cy.contains('a', link).should('be.visible')
      })
    })
  
    it('should display Explore section', () => {
      cy.contains('Explore').should('be.visible')
      const exploreLinks = [
        "BE News",
        "Testimonials",
        "Awards and Recognitions",
        "Terms and Conditions",
        "Privacy Policy",
      ]
      exploreLinks.forEach(link => {
        cy.contains('a', link).should('be.visible')
      })
    })
  
    it('should display Office Location details', () => {
      cy.contains('Office Location').should('be.visible')
      cy.contains('Buyex Forex Fintech').should('be.visible')
      cy.contains('Kalamassery').should('be.visible')
      cy.contains('+91 9072 243 243').should('be.visible')
      cy.contains('admin@buyexchange.in').should('be.visible')
    })
  
    it('should allow typing email in the Newsletter input', () => {
      cy.get('input[placeholder="Enter your email address"]')
        .type('test@example.com')
        .should('have.value', 'test@example.com')
    })
  
    it('should display the social media icons', () => {
      cy.get('img[alt="Twitter"]').should('be.visible')
      cy.get('img[alt="LinkedIn"]').should('be.visible')
      cy.get('img[alt="Facebook"]').should('be.visible')
    })
  
    it('should display the copyright notice', () => {
      cy.contains('© 2025 Buyex Forex. All Rights Reserved.').should('be.visible')
    })
  
    it('should display the disclaimer text', () => {
      cy.contains('buyexforex.com is a digital platform').should('be.visible')
    })
  })
  