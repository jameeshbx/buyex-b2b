describe("Features Accordion", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/") // adjust to your route if it's different
  })

  it("renders all accordion items", () => {
    const featureTitles = [
      "Real Time Tracking",
      "Exchange Rate Control",
      "Your Own Brand Name",
      "Digital Remittances",
      "Revenue Opportunity",
      "Branch Specific Insights"
    ]

    featureTitles.forEach(title => {
      cy.contains("h3", title).should("exist")
    })
  })

  it("opens and closes accordion items correctly", () => {
    // First item should be open by default
    cy.contains("Real Time Tracking")
      .parent()
      .next()
      .should("contain.text", "It provides an unprecedented level of transparency")

    // Click to open a different item
    cy.contains("Exchange Rate Control").click()

    // Verify it opens
    cy.contains("Exchange Rate Control")
      .parent()
      .next()
      .should("contain.text", "Take control of your international transfers")

    // Click again to close it
    cy.contains("Exchange Rate Control").click()

    cy.contains("Exchange Rate Control")
      .parent()
      .next()
      .should("not.be.visible")
  })
})
