describe('OPENMCT-6', () => {
    
    it('The application shall maintain the user-selected table sort after toggling telemetry points', () => {
        cy.intercept('GET', '/sockjs-node/info?t=**').as('loaded')
        cy.visit('/')
        cy.wait(['@loaded','@loaded'])

        cy.get('.timestamp-sort').should('be.visible')
        cy.checkTableFirstAndLastValue(15)
        cy.get('.timestamp-sort').click()
        cy.checkTableFirstAndLastValue(-15)
        cy.get('[value="pwr.v"]').click()
        cy.checkTableFirstAndLastValue(-15)
        cy.get('[value="pwr.c"]').click()
        cy.checkTableFirstAndLastValue(-15)
    })
    it('The application shall maintain the user-selected table sort order after reload', () => {
        //Note: this test will fail due to the lack of persistent user preference configuration

        cy.intercept('GET', '/sockjs-node/info?t=**').as('loaded')
        cy.visit('/')
        cy.wait(['@loaded','@loaded'])

        cy.get('.timestamp-sort').should('be.visible').and('have.class', 'desc')
        cy.checkTableFirstAndLastValue(15)
        cy.get('.timestamp-sort').should('have.class', 'desc').click()
        cy.checkTableFirstAndLastValue(-15)
        cy.get('.timestamp-sort').should('have.class', 'asc')
        cy.reload()
        cy.wait(['@loaded','@loaded'])
        cy.get('.timestamp-sort').should('have.class', 'asc') //This will fail
        cy.checkTableFirstAndLastValue(-15) //This will fail
    })
})