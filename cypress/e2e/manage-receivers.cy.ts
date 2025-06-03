describe('Receivers Table', () => {
  beforeEach(() => {
    cy.visit('/receivers') // Adjust the URL as needed based on your routing
  })

  it('should load the receivers table', () => {
    cy.get('[data-testid="receivers-table"]').should('exist')
    cy.get('[data-testid="desktop-view"]').should('be.visible')
  })

  describe('Header and Filters', () => {
    it('should have a country filter dropdown', () => {
      cy.get('[data-testid="country-filter-button"]').click()
      cy.get('[data-testid="country-dropdown"]').should('be.visible')
      cy.get('[data-testid="country-option-all"]').should('exist')
      // Test a few country options
      cy.get('[data-testid="country-option-us"]').should('exist')
      cy.get('[data-testid="country-option-gb"]').should('exist')
    })

    it('should filter by country', () => {
      cy.get('[data-testid="country-filter-button"]').click()
      cy.get('[data-testid="country-option-us"]').click()
      // Verify that the filter is applied
      cy.get('[data-testid="country-filter-button"]').should('contain', 'Filter by country: US')
      // Verify table shows only US receivers
      cy.get('[data-testid^="table-row-"]').each(($row) => {
        cy.wrap($row).find('[data-testid^="cell-country-"]').should('contain', 'US')
      })
    })

    it('should have a working search input', () => {
      const searchTerm = 'Test'
      cy.get('[data-testid="search-input"]').type(searchTerm)
      // Verify that the table shows only rows containing the search term
      cy.get('[data-testid^="table-row-"]').should('have.length.gt', 0)
      cy.get('[data-testid^="table-row-"]').each(($row) => {
        cy.wrap($row).should('contain', searchTerm)
      })
    })
  })

  describe('Sorting', () => {
    it('should sort by ID', () => {
      // Get initial order of IDs
      let initialIds: string[] = []
      cy.get('[data-testid^="cell-id-"]').then(($cells) => {
        initialIds = $cells.map((_, el) => el.innerText).get()
        
        // Click to sort by ID
        cy.get('[data-testid="sort-header-id"]').click()
        
        // Verify sort direction changed
        cy.get('[data-testid="sort-icon-id-desc"]').should('exist')
        
        // Get sorted IDs and verify they're in reverse order
        let sortedIds = []
        cy.get('[data-testid^="cell-id-"]').then(($sortedCells) => {
          sortedIds = $sortedCells.map((_, el) => el.innerText).get()
          expect(sortedIds).not.to.deep.equal(initialIds)
          expect(sortedIds).to.deep.equal([...initialIds].reverse())
        })
      })
    })

    it('should sort by Name', () => {
      cy.get('[data-testid="sort-header-name"]').click()
      cy.get('[data-testid="sort-icon-name-asc"]').should('exist')
      
      // Click again to sort descending
      cy.get('[data-testid="sort-header-name"]').click()
      cy.get('[data-testid="sort-icon-name-desc"]').should('exist')
    })

    it('should sort by Country', () => {
      cy.get('[data-testid="sort-header-country"]').click()
      cy.get('[data-testid="sort-icon-country-asc"]').should('exist')
    })

    it('should sort by Account No', () => {
      cy.get('[data-testid="sort-header-accountNo"]').click()
      cy.get('[data-testid="sort-icon-accountNo-asc"]').should('exist')
    })
  })

  describe('Row Selection', () => {
    it('should allow selecting individual rows', () => {
      const rowId = 'row-1' // Replace with actual ID from your test data
      cy.get(`[data-testid="checkbox-${rowId}"]`).check().should('be.checked')
      cy.get(`[data-testid="table-row-${rowId}"]`).should('have.class', 'bg-dark-blue')
    })

    it('should allow selecting all rows', () => {
      cy.get('[data-testid="select-all-checkbox"]').check().should('be.checked')
      // Verify all row checkboxes are checked
      cy.get('[data-testid^="checkbox-"]').each(($checkbox) => {
        cy.wrap($checkbox).should('be.checked')
      })
    })
  })

  describe('Status Toggle', () => {
    it('should open status toggle dialog', () => {
      const rowId = 'row-1' // Replace with actual ID from your test data
      cy.get(`[data-testid="status-switch-${rowId}"]`).click()
      cy.get('[data-testid="status-toggle-dialog"]').should('be.visible')
    })

    it('should confirm status change', () => {
      const rowId = 'row-1'
      const initialStatus = true // Get this from your test data
      
      cy.get(`[data-testid="status-switch-${rowId}"]`).click()
      cy.get('[data-testid="status-toggle-dialog"]').should('be.visible')
      
      // Verify dialog content
      if (initialStatus) {
        cy.get('[data-testid="status-toggle-dialog"]').should('contain', 'deactivate')
      } else {
        cy.get('[data-testid="status-toggle-dialog"]').should('contain', 'activate')
      }
      
      // Confirm the change
      cy.get('[data-testid="confirm-status-change"]').click()
      
      // Verify the switch has toggled
      cy.get(`[data-testid="status-switch-${rowId}"]`).should('have.attr', 'aria-checked', String(!initialStatus))
    })

    it('should cancel status change', () => {
      const rowId = 'row-1'
      const initialStatus = true // Get this from your test data
      
      cy.get(`[data-testid="status-switch-${rowId}"]`).click()
      cy.get('[data-testid="cancel-status-change"]').click()
      
      // Verify the switch remains unchanged
      cy.get(`[data-testid="status-switch-${rowId}"]`).should('have.attr', 'aria-checked', String(initialStatus))
    })
  })

  describe('Row Actions', () => {
    it('should show staff info dropdown', () => {
      const rowId = 'row-1'
      cy.get(`[data-testid="more-button-${rowId}"]`).click()
      cy.get(`[data-testid="staff-dropdown-${rowId}"]`).should('be.visible')
      
      // Verify staff info content
      cy.get(`[data-testid="staff-dropdown-${rowId}"]`).should('contain', 'Staff')
      cy.get(`[data-testid="staff-dropdown-${rowId}"]`).should('contain', 'Edit Receiver')
    })

    it('should delete a receiver', () => {
      const rowId = 'row-1'
      const receiverName = 'Test Receiver' // Replace with actual name from your test data
      
      cy.get(`[data-testid="delete-button-${rowId}"]`).click()
      
      // Verify confirmation dialog
      cy.on('window:confirm', (text) => {
        expect(text).to.equal(`Are you sure you want to delete ${receiverName}?`)
        return true
      })
      
      // Verify row is removed
      cy.get(`[data-testid="table-row-${rowId}"]`).should('not.exist')
    })
  })

  describe('Pagination', () => {
    it('should navigate between pages', () => {
      // Go to next page
      cy.get('[data-testid="next-button"]').click()
      cy.get('[data-testid="page-button-2"]').should('have.class', 'bg-[#004d7f]')
      
      // Go back to first page
      cy.get('[data-testid="prev-button"]').click()
      cy.get('[data-testid="page-button-1"]').should('have.class', 'bg-[#004d7f]')
    })

    it('should disable prev/next buttons when appropriate', () => {
      // On first page, prev should be disabled
      cy.get('[data-testid="prev-button"]').should('be.disabled')
      
      // Go to last page
      cy.get('[data-testid="page-button-3"]').click() // Adjust based on your test data
      cy.get('[data-testid="next-button"]').should('be.disabled')
    })
  })

  describe('Mobile View', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
    })

    it('should show mobile cards', () => {
      cy.get('[data-testid="mobile-view"]').should('be.visible')
      cy.get('[data-testid^="mobile-card-"]').should('have.length.gt', 0)
    })

    it('should allow selecting mobile cards', () => {
      const rowId = 'row-1'
      cy.get(`[data-testid="mobile-checkbox-${rowId}"]`).check().should('be.checked')
      cy.get(`[data-testid="mobile-card-${rowId}"]`).should('have.class', 'border-blue-500')
    })

    it('should show mobile actions', () => {
      const rowId = 'row-1'
      cy.get(`[data-testid="mobile-more-${rowId}"]`).click()
      cy.get(`[data-testid="staff-info-${rowId}"]`).should('be.visible')
    })
  })
})