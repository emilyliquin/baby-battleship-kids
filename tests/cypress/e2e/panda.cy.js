// this is a test file for checking the PANDA workflow


describe('test that the project will run successfully on panda', () => {
  it('should provide a properly formatted prolific end point when it starts in prolific mode', () => {
    cy.viewport(1000, 1200) // cy.viewport('iphone-11)

    // visit the page
    cy.visit(
      `${Cypress.env(
        'VITE_DEPLOY_URL'
      )}#/welcome/panda/?ID=xxxxx&STARTTIME=xxxxxx`
    )

    cy.get('[id=finishp]').click()
      // seems ok then

    cy.get('[id=bird]').click()

    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()

    // sign adult consent
    cy.get('[id=sigpad]').click()
    cy.get('[id=finishp]').click()

    // sign child consent
    cy.get('[id=yes]').click()

    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()

    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()

    // feature checks
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()
    cy.get('.overlay').first().click()

    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()

    cy.get('.overlay').first().click()

    cy.get('[id=finishp]').click()
    cy.get('[id=finishp]').click()


  })
})
