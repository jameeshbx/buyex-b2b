/// <reference types="cypress" />

describe('Home Page Hero Section', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000'); // Adjust this if your home page is at a different route
    });
  
    it('should display the hero section with all main elements', () => {
      // Check the main container exists
      cy.get('section').should('exist');
      cy.get('section').should('have.class', 'bg-white');
    });
  
    it('should display the "New" badge with onboarding text', () => {
      cy.get('[class*="bg-blue-100"]').should('exist');
      cy.contains('span', 'New').should('exist');
      cy.contains('span', 'Just onboarded: BrightStone Advisory Group').should('exist');
    });
  
    it('should display the main heading with correct text', () => {
      cy.get('h1').should('exist');
      cy.get('h1').should('contain', 'Powering');
      cy.get('h1').should('contain', 'Study Abroad Forex');
      cy.get('h1').should('contain', 'for Your Students.');
    });
  
    it('should display the subheading text', () => {
      cy.contains('p', 'Let Us Handle The Forex Heavy Lifting').should('exist');
      cy.contains('p', 'Exceptional Study Abroad Solutions').should('exist');
    });
  
    it('should have two call-to-action buttons', () => {
      cy.get('a').should('have.length.at.least', 2);
      cy.contains('a', 'Register as consultant').should('exist');
     
      
      // Check button styling
      cy.contains('a', 'Register as consultant').should('have.class', 'bg-dark-rose');
      
    });
  
    it('should display the trust indicators', () => {
      cy.contains('p', 'Trusted by 100+ consultancies in India').should('exist');
      cy.contains('p', 'Powered by major RBI authorized dealers').should('exist');
    });
  
    it('should display all partner logos', () => {
      cy.get('img[alt="Thomas Cook"]').should('exist');
      cy.get('img[alt="RBL Bank"]').should('exist');
      cy.get('img[alt="ICICI Bank"]').should('exist');
      cy.get('img[alt="Fintiba"]').should('exist');
    });
  
    it('should display the hero image', () => {
      cy.get('img[alt="Study Abroad Illustration"]').should('exist');
      cy.get('img[alt="Study Abroad Illustration"]').should('be.visible');
    });
  
    it('should have responsive layout on different screen sizes', () => {
      // Test mobile layout
      cy.viewport('iphone-6');
      cy.get('h1').should('be.visible');
      cy.get('img[alt="Study Abroad Illustration"]').should('be.visible');
      
      // Test tablet layout
      cy.viewport('ipad-2');
      cy.get('h1').should('be.visible');
      cy.get('img[alt="Study Abroad Illustration"]').should('be.visible');
      
      // Test desktop layout
      cy.viewport('macbook-15');
      cy.get('h1').should('be.visible');
      cy.get('img[alt="Study Abroad Illustration"]').should('be.visible');
    });
  
    it('should have working links', () => {
      // Test consultant registration link
      cy.contains('a', 'Register as consultant').then(($link) => {
        const href = $link.attr('href');
        expect(href).to.not.be.undefined;
        expect(href).to.not.equal('#');
      });
      
      // Test students link
      cy.contains('a', 'Students').then(($link) => {
        const href = $link.attr('href');
        expect(href).to.not.be.undefined;
        expect(href).to.not.equal('#');
      });
    });
  });