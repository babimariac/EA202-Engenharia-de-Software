describe('Aula 04', () => {
  it('Verifica frase Hello World', () => {
    cy.request('http://localhost:2020/').its('body').should('include', 'Hello World');
  })
})