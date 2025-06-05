describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/orders', { fixture: 'orders.json' }).as('getOrders')
    cy.intercept('GET', '/api/statuses', { fixture: 'statuses.json' }).as('getStatuses')
    cy.visit('/http://localhost:3000/admin/dashboard')
    cy.wait('@getOrders')
  })

  it('should load the dashboard successfully', () => {
    cy.get('h1').should('contain', 'Dashboard')
    cy.get('.card').should('exist')
    cy.get('[data-testid="order-row"]').should('have.length.at.least', 1)
  })

  it('should expand and collapse order details', () => {
    // First row
    cy.get('[data-testid="order-row"]').first().click()
    cy.get('[data-testid="order-details"]').first().should('be.visible')
    
    // Check some detail content
    cy.get('[data-testid="order-details"]').first()
      .should('contain', 'Purpose')
      .and('contain', 'Receiver')
    
    // Collapse
    cy.get('[data-testid="order-row"]').first().click()
    cy.get('[data-testid="order-details"]').first().should('not.be.visible')
  })

  it('should change order status', () => {
    // Find an order with changeable status (not in nonChangeableStatuses)
    cy.get('[data-testid="order-row"]').each(($row) => {
      const status = $row.find('[data-testid="order-status"]').text()
      if (!['Quote downloaded', 'Documents placed', 'Authorized'].includes(status)) {
        cy.wrap($row).find('[data-testid="order-status"]').click()
        
        // Select a new status
        cy.get('[role="listbox"]').should('be.visible')
        cy.get('[role="option"]').not(`:contains(${status})`).first().click()
        
        // Verify status changed
        cy.wrap($row).find('[data-testid="order-status"]')
          .should('not.contain', status)
        
        return false // Break loop
      }
    })
  })

  it('should show more/less orders', () => {
    // Initial count
    const initialCount = 5
    cy.get('[data-testid="order-row"]').should('have.length', initialCount)
    
    // Click "See More"
    cy.contains('button', 'See More').click()
    cy.get('[data-testid="order-row"]').should('have.length', initialCount + 5)
    
    // Click "See Less"
    cy.contains('button', 'See Less').click()
    cy.get('[data-testid="order-row"]').should('have.length', initialCount)
  })

  it('should open and update FX rate', () => {
    // Find an order with "UPDATE RATE" button
    cy.contains('button', 'UPDATE RATE').first().click()
    
    // Verify modal opens
    cy.get('[role="dialog"]').should('be.visible')
    cy.get('[role="dialog"] h2').should('contain', 'Update FX Rates')
    
    // Fill in rates
    const newRate = '1.2345'
    cy.get('input').eq(1).clear().type(newRate) // Customer rate input
    
    // Submit
    cy.contains('button', 'Update rates').click()
    
    // Verify update
    cy.contains('button', 'UPDATED').should('exist')
    cy.get('[role="dialog"]').should('not.exist')
  })

  it('should authorize an order', () => {
    // Find an order that can be authorized
    cy.contains('[data-testid="order-row"]', 'Pending').first().click()
    
    // Click Authorize button
    cy.contains('button', 'Authorize').click()
    
    // Fill authorization form
    cy.get('input[name="currency"]').type('USD')
    cy.get('input[name="fcyAmt"]').type('1000')
    cy.get('input[name="purpose"]').type('Test purpose')
    cy.get('input[name="receiverAccount"]').type('1234567890')
    
    // Select status and submit
    cy.get('[role="combobox"]').click()
    cy.get('[role="option"]').contains('Blocked').click()
    cy.contains('button', 'Submit').click()
    
    // Verify authorization
    cy.get('[data-testid="order-status"]').should('contain', 'Authorized')
  })

  it('should handle mobile view correctly', () => {
    cy.viewport('iphone-6')
    
    // Verify mobile layout
    cy.get('[data-testid="order-row"]').first().click()
    cy.get('[data-testid="order-details"]').should('be.visible')
    
    // Test mobile actions
    cy.contains('button', 'UPDATE RATE').first().click()
    cy.get('[role="dialog"]').should('be.visible')
    cy.get('button[aria-label="Close"]').click()
  })
})