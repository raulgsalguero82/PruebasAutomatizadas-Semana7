let faker = require('faker');
let dataPool = require("../../login.datasets.json");

describe('Testing Login Feature', () => {
  
  debugger;
  

  let id=0;

  dataPool.usernameScenarios.scenarios.forEach((usernameScenario) => {


    let usernameScenarioExpected = (usernameScenario.typeOfScenario === "positive") ? true : false;

    popuplateDataForFaker(usernameScenario);

    usernameScenario.data.forEach((usernameItem) => {
      
      

      dataPool.passwordScenarios.scenarios.forEach((passwordScenario) => {

        

        popuplateDataForFaker(passwordScenario);

        passwordScenario.data.forEach((passwordItem) => {

          let passwordScenarioExpected = (passwordScenario.typeOfScenario === "positive") ? true : false;
          let scenarioResult = passwordScenarioExpected && usernameScenarioExpected;
          let scenarioName = ( (usernameScenario.id-1)*dataPool.passwordScenarios.scenarios.length+ passwordScenario.id  )+ '- When ' + usernameScenario.name + ' and ' + passwordScenario.name + ((scenarioResult) ? ' should' : ' should NOT') + ' let a user login';

            it(scenarioName, () => {


              gotoLoginPage();

              popuplateLoginForm(usernameItem, passwordItem);

              tryToLogin();

              /**
               * Verify operation result
               */
              if (scenarioResult) {
                /**
                * Verify a possitive scenario (user should be able to login)
                */
                cy.wait(500);
                cy.get('span.gh-user-email').scrollIntoView().should('be.visible');
              }
              else {
                /**
                 * Verify a negative scenario (user should NOT be able to login)
                 */
                cy.wait(100);
                cy.get('p.main-error').scrollIntoView().should('be.visible');
              }

            });
          
        });

      });

    });

  });


  function gotoLoginPage() {
    const baseGhostURL = Cypress.config('baseGhostURL');
    cy.visit(baseGhostURL + 'ghost/#/signin');
    cy.wait(500);
  }

  function popuplateLoginForm(username, password) {
    /**
    * Populate form
    */
    if (username.item !== "") {
      cy.get('input[name="identification"]').type(username.item, {delay : 3 , force: true });
    }
    else {
      cy.get('input[name="identification"]').clear({ force: true });
    }

    if (password.item !== "") {
      cy.get('input[name="password"]').type(password.item, {delay : 3 , force: true });
    }
    else {
      cy.get('input[name="password"]').clear({ force: true });
    }



  }

  function tryToLogin() {
    cy.get('button.login.gh-btn.gh-btn-blue').click({ force: true });
  }

});


function popuplateDataForFaker(scenario) {
  if (scenario.useFaker === true) 
  {

    console.log("items: "+ scenario.fakerItems );

    scenario.data=[];

    if (scenario.typeOfFaker === "email") {
      for (let i = 0; i < scenario.fakerItems; i++) {
        let email=faker.internet.email();
        scenario.data.push({ "item": email  });
        console.log("email: "+ email);
      }
    }
    else if (scenario.typeOfFaker === "password") {
      for (let i = 0; i < scenario.fakerItems; i++) {
        let password=faker.internet.password();
        scenario.data.push({ "item": password });

        console.log("password: "+ password);
      }
    }

  }
}

