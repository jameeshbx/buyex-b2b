// cypress/e2e/terms.spec.js

describe('Terms and Conditions Page', () => {
    beforeEach(() => {
      // Visit the terms and conditions page
      cy.visit('http://localhost:3000/terms-and-conditions');
    });
  
    it('should display the page title and header correctly', () => {
      // Check page title (assuming the title is set)
      cy.title().should('include', 'Terms and Conditions');
      
      // Check main header
      cy.get('h1').should('contain', 'Terms And Conditions');
    });
  
    it('should display the table of contents', () => {
      // Check if TOC exists on desktop
      cy.get('.hidden.md\\:block h3').should('contain', 'Table of Contents');
      
      // Check if TOC exists on mobile
      cy.viewport('iphone-x');
      cy.get('.block.md\\:hidden h3').should('contain', 'Table of Contents');
    });
  
    it('should have all the main sections in the content', () => {
      const sections = [
        'USER ACCOUNT',
        'SERVICES',
        'AGENTS AND VISITORS',
        'CHANGE',
        'SERVICE ELIGIBILITY',
        'YOUR ACCOUNT',
        'NOTICES & MESSAGES',
        "DO'S",
        "DON'TS",
        'REFUND AND CANCELLATION',
        'REFUND ELIGIBILITY',
        'REFUND PROCESSING TIME',
        'TRANSACTION FEES',
        'EXCHANGE RATE FLUCTUATIONS',
        'WIRE TRANSFER REJECTION',
        'CONTACT US'
      ];
  
      sections.forEach(section => {
        cy.contains('h2', section).should('be.visible');
      });
    });
  
    it('should have clickable table of contents links', () => {
      // Test TOC links in desktop view
      cy.get('.hidden.md\\:block a').first().click();
      
      // Verify URL contains the anchor
      cy.url().should('include', '#user-account');
      
      // Check the scroll position (approximately)
      cy.get('#user-account').should('be.visible');
    });
  
    it('should have clickable table of contents links on mobile', () => {
      // Switch to mobile viewport
      cy.viewport('iphone-x');
      
      // Test TOC links in mobile view
      cy.get('.block.md\\:hidden a').first().click();
      
      // Verify URL contains the anchor
      cy.url().should('include', '#user-account');
      
      // Check the scroll position (approximately)
      cy.get('#user-account').should('be.visible');
    });
  
    it('should display the contact information correctly', () => {
      // Check "Get in touch" section
      cy.contains('h2', 'Get in touch').should('be.visible');
      
      // Check contact details
      cy.contains('h3', 'Sales Enquiries').should('be.visible');
      cy.contains('p', '+919072243243').should('be.visible');
      cy.contains('p', 'sales@buyexchange.in').should('be.visible');
      
      cy.contains('h3', 'Forex Consultation').should('be.visible');
      cy.contains('p', 'forex@buyexchange.in').should('be.visible');
    });
  
    it('should have a responsive layout', () => {
      // Check desktop layout
      cy.get('.grid.grid-cols-1.md\\:grid-cols-4').should('be.visible');
      cy.get('.hidden.md\\:block').should('be.visible'); // Desktop TOC
      cy.get('.block.md\\:hidden').should('not.be.visible'); // Mobile TOC hidden on desktop
      
      // Check mobile layout
      cy.viewport('iphone-x');
      cy.get('.block.md\\:hidden').should('be.visible'); // Mobile TOC
      cy.get('.hidden.md\\:block').should('not.be.visible'); // Desktop TOC hidden on mobile
    });
  
    it('should have properly formatted list items in the main content', () => {
      // Check ordered lists
      cy.get('ol.list-decimal').should('exist');
      
      // Check unordered lists
      cy.get('ul.list-disc').should('exist');
      
      // Check nested lists structure
      cy.get('ol.list-decimal > li > ul.list-disc').should('exist');
    });
  
    it('should have the correct email and phone links', () => {
      // Check email links
      cy.get('a[href="mailto:admin@buyexchange.in"]')
        .should('be.visible')
        .and('have.text', 'admin@buyexchange.in');
        
      // Check phone links
      cy.get('a[href="tel:+919022243243"]')
        .should('be.visible')
        .and('have.text', '+91 9022 243 243');
    });
  
    it('should load all images correctly', () => {
      // Check that all images have loaded
      cy.get('img').each(($img) => {
        // Check the naturalWidth property - if it's 0, the image hasn't loaded
        expect(($img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
      });
    });
  
    it('should have the background image in the contact section on large screens', () => {
      // On large screens, the background image should be visible
      cy.viewport(1200, 800);
      cy.get('.absolute.inset-0.z-0.overflow-hidden.hidden.lg\\:block')
        .should('be.visible');
        
      // On small screens, it should be hidden
      cy.viewport('iphone-x');
      cy.get('.absolute.inset-0.z-0.overflow-hidden.hidden.lg\\:block')
        .should('not.be.visible');
    });
  
    it('should have the correct text styling for headings and paragraphs', () => {
      // Check headings typography
      cy.get('h1').should('have.class', 'text-4xl');
      cy.get('h2').first().should('have.class', 'text-xl');
      
      // Check paragraph typography
      cy.get('.prose p').first().should('have.class', 'text-gray-500');
    });
  });