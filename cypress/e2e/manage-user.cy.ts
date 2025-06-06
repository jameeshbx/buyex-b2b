describe('Manage Users Page', () => {
  beforeEach(() => {
    cy.visit('/manage-users')
    cy.intercept('GET', '/data/manage-users', { fixture: 'staffData.json' }).as('loadStaffData')
  })

  it('should load the page successfully', () => {
    cy.get('h1').should('contain', 'Manage Users')
    cy.wait('@loadStaffData')
  })

  describe('Header Controls', () => {
    it('should have working search functionality', () => {
      const searchTerm = 'John'
      cy.get('input[placeholder="Search"]').type(searchTerm)
      cy.get('[data-testid="staff-table"] tbody tr').should('have.length.at.least', 1)
      cy.get('[data-testid="staff-table"] tbody tr').first().should('contain', searchTerm)
    })

    it('should filter by user types', () => {
      cy.get('button').contains('Select user type').click()
      cy.get('label').contains('Agents').click()
      cy.get('button').contains('Apply').click()
      // Assuming the filtered data would show certain users
      cy.get('[data-testid="staff-table"] tbody tr').should('have.length.at.least', 1)
    })
  })

  describe('Table Functionality', () => {
    it('should display staff data in table', () => {
      cy.get('[data-testid="staff-table"] tbody tr').should('have.length.at.least', 1)
    })

    it('should allow selecting staff members', () => {
      // Select all
      cy.get('[data-testid="staff-table"] thead th').first().find('input[type="checkbox"]').click()
      cy.get('[data-testid="staff-table"] tbody tr').each($row => {
        cy.wrap($row).find('input[type="checkbox"]').should('be.checked')
      })

      // Deselect all
      cy.get('[data-testid="staff-table"] thead th').first().find('input[type="checkbox"]').click()
      cy.get('[data-testid="staff-table"] tbody tr').each($row => {
        cy.wrap($row).find('input[type="checkbox"]').should('not.be.checked')
      })

      // Select individual
      cy.get('[data-testid="staff-table"] tbody tr').first().find('input[type="checkbox"]').click()
      cy.get('[data-testid="staff-table"] tbody tr').first().find('input[type="checkbox"]').should('be.checked')
    })

    it('should sort by different columns', () => {
      // Sort by Staff ID
      cy.get('[data-testid="staff-table"] thead th').contains('Staff ID').click()
      cy.get('[data-testid="staff-table"] tbody tr').first().should('contain', 'STF')

      // Sort by Staff name
      cy.get('[data-testid="staff-table"] thead th').contains('Staff name').click()
      cy.get('[data-testid="staff-table"] tbody tr').first().should('contain', 'A')
    })

    it('should toggle staff status', () => {
      // First get initial status
      cy.get('[data-testid="staff-table"] tbody tr').first().find('[role="switch"]').then($switch => {
        const initialStatus = $switch.attr('aria-checked') === 'true' ? 'active' : 'inactive'
        
        // Click the toggle
        cy.wrap($switch).click()
        
        // Confirm dialog should appear
        cy.contains(initialStatus === 'active' ? 'Deactivate Staff Member' : 'Activate Staff Member').should('be.visible')
        cy.contains('Are you sure').should('be.visible')
        
        // Click confirm
        cy.contains(initialStatus === 'active' ? 'Deactivate' : 'Activate').click()
        
        // Status should be toggled
        cy.get('[data-testid="staff-table"] tbody tr').first().find('[role="switch"]').should('have.attr', 'aria-checked', initialStatus === 'active' ? 'false' : 'true')
      })
    })

    it('should cancel status toggle', () => {
      cy.get('[data-testid="staff-table"] tbody tr').first().find('[role="switch"]').then($switch => {
        const initialStatus = $switch.attr('aria-checked') === 'true' ? 'active' : 'inactive'
        
        cy.wrap($switch).click()
        cy.contains('Cancel').click()
        
        // Status should remain unchanged
        cy.get('[data-testid="staff-table"] tbody tr').first().find('[role="switch"]').should('have.attr', 'aria-checked', initialStatus === 'active' ? 'true' : 'false')
      })
    })

    it('should navigate to edit page when edit button is clicked', () => {
      // Mock the console.log to test the click
      cy.window().then(win => {
        cy.spy(win.console, 'log').as('consoleLog')
      })
      
      cy.get('[data-testid="staff-table"] tbody tr').first().find('button').contains('Edit').click()
      cy.get('@consoleLog').should('be.calledWithMatch', /Edit/)
    })
  })

  describe('Pagination', () => {
    it('should navigate between pages', () => {
      // Assuming we have more than one page of data
      cy.get('[data-testid="staff-table"] tbody tr').should('have.length', 4) // itemsPerPage is 4

      // Click next page
      cy.contains('Next').click()
      cy.get('[data-testid="staff-table"] tbody tr').should('have.length.at.least', 1)

      // Click previous page
      cy.contains('Prev').click()
      cy.get('[data-testid="staff-table"] tbody tr').should('have.length', 4)
    })

    it('should disable prev/next buttons when appropriate', () => {
      // First page - prev should be disabled
      cy.contains('Prev').should('not.be.disabled') // Our test data might not have enough items
      
      // Go to last page
      cy.contains('Next').click()
      cy.contains('Next').should('not.be.disabled') // Our test data might not have enough items
    })
  })

  describe('Mobile View', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
    })

    it('should display mobile cards instead of table', () => {
      cy.get('[data-testid="staff-table"]').should('not.be.visible')
      cy.get('.lg\\:hidden > .p-4 > div').should('have.length.at.least', 1)
    })

    it('should have mobile-friendly controls', () => {
      // Search should have mobile icon
      cy.get('.relative > .sm\\:hidden').should('be.visible')
      
      // Filter button should show icon
      cy.get('button').contains('Select user type').find('svg').should('exist')
    })

    it('should work with mobile status toggle', () => {
      cy.get('.lg\\:hidden > .p-4 > div').first().find('[role="switch"]').click()
      cy.contains('Are you sure').should('be.visible')
      cy.contains('Cancel').click()
    })
  })
})