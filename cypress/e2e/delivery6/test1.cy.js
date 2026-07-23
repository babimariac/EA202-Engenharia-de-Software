import { 
  links, 
  ids
 } from './config';

describe('Aula 06', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.wait(1000);
  })

  it('Verifica inserção de aluno', () => {
    const ra = '225901'
    const name = 'Yago'
    const course = 'Eng. Controle e Automação'
    cy.get(ids.raInsertInput).type(ra)
    cy.get(ids.courseInput).type(course)
    cy.get(ids.nameInput).type(name)

    cy.get(ids.getBtm).click()

    cy.get(ids.table + ' tbody tr').then($rows => {
      const quantidadeAntes = $rows.length
      cy.get(ids.insertBtm).click()
      cy.get(ids.getBtm).click()
 
      cy.get(ids.table + ' tbody tr').should('have.length', quantidadeAntes + 1)
      cy.get(ids.table + ' tbody tr').last().within(() => {
        cy.get('td').eq(0).should('contain', ra) 
        cy.get('td').eq(1).should('contain', name)
        cy.get('td').eq(2).should('contain', course)
      })
    })
  })

})