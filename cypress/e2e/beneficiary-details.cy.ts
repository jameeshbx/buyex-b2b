describe("Beneficiary Details Form", () => {
  beforeEach(() => {
    cy.visit("/staff/dashboard/beneficiary-details")
  })

  it("should show the form with NO selected by default", () => {
    cy.get('input[value="NO"]').should("be.checked")
    cy.get('input[placeholder="Beneficiary\'s name"]').should("be.visible")
  })

  it("should show the table when YES is selected", () => {
    cy.get('input[value="YES"]').click()
    cy.get("table").should("be.visible")
    cy.contains("University of Toronto").should("be.visible")
  })

  it("should filter the table by country", () => {
    cy.get('input[value="YES"]').click()
    cy.contains("Filter by country").click()
    cy.contains("UK").click()
    cy.contains("University College London (UCL)").should("be.visible")
    cy.contains("University of Toronto").should("not.exist")
  })

  it("should search the table", () => {
    cy.get('input[value="YES"]').click()
    cy.get('input[placeholder="Search"]').type("Munich")
    cy.contains("University of Munich").should("be.visible")
    cy.contains("University of Toronto").should("not.exist")
  })

  it("should select a receiver from the table", () => {
    cy.get('input[value="YES"]').click()
    cy.contains("tr", "University of Toronto").find('input[type="radio"]').click()
    cy.contains("tr", "University of Toronto").should("have.class", "bg-blue-50")
  })

  it("should validate required fields", () => {
    cy.get('input[value="NO"]').click()
    cy.contains("COUNTINUE").click()
    cy.contains("Receiver's full name is required").should("be.visible")
  })

  it("should show intermediary bank fields when YES is selected", () => {
    cy.get('input[value="NO"]').click()
    cy.get('input[name="anyIntermediaryBank"][value="YES"]').click()
    cy.get('input[placeholder="Intermediary bank name"]').should("be.visible")
  })

  it("should hide intermediary bank fields when NO is selected", () => {
    cy.get('input[value="NO"]').click()
    cy.get('input[name="anyIntermediaryBank"][value="YES"]').click()
    cy.get('input[placeholder="Intermediary bank name"]').should("be.visible")
    cy.get('input[name="anyIntermediaryBank"][value="NO"]').click()
    cy.get('input[placeholder="Intermediary bank name"]').should("not.exist")
  })

  it("should show country-specific fields based on selection", () => {
    cy.get('input[value="NO"]').click()

    // Select UK
    cy.get('select[name="receiverBankCountry"]').select("UK")
    cy.contains("Sort code").should("be.visible")
    cy.contains("Routing number").should("not.exist")

    // Select USA
    cy.get('select[name="receiverBankCountry"]').select("USA")
    cy.contains("Routing number").should("be.visible")
    cy.contains("Sort code").should("not.exist")
  })

  it("should reset the form when reset button is clicked", () => {
    cy.get('input[value="NO"]').click()
    cy.get('input[placeholder="Beneficiary\'s name"]').type("Test Name")
    cy.contains("RESET").click()
    cy.get('input[placeholder="Beneficiary\'s name"]').should("have.value", "")
  })
})
