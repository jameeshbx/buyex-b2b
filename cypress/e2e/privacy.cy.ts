describe('Privacy Policy Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/privacy-policy') // Adjust path as per your routing
    })
  
    it('should display the page title', () => {
      cy.contains('h1', 'Privacy Policy').should('be.visible')
    })
  
    it('should contain key sections in the Table of Contents', () => {
      const tocItems = [
        'Personal Information We Collect',
        'How we use your personal information',
        'Sharing your personal information',
        'Behavioral Advertising',
        'Do Not Track',
        'Data retention',
        'Changes',
        'Contact us',
      ]
      tocItems.forEach(item => {
        cy.contains('ul li', item).should('be.visible')
      })
    })
  
    it('should display contact information in the Get in Touch section', () => {
      cy.contains('h2', 'Get in touch').should('be.visible')
  
      // Sales Enquiries
      cy.contains('Sales Enquiries').should('be.visible')
      cy.contains('sales@buyexchange.in').should('be.visible')
      cy.contains('+919072243243').should('be.visible')
  
      // Forex Consultation
      cy.contains('Forex Consultation').should('be.visible')
      cy.contains('forex@buyexchange.in').should('be.visible')
    })
  
    it('should render privacy section headers correctly', () => {
      const headers = [
        'PERSONAL INFORMATION WE COLLECT',
        'HOW DO WE USE YOUR PERSONAL INFORMATION?',
        'SHARING YOUR PERSONAL INFORMATION',
        'BEHAVIOURAL ADVERTISING',
        'DO NOT TRACK',
        'DATA RETENTION',
        'CHANGES',
        'CONTACT US'
      ]
      headers.forEach(header => {
        cy.contains('h2', header).should('be.visible')
      })
    })
  
    it('should contain at least one working link in the Table of Contents', () => {
      cy.get('a[href="#personal-info"]').should('have.attr', 'href').and('include', '#personal-info')
    })
  })
  