/// <reference types="cypress" />

describe('BE News Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/benews') // Update with your actual route
    })
  
    describe('Header Section', () => {
      it('should display the main heading and subtitle', () => {
        cy.get('h1').should('contain', 'Insights from our team')
        cy.contains('p', 'Buy Exchange Forex News').should('be.visible')
      })
  
      it('should have a functional search bar', () => {
        cy.get('input[placeholder="search..."]')
          .should('be.visible')
          .type('forex')
          .should('have.value', 'forex')
      })
    })
  
    describe('Sidebar Navigation', () => {
      it('should display blog topics', () => {
        cy.contains('h2', 'Blog Topics').should('be.visible')
        const topics = ['Remittance', 'Forex', 'Currency Exchange', 'Crypto', 'Artificial Intelligence', 'Work']
        topics.forEach(topic => {
          cy.contains('li', topic).should('be.visible')
        })
      })
  
      it('should allow clicking on blog topics', () => {
        cy.contains('li', 'Forex').click()
        // Add assertions for what happens when a topic is clicked
      })
    })
  
    describe('Trending Topics', () => {
      it('should display trending topics', () => {
        cy.contains('h2', 'Trending Topics').should('be.visible')
        const trending = ['Remittance', 'Forex', 'Currency exchange']
        trending.forEach(topic => {
          cy.contains('span', topic).should('be.visible')
        })
      })
    })
  
    describe('News Articles', () => {
      it('should display articles by default', () => {
        cy.get('article').should('have.length.greaterThan', 0)
      })
  
      it('should show article details', () => {
        cy.get('article').first().within(() => {
          cy.get('h3').should('exist') // Article title
          cy.get('p').should('exist') // Date
          cy.get('img').should('exist') // Image
          cy.contains('button', 'Read more →').should('exist')
        })
      })
  
      it('should expand/collapse articles', () => {
        cy.contains('button', 'Read more →').first().click()
        cy.contains('button', 'Read less ←').should('exist')
        cy.contains('button', 'Read less ←').first().click()
        cy.contains('button', 'Read more →').should('exist')
      })
  
      it('should filter articles based on search', () => {
        const searchTerm = 'forex'
        cy.get('input[placeholder="search..."]').type(searchTerm)
        cy.get('article').should('have.length.greaterThan', 0)
        cy.contains(`Showing ${searchTerm}`).should('exist')
      })
  
      it('should show no results message for invalid search', () => {
        cy.get('input[placeholder="search..."]').type('nonexistentterm')
        cy.contains('No articles match your search criteria').should('be.visible')
      })
    })
  
    describe('Get in Touch Section', () => {
      it('should display the contact section', () => {
        cy.contains('h2', 'Get in touch').should('be.visible')
      })
  
      it('should show sales enquiries information', () => {
        cy.contains('h3', 'Sales Enquiries').should('be.visible')
        cy.contains('+919072243243').should('be.visible')
        cy.contains('sales@buyexchange.in').should('be.visible')
      })
  
      it('should show forex consultation information', () => {
        cy.contains('h3', 'Forex Consultation').should('be.visible')
        cy.contains('+919072243243').should('be.visible')
        cy.contains('forex@buyexchange.in').should('be.visible')
      })
  
      it('should display background image on large screens', () => {
        cy.viewport(1200, 800)
        cy.get('img[alt="Background"]').should('be.visible')
      })
    })
  
    describe('Responsiveness', () => {
      it('should display mobile layout correctly', () => {
        cy.viewport('iphone-6')
        cy.get('h1').should('be.visible')
        cy.get('input[placeholder="search..."]').should('be.visible')
      })
  
      it('should switch to desktop layout', () => {
        cy.viewport(1200, 800)
        cy.get('div.w-full.md\\:w-1\\/4').should('be.visible') // Sidebar
        cy.get('div.w-full.md\\:w-3\\/4').should('be.visible') // Main content
      })
    })
  })