describe('Staff Dashboard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/staff/dashboard/view-orders')
  })

  it('should load the dashboard', () => {
    cy.contains('Order Dashboard').should('be.visible')
    cy.get('input[placeholder="Search orders..."]').should('be.visible')
    cy.contains('button', 'Filter by purpose').should('be.visible')
  })

  it('should display orders', () => {
    cy.get('.border-b').should('have.length.greaterThan', 0)
  })

  it('should filter orders by purpose', () => {
    cy.contains('button', 'Filter by purpose').click()
    cy.contains('div', 'Education').click()
    cy.get('.border-b').each(($row) => {
      cy.wrap($row).should('contain', 'Education')
    })
  })

  it('should search orders', () => {
    cy.get('input[placeholder="Search orders..."]').type('ORD-12345')
    cy.get('.border-b').should('contain', 'ORD-12345')
  })

  it('should expand order details', () => {
    cy.get('.border-b').first().click()
    cy.contains("Receiver's full name").should('be.visible')
    cy.contains("Receiver's account").should('be.visible')
  })

  it('should change order status', () => {
    // Find first changeable status (not Completed/Rejected)
    cy.get('.border-b').each(($row) => {
      if (!$row.text().includes('Completed') && !$row.text().includes('Rejected')) {
        cy.wrap($row).find('button[role="combobox"]').first().click()
        cy.get('[role="option"]').first().click()
        return false
      }
    })
  })

  it('should paginate orders', () => {
    cy.contains('button', 'Next').click()
    cy.contains('button', 'Prev').click()
  })

  it('should show mobile view', () => {
    cy.viewport('iphone-x')
    cy.get('.border-b').first().click()
    cy.contains("Receiver's full name").should('be.visible')
  })
})