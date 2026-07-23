import { 
  links, 
  titlePage,
  ids
 } from './config';

describe('Aula 03', () => {

  beforeEach(() => {
    const url = Cypress.env('url')
    cy.visit(url)
    cy.wait(1000);
  })

  it('Verifica links logo', () => {
    cy.get(ids.logoFeec).should('have.attr', 'href').and('include', links.FEEC);
    cy.get(ids.logoGitLab).should('have.attr', 'href').and('include', links.GitLab);
  })

  it('Verifica título da página', () => {
    cy.title().should('include', titlePage);
  });

  it('Verifica campos "Nome" e "Naturalidade"', () => {
    cy.get(ids.formsName).type('Alberto').blur();
    cy.get(ids.formsName).should(($input) => {
      const value = $input.val();
      const isUpperCase = value === value.toUpperCase();
      const isTransformed = $input.css('text-transform') === 'uppercase';
      expect(isUpperCase || isTransformed).to.be.true;
    });

    cy.get(ids.formsPlaceBirth).type('São-Paulo').blur();
    cy.get(ids.formsPlaceBirth).should(($input) => {
      const value = $input.val();
      const isUpperCase = value === value.toUpperCase();
      const isTransformed = $input.css('text-transform') === 'uppercase';
      expect(isUpperCase || isTransformed).to.be.true;
    });
  });

  it('Verifica campo "RA"', () => {
    const ra = 'a22-590111'
    cy.get(ids.formsRA).type(ra);
    cy.get(ids.formsRA).should('have.value', '225901');
  });
  
  it('Verifica campo "Data Nascimento"', () => {
    const birthDate = '09021998'
    cy.get(ids.formsBirthDate).type(birthDate);
    cy.get(ids.formsBirthDate).should('have.value', '09/02/1998');
  });

  it('Verifica campos "Universidade" e "Curso"', () => {
    cy.get(ids.formsUniversity).find('option').should('have.length.gte', 3);
    cy.get(ids.formsCourse).find('option').should('have.length.gte', 3);
  })

  it('Verifica campo "Semestre"', () => {
    cy.get(ids.formsSemesters).find('option').should('have.length.gte', 10);
  })

  it('Verifica alerta de campo não for preenchido', () => {
    cy.get(ids.formsPlaceBirth).type('SAO PAULO');
    cy.get(ids.formsBirthDate).type('1998-09-09');
    cy.get(ids.formsRA).type('225901');
    cy.get(ids.formsUniversity).find('option').eq(1).then(option => {
      cy.get(ids.formsUniversity).select(option.val());
    });
    cy.get(ids.formsCourse).find('option').eq(1).then(option => {
      cy.get(ids.formsCourse).select(option.val());
    });
    cy.get(ids.formsSemesters).find('option').eq(1).then(option => {
      cy.get(ids.formsSemesters).select(option.val());
    });

    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.get(ids.formsSubmitButton).click().then(() => {
        expect(alertStub.getCall(0)).to.be.calledWithMatch(/nome/i);
    });

    cy.get(ids.formsName).type('YAGO');
    cy.get(ids.formsPlaceBirth).clear();
    cy.get(ids.formsSubmitButton).click().then(() => {
        expect(alertStub.getCall(1)).to.be.calledWithMatch(/naturalidade/i);
    });

    cy.get(ids.formsPlaceBirth).type('SAO PAULO');
    cy.get(ids.formsBirthDate).clear();
    cy.get(ids.formsSubmitButton).click().then(() => {
        expect(alertStub.getCall(2)).to.be.calledWithMatch(/nascimento/i);
    });

    cy.get(ids.formsBirthDate).type('1998-09-09');
    cy.get(ids.formsRA).clear();
    cy.get(ids.formsSubmitButton).click().then(() => {
        expect(alertStub.getCall(3)).to.be.calledWithMatch(/ra/i);
    });

    cy.get(ids.formsRA).type('225901');
    cy.get(ids.formsUniversity).invoke('val', '')
    cy.get(ids.formsSubmitButton).click().then(() => {
        expect(alertStub.getCall(4)).to.be.calledWithMatch(/universidade/i);
    });

    cy.get(ids.formsUniversity).find('option').eq(1).then(option => {
      cy.get(ids.formsUniversity).select(option.val());
    });
    cy.get(ids.formsCourse).invoke('val', '')
    cy.get(ids.formsSubmitButton).click().then(() => {
        expect(alertStub.getCall(5)).to.be.calledWithMatch(/curso/i);
    });

    cy.get(ids.formsCourse).find('option').eq(1).then(option => {
      cy.get(ids.formsCourse).select(option.val());
    });
    cy.get(ids.formsSemesters).invoke('val', '')
    cy.get(ids.formsSubmitButton).click().then(() => {
        expect(alertStub.getCall(6)).to.be.calledWithMatch(/semestre/i);
    });
  });

  it('Verifica data', () => {
    const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const date = new Date();
    const completeZeros = (num, totalLength) => {
      return String(num).padStart(totalLength, '0');
    }
    const map = {
      dayname: weekDays[date.getDay()],
      hh: completeZeros(date.getHours(),2),
      min: completeZeros(date.getMinutes(),2),
      mm: completeZeros(date.getMonth() + 1,2),
      dd: completeZeros(date.getDate(),2),
      aaaa: completeZeros(date.getFullYear(),2)
    }

    const dateFormated = (map.dayname + ', ' + map.dd + "/" + map.mm + "/" + map.aaaa + ' ' + map.hh + ':' + map.min);
  
    cy.get(ids.date).invoke('text').then((text) => {
      expect(text).to.equal(dateFormated);
    })
  })
  
  it('Verifica links do Menu', () => {
    cy.get(ids.linkHome)
    .should(($link) => {
      const href = $link.attr('href');
      expect(href).to.be.oneOf(['', 'index.html', './index.html', '#']);
    });
    cy.get(ids.linkMoodle)
      .should('have.attr', 'href').and('include', links.Moodle);
    cy.get(ids.linkHTML)
      .should('have.attr', 'href').and('include', links.HTML);
    cy.get(ids.linkCSS)
      .should('have.attr', 'href').and('include', links.CSS);
    cy.get(ids.linkJS)
      .should('have.attr', 'href').and('include', links.JS);
  })
})