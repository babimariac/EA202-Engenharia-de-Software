import {
  ids
 } from './config';

describe('Aula 06', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.wait(1000);
  })


  it('Verifica consulta de aluno', () => {
    const ra = '225901'
    const name = 'Yago'
    const course = 'Eng. Controle e Automação'

    cy.get(ids.raConsultInput).type(ra)
    cy.get(ids.getBtm).click()

    cy.get(ids.table + ' tbody tr').should('have.length', 2)
    cy.get(ids.table + ' tbody tr').last().within(() => {
        cy.get('td').eq(0).should('contain', ra) 
        cy.get('td').eq(1).should('contain', name)
        cy.get('td').eq(2).should('contain', course)
    })
  })

  it('Verifica consulta de aluno inexistente', () => {
    const ra = '000000'

    cy.get(ids.raConsultInput).type(ra)
    cy.get(ids.getBtm).click()

    cy.get(ids.result).should('contain.text', 'aluno inexistente')
  })

  it('Verifica consulta RA vazio', () => {
    const ra = '225901'

    cy.get(ids.getBtm).click()

    cy.get(ids.table + ' tbody tr').last().within(() => {
      cy.get('td').eq(0).should('contain', ra)
    })
  })

  it('Verifica inserção de aluno existente', () => {
    const ra = '225901'
    const name = 'Yago'
    const course = 'Eng. Controle e Automação'
    cy.get(ids.raInsertInput).type(ra)
    cy.get(ids.courseInput).type(course)
    cy.get(ids.nameInput).type(name)

    cy.get(ids.insertBtm).click()
    cy.get(ids.result).should('contain.text', 'aluno ja existente')
  })  

  it('Verifica atualização de aluno', () => {
    const ra = '225901'
    const name = 'Felipe'
    const course = 'Eng. Controle e Automação'
    cy.get(ids.raInsertInput).type(ra)
    cy.get(ids.courseInput).type(course)
    cy.get(ids.nameInput).type(name)

    cy.get(ids.updateBtm).click()
    cy.get(ids.getBtm).click()

    cy.get(ids.table + ' tbody tr').last().within(() => {
      cy.get('td').eq(0).should('contain', ra) 
      cy.get('td').eq(1).should('contain', name)
      cy.get('td').eq(2).should('contain', course)
    })

  })

  it('Verifica atualização de aluno não existente', () => {
    const ra = '000000'
    const name = 'Felipe'
    const course = 'Eng. Controle e Automação'
    cy.get(ids.raInsertInput).type(ra)
    cy.get(ids.courseInput).type(course)
    cy.get(ids.nameInput).type(name)

    cy.get(ids.updateBtm).click()
    cy.get(ids.result).should('contain.text', 'aluno inexistente')
  })

  it('Verifica deleção de aluno', () => {
    const ra = '225901'

    cy.get(ids.raConsultInput).type(ra)
    cy.get(ids.deleteBtm).click()
    cy.get(ids.raConsultInput).clear()
    cy.get(ids.getBtm).click()
    cy.get(ids.table + ' tbody tr').last().within(() => {
      cy.get('td').eq(0).should('not.contain', ra)
    })
  })

  it('Verifica deleção de aluno inexistente', () => {
    const ra = '000000'

    cy.get(ids.raConsultInput).type(ra)
    cy.get(ids.deleteBtm).click()
   
    cy.get(ids.result).should('contain.text', 'aluno inexistente')
  })
})