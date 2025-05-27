describe('TransactionDetails E2E Test', () => {
  beforeEach(() => {
    // Visit the page that contains the TransactionDetails component
    cy.visit('http://localhost:3000/staff/dashboard/order-preview')
    
    // Declare the window type with onCreateOrder property
    cy.window().then((win) => {
      // Type assertion for the window object
      const typedWindow = win as unknown as { onCreateOrder?: () => void }
      
      if (!typedWindow.onCreateOrder) {
        typedWindow.onCreateOrder = cy.stub().as('onCreateOrder')
      }
    })
  })

  it('should render the component with all sections', () => {
    // Verify main sections exist
    cy.get('div').contains('Transaction Details').should('exist')
    cy.get('div').contains('Currency & Rate Details').should('exist')
    cy.get('div').contains('Calculation').should('exist')
    cy.get('button').contains('Create').should('exist')
    cy.get('button').contains('Back').should('exist')
  })
 

  it('should display correct transaction details', () => {
    // Verify transaction details content
    cy.contains('Purpose').next().should('have.text', 'University fee transfer')
    cy.contains("Receiver's Bank Country").next().should('have.text', 'United States of America')
    cy.contains('Foreign Bank Charges').next().should('have.text', 'OUR (Sender bears bank charges)')
    cy.contains('Payer').next().should('have.text', 'Parent')
    cy.contains('Student Name').next().should('have.text', 'Zoe Fernandes')
    cy.contains('Consultancy').next().should('have.text', 'EduQuest Overseas')
  })

  it('should display correct currency and rate details', () => {
    // Verify currency details
    cy.contains('Amount').next().find('input').should('have.value', '9,000')
    cy.contains('Amount').next().contains('GBP').should('exist')
    cy.contains('FX Rate (IBR + Margin)').next().should('have.text', '₹101.1972')
    cy.contains('Customer Rate').next().should('have.text', '₹113.13')
    cy.contains('Margin').next().should('have.text', '0.40')
    cy.contains('Total INR Amount').next().should('have.text', '₹10,11,399.30')
  })

  it('should display correct calculation breakdown', () => {
    // Verify calculation section
    cy.contains('INR Amount').next().should('have.text', '8,33,420.06')
    cy.contains('Bank Fee').next().should('have.text', '16,428.80')
    cy.contains('GST').next().should('have.text', '0')
    cy.contains('TCS Applicable').next().should('have.text', '1,69,953.15')
    cy.contains('Total Payable').next().should('have.text', '10,11,399.30')
  })

  it('should call onCreateOrder when Create button is clicked', () => {
    cy.get('button').contains('Create').click()
    cy.get('@onCreateOrder').should('have.been.calledOnce')
  })

  it('should have responsive layout', () => {
    // Test mobile view
    cy.viewport('iphone-6')
    cy.get('.grid-cols-1').should('exist')
    
    // Test desktop view
    cy.viewport('macbook-15')
    cy.get('.lg\\:grid-cols-2').should('exist')
  })

  it('should display timeline correctly on desktop', () => {
    cy.viewport('macbook-15')
    cy.get('img[alt="Timeline point"]').should('have.length', 5)
  })

  it('should not display timeline on mobile', () => {
    cy.viewport('iphone-6')
    cy.get('img[alt="Timeline point"]').should('not.be.visible')
  })

  it('should have correct styling', () => {
    // Verify background colors
    cy.contains('Transaction Details').parent().should('have.class', 'bg-blue-50')
    cy.contains('Currency & Rate Details').parent().should('have.class', 'bg-blue-50')
    
    // Verify button styles
    cy.get('button').contains('Create').should('have.class', 'bg-dark-blue')
    cy.get('button').contains('Back').should('have.class', 'text-gray-600')
  })
})