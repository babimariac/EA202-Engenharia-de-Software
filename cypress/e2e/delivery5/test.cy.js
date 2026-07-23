import {
  ids
 } from './config';

describe('Aula 05', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.wait(1000);
  })

  it('Verifica inserção e consulta de aluno', () => {
    const obj = {ra: "225901", nome: "Yago", curso: "Eng. Controle e Automação"};
    const jsonString = JSON.stringify(obj);

    cy.get(ids.jsonContent).clear().type(jsonString, { parseSpecialCharSequences: false });
    cy.get(ids.postBtm).click()
    cy.get(ids.path).clear().type('/alunos/225901')
    cy.get(ids.getBtm).click()
    cy.wait(1000);
    cy.get(ids.result).then(($result) => {
      const resultText = $result.text();
      const resultObj = JSON.parse(resultText.replace('Payload: ', ''));
      expect(resultObj).to.deep.equal(obj);
    });
  })

  it('Verifica atualização de aluno', () => {
    const obj = {ra: "225901", nome: "Felipe", curso: "Eng. Controle e Automação"};
    const jsonString = JSON.stringify(obj);

    cy.get(ids.path).clear().type('/alunos/225901')
    cy.get(ids.jsonContent).clear().type(jsonString, { parseSpecialCharSequences: false });
    cy.get(ids.putBtm).click()
    cy.get(ids.getBtm).click()
    cy.get(ids.result).then(($result) => {
      const resultText = $result.text();
      const resultObj = JSON.parse(resultText.replace('Payload: ', ''));
      expect(resultObj).to.deep.equal(obj);
  });
  })

  it('Verifica deleção de aluno', () => {
    cy.get(ids.path).clear().type('/alunos/225901')
    cy.get(ids.deleteBtm).click()
    cy.get(ids.getBtm).click()
    cy.get(ids.result).should('contain.text','aluno inexistente');
  })

  it('Inserção de aluno para verificação posterior', () => {
    const obj = {ra: "850908", nome: "Ricardo R. Gudwin", curso: "Eng. Elétrica"};
    const jsonString = JSON.stringify(obj);

    cy.get(ids.jsonContent).clear().type(jsonString, { parseSpecialCharSequences: false });
    cy.get(ids.postBtm).click()
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