// No import needed for 'cy' in Cypress test files

describe('Order Details Form', () => {
  beforeEach(() => {
    // Visit the page containing the form
    cy.visit('http://localhost:3000/staff/dashboard/placeorder');
  });

  it('should load the form correctly', () => {
    // Check if the form exists
    cy.get('form').should('exist');
    
    // Check if all form sections are visible
    cy.contains('Purpose').should('be.visible');
    cy.contains('Foreign bank charges').should('be.visible');
    cy.contains('Payer').should('be.visible');
    cy.contains('Choose forex partner').should('be.visible');
    cy.contains('Margin').should('be.visible');
    cy.contains('Receiver\'s bank country').should('be.visible');
    cy.contains('Student name').should('be.visible');
    cy.contains('Choose consultancy').should('be.visible');
    cy.contains('IBR Rate').should('be.visible');
    cy.contains('Amount').should('be.visible');
    cy.contains('Total amount').should('be.visible');
    cy.contains('Customer rate').should('be.visible');
    
    // Check if buttons are visible
    cy.contains('button', 'Download Quote').should('be.visible');
    cy.contains('button', 'PROCEED').should('be.visible');
    cy.contains('button', 'RESET').should('be.visible');
  });

  it('should have OUR selected as default for foreign bank charges', () => {
    cy.get('#our').should('be.checked');
    cy.get('#ben').should('not.be.checked');
  });

  it('should have INR as default currency', () => {
    cy.contains('button', 'INR').should('be.visible');
  });

  it('should fill all form fields with valid data', () => {
    // Fill purpose dropdown
    cy.get('select[name="purpose"]').parent().click();
    cy.contains('University fee transfer').click();
    
    // Check foreign bank charges (OUR is default)
    cy.get('#ben').click();
    
    // Fill payer dropdown
    cy.get('select[name="payer"]').parent().click();
    cy.contains('Self').click();
    
    // Fill forex partner dropdown
    cy.get('select[name="forexPartner"]').parent().click();
    cy.contains('Nium Forex India Pvt Ltd').click();
    
    // Fill margin
    cy.get('input[name="margin"]').type('5');
    
    // Fill receiver's bank country
    cy.get('select[name="receiverBankCountry"]').parent().click();
    cy.contains('Germany').click();
    
    // Fill student name
    cy.get('input[name="studentName"]').type('John Doe');
    
    // Fill consultancy
    cy.get('select[name="consultancy"]').parent().click();
    cy.contains('SPAN').click();
    
    // Fill IBR Rate
    cy.get('input[name="ibrRate"]').type('110.5');
    
    // Fill amount
    cy.get('input[name="amount"]').type('7500');
    
    // Check if all fields are filled correctly
    cy.get('select[name="purpose"]').should('have.value', 'University fee transfer');
    cy.get('#ben').should('be.checked');
    cy.get('select[name="payer"]').should('have.value', 'Self');
    cy.get('select[name="forexPartner"]').should('have.value', 'Nium Forex India Pvt Ltd');
    cy.get('input[name="margin"]').should('have.value', '5');
    cy.get('select[name="receiverBankCountry"]').should('have.value', 'Germany');
    cy.get('input[name="studentName"]').should('have.value', 'John Doe');
    cy.get('select[name="consultancy"]').should('have.value', 'SPAN');
    cy.get('input[name="ibrRate"]').should('have.value', '110.5');
    cy.get('input[name="amount"]').should('have.value', '7500');
  });

  it('should show calculation when clicking the view calculation button', () => {
    // Fill amount to enable calculation
    cy.get('input[name="amount"]').type('7500');
    
    // Click on view calculation button
    cy.contains('Enter amount to view calculation').click();
    
    // Check if calculation is visible
    cy.contains('INR Amount').should('be.visible');
    cy.contains('Bank Fee').should('be.visible');
    cy.contains('GST').should('be.visible');
    cy.contains('TCS Applicable').should('be.visible');
    cy.contains('Total Payable').should('be.visible');
    
    // Check if total amount and customer rate are populated
    cy.get('input[name="totalAmount"]').should('have.value', '10,11,399.30');
    cy.get('input[name="customerRate"]').should('have.value', '113.18');
  });

  it('should hide calculation when clicking the hide button', () => {
    // Fill amount to enable calculation
    cy.get('input[name="amount"]').type('7500');
    
    // Show calculation
    cy.contains('Enter amount to view calculation').click();
    
    // Verify calculation is visible
    cy.contains('INR Amount').should('be.visible');
    
    // Hide calculation
    cy.contains('Hide Calculation').parent().find('button').click();
    
    // Verify calculation is hidden
    cy.contains('INR Amount').should('not.exist');
  });

  it('should reset the form when clicking the RESET button', () => {
    // Fill some fields
    cy.get('input[name="studentName"]').type('John Doe');
    cy.get('input[name="amount"]').type('7500');
    
    // Show calculation
    cy.contains('Enter amount to view calculation').click();
    
    // Click reset button
    cy.contains('button', 'RESET').click();
    
    // Check if fields are reset
    cy.get('input[name="studentName"]').should('have.value', '');
    cy.get('input[name="amount"]').should('have.value', '');
    cy.contains('INR Amount').should('not.exist'); // Calculation should be hidden
  });

  it('should automatically set receiver bank country based on purpose selection', () => {
    // Select "Blocked account transfer" purpose
    cy.get('select[name="purpose"]').parent().click();
    cy.contains('Blocked account transfer').click();
    
    // Check if Germany is automatically selected
    cy.get('select[name="receiverBankCountry"]').should('have.value', 'Germany');
    
    // Check if the field is disabled
    cy.get('select[name="receiverBankCountry"]').parent().should('have.class', 'opacity-50');
    
    // Select "GIC Canada fee deposite" purpose
    cy.get('select[name="purpose"]').parent().click();
    cy.contains('GIC Canada fee deposite').click();
    
    // Check if Canada is automatically selected
    cy.get('select[name="receiverBankCountry"]').should('have.value', 'Canada');
  });

  it('should submit the form with valid data', () => {
    // Spy on form submission
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLog');
    });
    
    // Fill required fields
    cy.get('select[name="purpose"]').parent().click();
    cy.contains('University fee transfer').click();
    
    cy.get('select[name="payer"]').parent().click();
    cy.contains('Self').click();
    
    cy.get('select[name="forexPartner"]').parent().click();
    cy.contains('Nium Forex India Pvt Ltd').click();
    
    cy.get('input[name="margin"]').type('5');
    
    cy.get('select[name="receiverBankCountry"]').parent().click();
    cy.contains('Germany').click();
    
    cy.get('input[name="studentName"]').type('John Doe');
    
    cy.get('select[name="consultancy"]').parent().click();
    cy.contains('SPAN').click();
    
    cy.get('input[name="ibrRate"]').type('110.5');
    
    cy.get('input[name="amount"]').type('7500');
    
    // Submit the form
    cy.contains('button', 'PROCEED').click();
    
    // Check if form data was logged to console
    cy.get('@consoleLog').should('be.calledWithMatch', {
      purpose: 'University fee transfer',
      foreignBankCharges: 'OUR',
      payer: 'Self',
      forexPartner: 'Nium Forex India Pvt Ltd',
      margin: '5',
      receiverBankCountry: 'Germany',
      studentName: 'John Doe',
      consultancy: 'SPAN',
      ibrRate: '110.5',
      amount: '7500',
      currency: 'INR'
    });
  });

  it('should test the Download Quote button', () => {
    // Since we can't test actual download in Cypress, we'll just verify the button exists and is clickable
    cy.contains('button', 'Download Quote')
      .should('be.visible')
      .should('not.be.disabled')
      .should('have.css', 'background')
      .and('include', 'linear-gradient');
    
    // Verify the button has the download icon
    cy.contains('button', 'Download Quote')
      .find('svg')
      .should('exist');
  });

  it('should test button styling and appearance', () => {
    // Test Download Quote button styling
    cy.contains('button', 'Download Quote')
      .should('have.css', 'border-radius', '4px')
      .should('have.css', 'color', 'rgb(255, 255, 255)');
    
    // Test PROCEED button styling
    cy.contains('button', 'PROCEED')
      .should('have.css', 'background-color')
      .and('not.equal', 'rgba(0, 0, 0, 0)');
    
    // Test RESET button styling
    cy.contains('button', 'RESET')
      .should('have.css', 'border-color')
      .and('not.equal', 'rgb(0, 0, 0)');
  });
});