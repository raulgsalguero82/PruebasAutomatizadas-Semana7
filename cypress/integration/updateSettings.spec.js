const faker = require('faker')
const dataPool = require('../../settings.datasets.json')

const baseGhostURL = Cypress.config('baseGhostURL')

describe('Testing Title And Description Feature', () => {

	dataPool.metaTitleScenarios.scenarios.forEach((titleScenario) => {
		let titleScenarioExpected = titleScenario.typeOfScenario === 'positive' ? true : false

		populateDataForFaker(titleScenario)

		titleScenario.data.forEach((titleItem) => {
			dataPool.metaDescriptionScenarios.scenarios.forEach((descriptionScenario) => {
				populateDataForFaker(descriptionScenario)

				descriptionScenario.data.forEach((descriptionItem) => {
					let descriptionScenarioExpected =
						descriptionScenario.typeOfScenario === 'positive' ? true : false
					let scenarioResult = descriptionScenarioExpected && titleScenarioExpected
					let scenarioName =
						(Number(titleScenario.id) - 1) * dataPool.metaDescriptionScenarios.scenarios.length +
						Number(descriptionScenario.id) +
						' - When ' +
						titleScenario.name +
						' and ' +
						descriptionScenario.name +
						(scenarioResult ? ' should ' : ' should NOT ') +
						' let update title and description '

					it(scenarioName, () => {
                        LoginToPrivateSection()
						NavigateToSettingSection()

						ExpandTitleDescriptionSection()
						ChangeTitleAndDescription(titleItem.item, descriptionItem.item)

						SaveUpdateSettings()
						cy.wait(300)

						if (scenarioResult) {
							cy.contains('Saved').should('be.visible')
						} else {
							cy.get('p.response').should('be.visible')
						}
					})
				})
			})
		})
	})

	function ExpandTitleDescriptionSection() {
		cy.get('.gh-setting-first').first().contains('Expand').click({ force: true })
		cy.wait(300)
	}

	function ChangeTitleAndDescription(newTitle, newDescription) {
		cy.get('.gh-setting-first input').then(($elements) => {
            if (newTitle === ''  && newDescription === '') {
                cy.wrap($elements[0]).clear({ force: true })
                cy.wrap($elements[1]).clear({ force: true })
            } else if (newTitle === '' && newDescription.length > 0) {
                cy.wrap($elements[0]).clear({ force: true })
                cy.wrap($elements[1]).clear({ force: true }).type(newDescription, { force: true })
            } else if (newDescription === '' && newTitle.length > 0) {
                cy.wrap($elements[0]).clear({ force: true }).type(newTitle, { force: true })
                cy.wrap($elements[1]).clear({ force: true })
            } else {
                cy.wrap($elements[0]).clear({ force: true }).type(newTitle, { force: true })
                cy.wrap($elements[1]).clear({ force: true }).type(newDescription, { force: true })
            }
			cy.wait(300)
		})
	}
})

describe('Testing Metadata Feature', () => {
	dataPool.metaTitleScenarios.scenarios.forEach((titleScenario) => {
		let titleScenarioExpected = titleScenario.typeOfScenario === 'positive' ? true : false

		populateDataForFaker(titleScenario)

		titleScenario.data.forEach((titleItem) => {
			dataPool.metaDescriptionScenarios.scenarios.forEach((descriptionScenario) => {
				populateDataForFaker(descriptionScenario)

				descriptionScenario.data.forEach((descriptionItem) => {
					let descriptionScenarioExpected =
						descriptionScenario.typeOfScenario === 'positive' ? true : false
					let scenarioResult = descriptionScenarioExpected && titleScenarioExpected
					let scenarioName =
						(Number(titleScenario.id) - 1) *
							dataPool.metaDescriptionScenarios.scenarios.length +
						Number(descriptionScenario.id) +
						' - When ' +
						titleScenario.name +
						' and ' +
						descriptionScenario.name +
						(scenarioResult ? ' should ' : ' should NOT ') +
						' let update title and description '

					it(scenarioName, () => {
						LoginToPrivateSection()
						NavigateToSettingSection()

						ExpandMetadataSection()
						ChangeMetaData(titleItem.item, descriptionItem.item)

						SaveUpdateSettings()
						cy.wait(300)

						if (scenarioResult) {
							cy.contains('Saved').should('be.visible')
						} else {
							cy.get('p.response').should('be.visible')
						}
					})
				})
			})
		})
	})

	function ExpandMetadataSection() {
		cy.get('.gh-setting-content').then(($elements) => {
			cy.wrap($elements[6])
				.parent()
				.within(($container) => {
					cy.get('button').click({ force: true })
					cy.wait(300)
				})
		})
	}

	function ChangeMetaData(newTitle, newDescription) {
		cy.get('#metaTitle').scrollIntoView()

		cy.get('#metaTitle').clear({ force: true }).type(newTitle)
		cy.get('#metaDescription').clear({ force: true }).type(newDescription)

		if (newTitle === '' && newDescription === '') {
			cy.get('#metaTitle').clear({ force: true })
			cy.get('#metaDescription').clear({ force: true })
		} else if (newTitle === '' && newDescription.length > 0) {
			cy.get('#metaTitle').clear({ force: true })
			cy.get('#metaDescription').clear({ force: true }).type(newDescription, { force: true })
		} else if (newDescription === '' && newTitle.length > 0) {
			cy.get('#metaTitle').clear({ force: true }).type(newTitle, { force: true })
			cy.get('#metaDescription').clear({ force: true })
		} else {
			cy.get('#metaTitle').clear({ force: true }).type(newTitle, { force: true })
			cy.get('#metaDescription').clear({ force: true }).type(newDescription, { force: true })
		}
	}
})

function populateDataForFaker(scenario) {
	if (scenario.useFaker === true) {
		console.log('items: ' + scenario.fakerItems)

		scenario.data = []

		if (scenario.typeOfFaker === 'one') {
			for (let i = 0; i < scenario.fakerItems; i++) {
				let word = faker.lorem.word()
				scenario.data.push({ item: word })
				console.log('word: ' + word)
			}
		} else if (scenario.typeOfFaker === 'multiple') {
			for (let i = 0; i < scenario.fakerItems; i++) {
				let words = faker.lorem.words(i + 1)
				scenario.data.push({ item: words })

				console.log('words: ' + words)
			}
		}
	}
}

function LoginToPrivateSection() {
	cy.visit(baseGhostURL + 'ghost/#/signin')
	cy.wait(3000)

	cy.get('input[name="identification"]').type(Cypress.config('username'), { force: true })
	cy.get('input[name="password"]').type(Cypress.config('password'), { force: true })
	cy.get('button.login.gh-btn.gh-btn-blue').click({ force: true })
	cy.wait(3000)
}

function NavigateToSettingSection() {
	cy.visit(baseGhostURL + 'ghost/#/settings/general')
	cy.wait(3000)
}

function SaveUpdateSettings() {
	cy.get('.gh-canvas-header button').scrollIntoView()
	cy.get('.gh-canvas-header button').click({ force: true })
	cy.wait(300)
}
