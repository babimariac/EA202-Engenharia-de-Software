import {
  ids
 } from './config';

describe('Aula 05', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.wait(1000);
  })

  it('Verificação de aluno inserido no passo anterior', () => {
    const obj = {ra: "850908", nome: "Ricardo R. Gudwin", curso: "Eng. Elétrica"};
    const jsonString = JSON.stringify(obj);

    cy.get(ids.jsonContent).clear().type(jsonString, { parseSpecialCharSequences: false });
    cy.get(ids.path).clear().type('/alunos/850908')
    cy.get(ids.getBtm).click()
    cy.wait(1000);
    cy.get(ids.result).then(($result) => {
      const resultText = $result.text();
      const resultObj = JSON.parse(resultText.replace('Payload: ', ''));
      expect(resultObj).to.deep.equal(obj);
    });
  })
})
