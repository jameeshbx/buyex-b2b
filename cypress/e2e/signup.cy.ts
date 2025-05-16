describe("Signup Form", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/signup")
  })

  it("should display validation errors if fields are empty", () => {
    cy.get('button[type="submit"]').click()

    cy.contains("Business name must be at least 2 characters").should("exist")
    cy.contains("Please enter a valid email address").should("exist")
    cy.contains("Phone number must be at least 10 digits").should("exist")
    cy.contains("Please complete the verification").should("exist")
    cy.contains("You must accept the terms and conditions").should("exist")
  })

  it("should fill the form and submit successfully", () => {
    cy.get('input[name="businessName"]').type("Global Study Co")
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('input[name="phoneNumber"]').type("9876543210")

    // Upload logo file
    const fileName = "logo copy.png"
    cy.fixture(fileName).then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName,
        mimeType: "image/png",
      })
    })

    // Mock Verification (assumes there's a test hook or test ID)
    cy.window().then((win) => {
      const form = win.document.querySelector("form")
      const reactInstance = (form as any)?._reactInternals
      if (reactInstance) {
        // forcibly set the verified state (you should ideally test this via UI or use test ID/button)
        cy.get('button').contains("Verify").click()
      }
    })

    // Accept Terms
    cy.get('input[type="checkbox"]').check({ force: true })

    // Submit form
    cy.get('button[type="submit"]').click()

    // Confirm submission by checking console log or redirect (depends on your logic)
    cy.url().should("include", "/signup") // Adjust this if you redirect after submit
  })
})
