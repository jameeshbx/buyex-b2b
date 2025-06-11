describe("User Management", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("should display the user management interface", () => {
    cy.get('[data-cy="usertype-select"]').should("exist")
    cy.get('[data-cy="userid-input"]').should("exist")
    cy.get('[data-cy="name-input"]').should("exist")
    cy.get('[data-cy="email-input"]').should("exist")
    cy.get('[data-cy="submit-button"]').should("exist")
    cy.get('[data-cy="filter-button"]').should("exist")
    cy.get('[data-cy="search-input"]').should("exist")
  })

  it("should auto-generate user ID based on selected user type", () => {
    // Check default user ID (Admin)
    cy.get('[data-cy="userid-input"]').should("have.value", "adm003")

    // Change user type to Staff
    cy.get('[data-cy="usertype-select"]').click()
    cy.contains("Staff").click()

    // Check updated user ID
    cy.get('[data-cy="userid-input"]').should("have.value", "stf003")
  })

  it("should validate form inputs", () => {
    // Submit empty form
    cy.get('[data-cy="submit-button"]').click()

    // Check for validation errors
    cy.contains("Name must be at least 2 characters").should("exist")
    cy.contains("Please enter a valid email address").should("exist")

    // Fill form with valid data
    cy.get('[data-cy="name-input"]').type("Test User")
    cy.get('[data-cy="email-input"]').type("invalid-email")

    // Submit with invalid email
    cy.get('[data-cy="submit-button"]').click()
    cy.contains("Please enter a valid email address").should("exist")

    // Fix email and submit
    cy.get('[data-cy="email-input"]').clear().type("test@example.com")
    cy.get('[data-cy="submit-button"]').click()

    // Check if new user is added to the table
    cy.contains("Test User").should("exist")
  })

  it("should filter users by type with checkboxes", () => {
    // Open filter dropdown
    cy.get('[data-cy="filter-button"]').click()

    // Uncheck Admin
    cy.get('[data-cy="admin-filter-checkbox"]').uncheck()
    cy.get('[data-cy="apply-filter-button"]').click()

    // Check if only Staff users are displayed
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row).should("contain", "Staff")
    })

    // Open filter dropdown again
    cy.get('[data-cy="filter-button"]').click()

    // Check Admin and uncheck Staff
    cy.get('[data-cy="admin-filter-checkbox"]').check()
    cy.get('[data-cy="staff-filter-checkbox"]').uncheck()
    cy.get('[data-cy="apply-filter-button"]').click()

    // Check if only Admin users are displayed
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row).should("contain", "Admin")
    })

    // Reset filters
    cy.get('[data-cy="filter-button"]').click()
    cy.get('[data-cy="admin-filter-checkbox"]').check()
    cy.get('[data-cy="staff-filter-checkbox"]').check()
    cy.get('[data-cy="apply-filter-button"]').click()
  })

  it("should search users", () => {
    // Search for a specific user
    cy.get('[data-cy="search-input"]').type("ADMIN1")

    // Check if only matching users are displayed
    cy.get("table tbody tr").should("have.length", 1)
    cy.contains("ADMIN1").should("exist")

    // Search by email
    cy.get('[data-cy="search-input"]').clear().type("staff2@buyexchange.in")
    cy.get("table tbody tr").should("have.length", 1)
    cy.contains("STAFF2").should("exist")

    // Search by user ID
    cy.get('[data-cy="search-input"]').clear().type("adm002")
    cy.get("table tbody tr").should("have.length", 1)
    cy.contains("ADMIN2").should("exist")

    // Clear search
    cy.get('[data-cy="search-input"]').clear()
  })

  it("should show confirmation dialog when toggling status", () => {
    // Click on status toggle
    cy.get('[data-cy^="status-toggle-"]').first().click()

    // Check if confirmation dialog appears
    cy.get('[data-cy="status-toggle-dialog"]').should("exist")
    cy.contains("Confirm Status Change").should("exist")

    // Cancel the action
    cy.get('[data-cy="cancel-status-toggle"]').click()
    cy.get('[data-cy="status-toggle-dialog"]').should("not.exist")

    // Try again and confirm
    cy.get('[data-cy^="status-toggle-"]').first().click()
    cy.get('[data-cy="confirm-status-toggle"]').click()

    // Dialog should close
    cy.get('[data-cy="status-toggle-dialog"]').should("not.exist")
  })

  it("should delete a user", () => {
    // Count initial number of users
    cy.get("table tbody tr").then(($rows) => {
      const initialCount = $rows.length

      // Delete the first user
      cy.get('[data-cy^="delete-user-"]').first().click()

      // Check if user is removed
      cy.get("table tbody tr").should("have.length", initialCount - 1)
    })
  })

  it("should handle pagination correctly", () => {
    // Check if pagination is centered and visible
    cy.get('[data-cy="page-1"]').should("exist")

    // If there are multiple pages, test navigation
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="next-page"]').length > 0) {
        cy.get('[data-cy="next-page"]').should("not.be.disabled")
        cy.get('[data-cy="prev-page"]').should("be.disabled")
      }
    })
  })

  it("should be responsive", () => {
    // Test on mobile viewport
    cy.viewport("iphone-6")
    cy.get('[data-cy="usertype-select"]').should("be.visible")
    cy.get('[data-cy="submit-button"]').should("be.visible")
    cy.get('[data-cy="filter-button"]').should("be.visible")

    // Test on tablet viewport
    cy.viewport("ipad-2")
    cy.get('[data-cy="usertype-select"]').should("be.visible")
    cy.get('[data-cy="submit-button"]').should("be.visible")

    // Test on desktop viewport
    cy.viewport(1280, 800)
    cy.get('[data-cy="usertype-select"]').should("be.visible")
    cy.get('[data-cy="submit-button"]').should("be.visible")
  })
})
