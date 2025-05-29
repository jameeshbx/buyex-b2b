/// <reference types="cypress" />

describe('Add Receivers Page', () => {
  beforeEach(() => {
    cy.visit('/add-receivers') // Update with your actual route
  })

  it('should load the page successfully', () => {
    cy.get('h1').should('contain', 'Add Receivers') // Update with your actual page title
    cy.get('form').should('exist')
  })

  it('should validate required fields', () => {
    cy.get('button[type="submit"]').click()
    
    // Check for validation errors
    cy.contains("Receiver's full Name is required").should('exist')
    cy.contains("Receiver's country is required").should('exist')
    cy.contains("Address is required").should('exist')
    cy.contains("Receiver's bank is required").should('exist')
    cy.contains("Receiver bank's country is required").should('exist')
    cy.contains("Receiver's account is required").should('exist')
    cy.contains("Receiver's bank Swift/BIC code is required").should('exist')
  })

  it('should fill and submit the form successfully', () => {
    // Fill in basic information
    cy.get('input[name="receiverFullName"]').type('John Doe')
    cy.get('select[name="receiverCountry"]').select('United States')
    cy.get('input[name="address"]').type('123 Main St, New York')
    cy.get('input[name="receiverBank"]').type('Chase Bank')
    cy.get('select[name="receiverBankCountry"]').select('United States')
    cy.get('input[name="receiverAccount"]').type('1234567890')
    cy.get('input[name="receiverBankSwiftCode"]').type('CHASUS33')
    
    // Fill in country-specific fields (US routing number in this case)
    cy.get('input[name="routingNumber"]').type('021000021')
    
    // Fill in additional information
    cy.get('input[name="totalRemittance"]').type('10000')
    cy.get('textarea[name="field70"]').type('Test payment')
    
    // Submit the form
    cy.get('button[type="submit"]').click()
    
    // Verify the form submission (adjust based on your app's behavior)
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Form submitted successfully')
    })
  })

  it('should show/hide intermediary bank fields based on selection', () => {
    // Initially, intermediary bank fields should not be visible
    cy.get('input[name="intermediaryBankName"]').should('not.exist')
    
    // Select "YES" for intermediary bank
    cy.contains('YES').click()
    
    // Now intermediary bank fields should be visible
    cy.get('input[name="intermediaryBankName"]').should('exist')
    cy.get('input[name="intermediaryBankAccountNo"]').should('exist')
    cy.get('input[name="intermediaryBankIBAN"]').should('exist')
    cy.get('input[name="intermediaryBankSwiftCode"]').should('exist')
    
    // Select "NO" for intermediary bank
    cy.contains('NO').click()
    
    // Fields should be hidden again
    cy.get('input[name="intermediaryBankName"]').should('not.exist')
  })

  it('should show/hide country-specific bank fields', () => {
    // Test for United States (should show routing number)
    cy.get('select[name="receiverBankCountry"]').select('United States')
    cy.get('input[name="routingNumber"]').should('exist')
    cy.get('input[name="iban"]').should('not.exist')
    
    // Test for United Kingdom (should show sort code)
    cy.get('select[name="receiverBankCountry"]').select('United Kingdom')
    cy.get('input[name="sortCode"]').should('exist')
    cy.get('input[name="routingNumber"]').should('not.exist')
    
    // Test for Australia (should show BSB code)
    cy.get('select[name="receiverBankCountry"]').select('Australia')
    cy.get('input[name="bsbCode"]').should('exist')
    cy.get('input[name="sortCode"]').should('not.exist')
  })

  it('should sync receiver country with bank country by default', () => {
    cy.get('select[name="receiverCountry"]').select('Canada')
    cy.get('select[name="receiverBankCountry"]').should('have.value', 'Canada')
    
    // Changing bank country manually should break the sync
    cy.get('select[name="receiverBankCountry"]').select('United States')
    cy.get('select[name="receiverCountry"]').select('Germany')
    cy.get('select[name="receiverBankCountry"]').should('have.value', 'United States')
  })

  it('should display validation errors for invalid inputs', () => {
    // Test invalid swift code format
    cy.get('input[name="receiverBankSwiftCode"]').type('invalid')
    cy.contains('Invalid Swift/BIC code format').should('exist')
    
    // Test invalid account number
    cy.get('input[name="receiverAccount"]').type('abc')
    cy.contains('Account number must be alphanumeric').should('exist')
    
    // Test invalid routing number
    cy.get('select[name="receiverBankCountry"]').select('United States')
    cy.get('input[name="routingNumber"]').type('123')
    cy.contains('Routing number must be 9 digits').should('exist')
  })
})