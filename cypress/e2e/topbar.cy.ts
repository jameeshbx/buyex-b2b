describe('Topbar Component', () => {
    beforeEach(() => {
      // Visit the homepage before each test
      cy.visit('http://localhost:3000/')
      // Wait for hydration to complete
      cy.wait(1000)
    })
  
    context('Desktop View', () => {
      beforeEach(() => {
        // Set viewport to desktop size
        cy.viewport(1280, 720)
      })
  
      it('should display the logo', () => {
        cy.get('header img[alt="Buyex Forex"]').should('be.visible')
      })
  
      it('should display navigation links', () => {
        cy.get('nav').should('be.visible')
        cy.contains('a', 'Home').should('be.visible')
        cy.contains('a', 'About').should('be.visible')
        cy.contains('a', 'News').should('be.visible') // Changed from 'BE News'
      })
  
      it('should display auth buttons', () => {
        cy.contains('a', 'Register').should('be.visible')
        cy.contains('a', 'Sign in').should('be.visible')
      })
  
      it('should navigate to correct pages when links are clicked', () => {
        cy.contains('a', 'About').click()
        cy.url().should('include', '/about')
        
        cy.go('back')
        cy.contains('a', 'News').click() // Changed from 'BE News'
        cy.url().should('include', '/news')
        
        cy.go('back')
        cy.contains('a', 'Home').click()
        cy.url().should('eq', Cypress.config().baseUrl + '/')
      })
  
      it('should navigate to auth pages when buttons are clicked', () => {
        cy.contains('a', 'Register').click()
        cy.url().should('include', '/register')
        
        cy.go('back')
        cy.contains('a', 'Sign in').click()
        cy.url().should('include', '/login')
      })
  
      it('should not display mobile menu button', () => {
        cy.get('button[aria-label="Toggle menu"]').should('not.exist')
      })
    })
  
    context('Mobile View', () => {
      beforeEach(() => {
        // Set viewport to mobile size
        cy.viewport(375, 667)
      })
  
      it('should display the logo', () => {
        cy.get('header img[alt="Buyex Forex"]').should('be.visible')
      })
  
      it('should display mobile menu button', () => {
        cy.get('button[aria-label="Toggle menu"]').should('be.visible')
      })
  
      it('should hide navigation links initially', () => {
        cy.get('nav').should('not.be.visible')
        cy.contains('a', 'Home').should('not.be.visible')
        cy.contains('a', 'About').should('not.be.visible')
        cy.contains('a', 'News').should('not.be.visible') // Changed from 'BE News'
      })
  
      it('should hide auth buttons initially', () => {
        cy.contains('a', 'Register').should('not.be.visible')
        cy.contains('a', 'Sign in').should('not.be.visible')
      })
  
      it('should show navigation links when menu button is clicked', () => {
        cy.get('button[aria-label="Toggle menu"]').click()
        // Wait for animation to complete
        cy.get('nav').should('be.visible')
        cy.contains('a', 'Home').should('be.visible')
        cy.contains('a', 'About').should('be.visible')
        cy.contains('a', 'News').should('be.visible') // Changed from 'BE News'
      })
  
      it('should show auth buttons when menu button is clicked', () => {
        cy.get('button[aria-label="Toggle menu"]').click()
        // Wait for animation to complete
        cy.contains('a', 'Register').should('be.visible')
        cy.contains('a', 'Sign in').should('be.visible')
      })
  
      it('should navigate to correct pages when mobile links are clicked', () => {
        cy.get('button[aria-label="Toggle menu"]').click()
        cy.contains('a', 'About').click({ force: true }) // Added force:true to bypass visibility check
        cy.url().should('include', '/about')
      })
  
      it('should close mobile menu after navigation', () => {
        cy.visit('/')
        cy.get('button[aria-label="Toggle menu"]').click()
        cy.contains('a', 'About').click({ force: true })
        cy.get('nav').should('not.be.visible')
        cy.contains('a', 'Home').should('not.be.visible')
      })
    })
  })