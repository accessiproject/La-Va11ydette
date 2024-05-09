/**
 * Computation manager
 * Conformity computation functions
*/

/**
*	Initialization properties, needed for computation.
*	@param {object} item - items (rules)
*/
initProperties = function (item) {
	item.resultat = 'na';
	item.comment = [];
	item.page = [];
}

/**
 * Computation initialization. The dataWcag object is downloaded.
 *
 * Load data wcag
 *
*/
function initComputationWcag() {

	var matriceRequest = new XMLHttpRequest();
	method = "GET",
		matriceVallydette = 'json/wcag-' + globalLang + '.json';

	matriceRequest.open(method, matriceVallydette, true);
	matriceRequest.onreadystatechange = function () {
		if (matriceRequest.readyState === 4 && matriceRequest.status === 200) {
			dataWCAG = JSON.parse(matriceRequest.responseText);

			dataWCAG.items.forEach(initRulesAndTests);

			var btnShowResult = document.getElementById("btnShowResult");
			btnShowResult.addEventListener('click', function () {
				runComputationWcag();
				utils.setPageTitle(langVallydette.auditResult);
				utils.resetActive(document.getElementById("pageManager"));
				utils.putTheFocus(document.getElementById("pageName"));
				initAnchorMenu()
			}, false);

			runTestListMarkup(dataVallydette.checklist.page[currentPage].items);
			if (window.location.hash !== "") {
				document.getElementById(window.location.hash.substring(1)).scrollIntoView();
			}


		}
	};
	matriceRequest.send();

}

/**
 * Computation initialization. The dataWcag object is downloaded.
 *
 * Load data wcag
 *
*/
function initComputationRGAA() {

	dataRGAA = {
		items: []
	}

	dataVallydette.checklist.page[0].items.forEach(element => {
		testObj = {};
		testObj.themes = element.themes;
		testObj.name = element.title;
		testObj.comment = [];
		testObj.page = [];
		testObj.resultat = "nt";
		dataRGAA.items.push(testObj)

	})


	var btnShowResult = document.getElementById("btnShowResult");
	btnShowResult.addEventListener('click', function () {
		runComputationRgaa();
		utils.setPageTitle(langVallydette.auditResult);
		utils.resetActive(document.getElementById("pageManager"));
		utils.putTheFocus(document.getElementById("pageName"));
		initAnchorMenu()
		/*runComputationWcag();
		utils.setPageTitle(langVallydette.auditResult);
		utils.resetActive(document.getElementById("pageManager"));
		utils.putTheFocus(document.getElementById("pageName"));
		initAnchorMenu()
		*/
	}, false);
	runTestListMarkup(dataVallydette.checklist.page[currentPage].items);
	if (window.location.hash !== "") {
		document.getElementById(window.location.hash.substring(1)).scrollIntoView();
	}

}

/**
 * Updates each wcag with necessary tests from the checklist
 * @param {object} rules - object that contains all the wcags
*/
function initRulesAndTests(rules) {
	for (let i in dataVallydette.checklist.page[0].items) {
		for (let j in dataVallydette.checklist.page[0].items[i].wcag) {

			var testWCAG = dataVallydette.checklist.page[0].items[i].wcag[j].split(" ");
			if (testWCAG[0] === rules.wcag) {

				rules.tests.push(dataVallydette.checklist.page[0].items[i].IDorigin);

				rules.resultat = "nt";
			}

		}

	}

}


/**
 * Pass through dataVallydette to build the pageResults array, which contains the Rgaa results for each pages.
 * @return {array} pagesResults - Contains all Rgaa results by pages.
*/
function runComputationRgaa() {

	/**
	* @param {array} pagesResults - Contains all wcag results by pages.
	*/
	pagesResults = [];

	dataRGAA.items.forEach(initProperties);

	for (let i in dataVallydette.checklist.page) {
		pagesResults[i] = [];
		pagesResults[i].items = [];
		pagesResults[i].name = dataVallydette.checklist.page[i].name;
		pagesResults[i].url = dataVallydette.checklist.page[i].url;
		for (let j in dataVallydette.checklist.page[i].items) {
			pagesResults[i].items[j] = {};
			pagesResults[i].items[j].complete = true;
			pagesResults[i].items[j].themes = dataRGAA.items[j].themes
			pagesResults[i].items[j].name = dataRGAA.items[j].name;
			pagesResults[i].items[j].resultat = "nt";

			testObj = {};
			testObj.title = dataVallydette.checklist.page[i].items[j].title;
			testObj.result = dataVallydette.checklist.page[i].items[j].resultatTest;

			if (dataVallydette.checklist.page[i].items[j].resultatTest === "nt") {
				pagesResults[i].items[j].complete = false;
			}

			if (dataVallydette.checklist.page[i].items[j].resultatTest === "ko") {

				dataRGAA.items[j].resultat = false;
				if (dataVallydette.checklist.page[i].items[j].issues.length > 0) {
					dataVallydette.checklist.page[i].items[j].issues.forEach(issue => {
						dataRGAA.items[j].comment.push(issue.issueTitle);
						dataRGAA.items[j].page.push(pagesResults[i].name);
					});
				}
			}

			if (pagesResults[i].items[j].resultat) {
				if (dataVallydette.checklist.page[i].items[j].resultatTest === "ok") {

					pagesResults[i].items[j].resultat = true;
					if (dataRGAA.items[j].resultat !== false) {

						dataRGAA.items[j].resultat = true;
					}


				} else if (dataVallydette.checklist.page[i].items[j].resultatTest === "ko") {
					pagesResults[i].items[j].resultat = false;



				} else if ((dataVallydette.checklist.page[i].items[j].resultatTest === "na") && (pagesResults[i].items[j].resultat === "nt")) {
					pagesResults[i].items[j].resultat = "na";

					if (dataRGAA.items[j].resultat !== false && dataRGAA.items[j].resultat !== true) {
						dataRGAA.items[j].resultat = "na";
					}


				}

			}
		}
	}

	pagesResults = pagesResultsComputationRGAA(pagesResults);
	dataRGAAComputation();




	return runFinalComputationRGAA(pagesResults);

}

/**
 * Pass through both dataVallydette et dataWCAG to build the pageResults array, which contains the wcag results for each pages.
 * @param {boolean} obj - if true, function returns only the full pagesResults object (with test title) whitout running the final computation
 * @return {array} pagesResults - Contains all wcag results by pages.
*/
function runComputationWcag(obj) {

	/**
	* @param {array} pagesResults - Contains all wcag results by pages.
	*/
	pagesResults = [];
	countNocomplete = 0;

	/**
	* Initilization of the dataWCAG results, to be sure that the results are correctly re-computed each time the audit results are displayed.
	*/
	dataWCAG.items.forEach(initProperties);

	for (let i in dataVallydette.checklist.page) {
		pagesResults[i] = [];
		pagesResults[i].items = [];
		pagesResults[i].name = dataVallydette.checklist.page[i].name;
		pagesResults[i].url = dataVallydette.checklist.page[i].url;

		for (let k in dataWCAG.items) {

			pagesResults[i].items[k] = {};
			pagesResults[i].items[k].wcag = dataWCAG.items[k].wcag;
			pagesResults[i].items[k].level = dataWCAG.items[k].level;

			if (dataWCAG.items[k].tests.length > 0) {
				pagesResults[i].items[k].resultat = "nt";
			} else {
				pagesResults[i].items[k].resultat = "na";
			}

			pagesResults[i].items[k].complete = true;
			if (!countNocomplete) {
				dataWCAG.items[k].complete = true;
			}

			pagesResults[i].items[k].test = [];
			pagesResults[i].items[k].name = dataWCAG.items[k].name;

			/**
			* Pass through each test of a wcag.
			*/
			for (let l in dataWCAG.items[k].tests) {
				/**
				* Gets each test value, and updates the current wcag rules, basing on computation rules.
				*/

				for (let j in dataVallydette.checklist.page[i].items) {

					if (dataWCAG.items[k].tests[l] === dataVallydette.checklist.page[i].items[j].IDorigin) {

						testObj = {};
						testObj.title = dataVallydette.checklist.page[i].items[j].title;
						testObj.result = dataVallydette.checklist.page[i].items[j].resultatTest;
						pagesResults[i].items[k].test.push(testObj);


						if (dataVallydette.checklist.page[i].items[j].resultatTest === "nt" && dataVallydette.checklist.page[i].items[j].goodPractice === false) {
							pagesResults[i].items[k].complete = false;
							dataWCAG.items[k].complete = false;
							countNocomplete++;
						}

						if (dataVallydette.checklist.page[i].items[j].resultatTest === "ko") {

							dataWCAG.items[k].resultat = false;
							if (dataVallydette.checklist.page[i].items[j].issues.length > 0) {
								dataVallydette.checklist.page[i].items[j].issues.forEach(issue => {
									dataWCAG.items[k].comment.push(issue.issueTitle);
									dataWCAG.items[k].page.push(pagesResults[i].name);
								});
							}
						}

						if (pagesResults[i].items[k].resultat) {

							if (dataVallydette.checklist.page[i].items[j].resultatTest === "ok") {
								pagesResults[i].items[k].resultat = true;

								if (dataWCAG.items[k].resultat !== false) {

									dataWCAG.items[k].resultat = true;
								}

								break;

							} else if (dataVallydette.checklist.page[i].items[j].resultatTest === "ko") {
								pagesResults[i].items[k].resultat = false;
								break;


							} else if ((dataVallydette.checklist.page[i].items[j].resultatTest === "na") && (pagesResults[i].items[k].resultat === "nt")) {
								pagesResults[i].items[k].resultat = "na";

								if (dataWCAG.items[k].resultat !== false && dataWCAG.items[k].resultat !== true) {
									dataWCAG.items[k].resultat = "na";
								}

								break;
							}

						}
					}
				}
			}

		}
	}
	pagesResults = pagesResultsComputationWcag(pagesResults);
	dataWCAGComputation();



	if (obj) {
		return pagesResults;
	} else {
		return runFinalComputationWcag(pagesResults);
	}

}

/**
* Run all the computation per pages, from the results collected into pagesResults array
* @param {array} pagesResultsArray - Contains all wcag results by pages.
* @return {array} pagesResultsArray - Contains all wcag results by pages, and the diffrents results
*/
function pagesResultsComputationWcag(pagesResultsArray) {
	var finalTotal = 0;
	var finalResult = 0;
	var nbPage = 0;

	for (let i in pagesResultsArray) {
		var nbTrue = 0;
		var nbFalse = 0;
		var nbNA = 0;
		var nbTotal = 0;
		var nbTrueA = 0;
		var nbFalseA = 0;
		var nbNaA = 0;
		var nbTrueAA = 0;
		var nbFalseAA = 0;
		var nbNaAA = 0;
		var nbTotalA = 0;
		var nbTotalAA = 0;


		/**
		 * 	Deletes the AAA wcag rules. Computation is made only on A and AA level rules.
		*/
		var indexItem = 0;
		for (let j in pagesResultsArray[i].items) {
			if (pagesResultsArray[i].items[indexItem].level === 'AAA') {
				pagesResultsArray[i].items.splice(indexItem, 1);
			} else {
				indexItem = indexItem + 1;
			}
		}

		/**
		 * 	Gets the number of true, false, non-applicable and non-tested by wcag level and by pages.
		 *  If one result is non-tested, then the property 'complete' is passed false, and the final result is not displayed (only the number of non-tested items).
		*/
		for (let j in pagesResultsArray[i].items) {

			if (pagesResultsArray[i].items[j].resultat === true) {
				nbTrue++;
				nbTotal++;

				pagesResultsArray[i].items[j].level === 'A' ? nbTrueA++ : nbTrueAA++;
				pagesResultsArray[i].items[j].level === 'A' ? nbTotalA++ : nbTotalAA++;
			} else if (pagesResultsArray[i].items[j].resultat === false) {
				nbFalse++;
				nbTotal++;

				pagesResultsArray[i].items[j].level === 'A' ? nbFalseA++ : nbFalseAA++;
				pagesResultsArray[i].items[j].level === 'A' ? nbTotalA++ : nbTotalAA++;
			} else if (pagesResultsArray[i].items[j].resultat === 'na') {
				nbNA++;

				pagesResultsArray[i].items[j].level === 'A' ? nbNaA++ : nbNaAA++;
				pagesResultsArray[i].items[j].level === 'A' ? nbTotalA++ : nbTotalAA++;
			}
			if (pagesResultsArray[i].items[j].complete === false) {
				pagesResultsArray[i].complete = false;
			}
		}

		/**
		 * 	If all the tests of a page are non-applicables (hypothetical but tested)
		*/
		if (nbTotal === 0 && nbNA > 0) {
			pagesResultsArray[i].result = "NA";
		} else {
			pagesResultsArray[i].result = Math.round((nbTrue / nbTotal) * 100);
		}


		/** Adds the result to the pages result array. */
		pagesResultsArray[i].conformeA = nbTrueA;
		pagesResultsArray[i].conformeAA = nbTrueAA;
		pagesResultsArray[i].nonconformeA = nbFalseA;
		pagesResultsArray[i].nonconformeAA = nbFalseAA;
		pagesResultsArray[i].naA = nbNaA;
		pagesResultsArray[i].naAA = nbNaAA;
		pagesResultsArray[i].totalconforme = nbTrueA + nbTrueAA;
		pagesResultsArray[i].totalnonconforme = nbFalseA + nbFalseAA;
	}

	/** Final global pages result computation. */
	for (let i in pagesResultsArray) {
		if (pagesResultsArray[i].result != "NA") {
			finalTotal = finalTotal + pagesResultsArray[i].result;
			nbPage = nbPage + 1;
		}
	}

	/** Final conformity rate. */
	finalResult = Math.round((finalTotal / nbPage));
	dataWCAG.globalPagesResult = finalResult;

	return pagesResultsArray;
}

/**
* Run all the computation per pages, from the results collected into pagesResults array
* @param {array} pagesResultsArray - Contains all rgaa results by pages.
* @return {array} pagesResultsArray - Contains all rgaa results by pages, and the diffrents results
*/
function pagesResultsComputationRGAA(pagesResultsArray) {
	var finalTotal = 0;
	var finalResult = 0;
	var nbPage = 0;
	for (let i in pagesResultsArray) {
		var nbTrue = 0;
		var nbFalse = 0;
		var nbNA = 0;
		var nbTotal = 0;

		/**
		 * 	Gets the number of true, false, non-applicable and non-tested by pages.
		 *  If one result is non-tested, then the property 'complete' is passed false, and the final result is not displayed (only the number of non-tested items).
		*/
		for (let j in pagesResultsArray[i].items) {
			if (pagesResultsArray[i].items[j].resultat === true) {
				nbTrue++;
				nbTotal++;

			} else if (pagesResultsArray[i].items[j].resultat === false) {
				nbFalse++;
				nbTotal++;
			} else if (pagesResultsArray[i].items[j].resultat === 'na') {
				nbNA++;

			} else if (pagesResultsArray[i].items[j].resultat === 'nt') {
				pagesResultsArray[i].complete = false;
			}
		}

		/**
		 * 	If all the tests of a page are non-applicables (hypothetical but tested)
		*/
		if (nbTotal === 0 && nbNA > 0) {
			pagesResultsArray[i].result = "NA";
		} else {
			pagesResultsArray[i].result = ((nbTrue / nbTotal) * 100).toFixed(2);
		}


		pagesResultsArray[i].totalconforme = nbTrue;
		pagesResultsArray[i].totalnonconforme = nbFalse;
		pagesResultsArray[i].totalnA = nbNA;
	}

	/** Final global pages result computation. */
	for (let i in pagesResultsArray) {
		if (pagesResultsArray[i].result != "NA") {
			finalTotal = (finalTotal + parseFloat(pagesResultsArray[i].result));
			nbPage = nbPage + 1;
		}
	}

	/** Final conformity rate. */

	finalResult = (finalTotal / nbPage).toFixed(2);
	dataRGAA.globalPagesResult = finalResult;

	return pagesResultsArray;
}

/**
	*  Get the number of true, false, non-applicable and non-tested by wcag level only.
	*  If one result is non-tested, then the property 'complete' is passed false, and the final result is not displayed (only the number of non-tested items).
*/
function dataWCAGComputation() {

	dataWCAG.complete = true;

	/**
	 * 	Check if all critere are completed.
	*/

	for (let i in dataWCAG.items) {
		if ((dataWCAG.items[i].level !== "AAA") && ((dataWCAG.items[i].resultat === 'nt' && dataWCAG.items[i].deprecated !== true) || dataWCAG.items[i].complete === false)) {
			dataWCAG.complete = false;
		}
	}

	/** Adds the results to the WCAG object. */
	dataWCAG.conformeA = dataWCAG.items.filter(item => item.level === "A" && item.resultat === true).length;
	dataWCAG.conformeAA = dataWCAG.items.filter(item => item.level === "AA" && item.resultat === true).length;
	dataWCAG.nonconformeA = dataWCAG.items.filter(item => item.level === "A" && item.resultat === false).length;
	dataWCAG.nonconformeAA = dataWCAG.items.filter(item => item.level === "AA" && item.resultat === false).length;
	dataWCAG.naA = dataWCAG.items.filter(item => item.level === "A" && item.resultat === "na").length;
	dataWCAG.naAA = dataWCAG.items.filter(item => item.level === "AA" && item.resultat === "na").length;
	dataWCAG.totalconforme = dataWCAG.conformeA + dataWCAG.conformeAA;
	dataWCAG.totalnonconforme = dataWCAG.nonconformeA + dataWCAG.nonconformeAA;

	dataWCAG.totalA = dataWCAG.items.filter(function (item) { return item.level === "A" }).length;
	dataWCAG.totalAA = dataWCAG.items.filter(function (item) { return item.level === "AA" }).length;

	dataWCAG.nbTotalWcag = dataWCAG.items.filter(item => (item.resultat === true || item.resultat === false) && item.level !== "AAA").length;
	dataWCAG.nbTrueWcag = dataWCAG.items.filter(item => item.resultat === true && item.level !== "AAA").length;
	dataWCAG.nbFalseWcag = dataWCAG.items.filter(item => item.resultat === false && item.level !== "AAA").length;
	dataWCAG.nbNaWcag = dataWCAG.items.filter(item => item.resultat === "na" && item.level !== "AAA").length;

	/**
	* 	If all the wcag are non-applicables (hypothetical but tested)
	*/
	if (dataWCAG.nbTotalWcag === 0 && dataWCAG.nbNaWcag > 0) {
		dataWCAG.result = "NA";
	} else {
		dataWCAG.result = Math.round((dataWCAG.nbTrueWcag / dataWCAG.nbTotalWcag) * 100);
		dataWCAG.resultA = Math.round((dataWCAG.conformeA / (dataWCAG.conformeA + dataWCAG.nonconformeA)) * 100);
		dataWCAG.resultAA = Math.round((dataWCAG.conformeAA / (dataWCAG.conformeAA + dataWCAG.nonconformeAA)) * 100);
	}

}

const countIssuesByTheme = (boardResults) => {
	let themeCounts = {};

	// Parcourir chaque résultat dans boardResults
	boardResults.forEach(result => {
		// Récupérer le thème du résultat
		let theme = result.themes;

		// S'assurer que le thème existe dans le comptage des problèmes
		if (!themeCounts[theme]) {
			themeCounts[theme] = {
				minor: 0,
				major: 0,
				blocking: 0,
				total: 0
			};
		}

		// Ajouter les problèmes de chaque page associée au thème
		result.pages.forEach(page => {
			themeCounts[theme].minor += page.issues.filter(issue => issue.issueUserImpact === langVallydette.userImpact1).length;
			themeCounts[theme].major += page.issues.filter(issue => issue.issueUserImpact === langVallydette.userImpact2).length;
			themeCounts[theme].blocking += page.issues.filter(issue => issue.issueUserImpact !== langVallydette.userImpact1 && issue.issueUserImpact !== langVallydette.userImpact2).length;
		});

		// Calculer le total des problèmes pour ce thème
		themeCounts[theme].total = themeCounts[theme].minor + themeCounts[theme].major + themeCounts[theme].blocking;
	});

	return themeCounts;
}

/**
	*  Get the number of true, false, non-applicable and non-tested by wcag level only.
	*  If one result is non-tested, then the propev  rty 'complete' is passed false, and the final result is not displayed (only the number of non-tested items).
*/
function dataRGAAComputation() {


	dataRGAA.complete = true;


	dataRGAA.nbTotalRGAA = dataRGAA.items.filter(item => (item.resultat === true || item.resultat === false) && item.level !== "AAA").length;
	dataRGAA.nbTrueRGAA = dataRGAA.items.filter(item => item.resultat === true).length;
	dataRGAA.nbFalseRGAA = dataRGAA.items.filter(item => item.resultat === false).length;
	dataRGAA.nbNaRGAA = dataRGAA.items.filter(item => item.resultat === "na").length;

	/**
	* 	If all the wcag are non-applicables (hypothetical but tested)
	*/
	if (dataRGAA.nbTotalWcag === 0 && dataRGAA.nbNaWcag > 0) {
		dataRGAA.result = "NA";
	} else {
		dataRGAA.result = ((dataRGAA.nbTrueRGAA / dataRGAA.nbTotalRGAA) * 100).toFixed(2);
	}
}

/**
 * Retrieves an array of audit results for each page.
 * @returns {array} pagesArray - An array containing the results for each page of the audit.
 */
const getPagesArray = () => {

	// Retrieve checklist pages from dataVallydette
	let dataPages = dataVallydette.checklist.page;
	let pagesArray = [];

	for (let index in dataPages) {

		// Count the number of "ok", "ko", and "na" results in each page
		const countResults = dataPages[index].items.reduce((acc, item) => {
			if (item.resultatTest === "ok") {
				acc.countOk++;
			} else if (item.resultatTest === "ko") {
				acc.countKo++;
			} else if (item.resultatTest === "na") {
				acc.countNa++;
			}
			return acc;
		}, { countOk: 0, countKo: 0, countNa: 0 });

		// Calculate the rate of compliance for each page
		let rateCompliance; // Declare rateCompliance here to avoid hoisting
		if (countResults.countOk !== undefined && countResults.countKo !== undefined && (countResults.countOk + countResults.countKo) !== 0) {
			rateCompliance = countResults.countKo / (countResults.countKo + countResults.countOk) * 100;
		}

		// Count the number of "minor", "major", and "blocking" issues in each page
		const countIssues = dataPages[index].items.reduce((acc, item) => {
			item.issues.forEach(issue => {
				if (issue.issueUserImpact === "Mineur") {
					acc.countMinor++;
				} else if (issue.issueUserImpact === "Majeur") {
					acc.countMajor++;
				} else if (issue.issueUserImpact === "Bloquant") {
					acc.countBlocking++;
				}
			});
			return acc;
		}, { countMinor: 0, countMajor: 0, countBlocking: 0 });
		countIssues.total = countIssues.countMinor + countIssues.countMajor + countIssues.countBlocking;

		// Store results for the current page in pageResultsArray
		pagesArray[index] = {
			IDPage: dataPages[index].IDPage,
			name: dataPages[index].name,
			url: dataPages[index].url,
			criteria: dataPages[index].items,
			countResults: countResults,
			rateCompliance: rateCompliance,
			countIssues: countIssues
		};

	}

	return pagesArray;
}

/**
 * Retrieves an array of criteria along with their results for each page.
 * @returns {array} criteriaArray - An array containing criteria and their associated results.
 */
const getCriteriaArray = () => {
	let dataPages = dataVallydette.checklist.page;
	let criteriaArray = [];

	for (let i = 0; i < dataPages[0]["items"].length; i++) {
		
		let pages = [];
		
		let countResults = {
			countOk: 0,
			countKo: 0,
			countNa: 0
		};

		let countIssues = {
			countMinor: 0,
			countMajor: 0,
			countBlocking: 0,
			total: 0
		};

		for (let page = 0; page < dataPages.length; page++) {

			let currentItem = dataPages[page].items[i];

			// Count results for each criteria
			if (currentItem.resultatTest === "ok") {
				countResults.countOk++;
			} else if (currentItem.resultatTest === "ko") {
				countResults.countKo++;
			} else if (currentItem.resultatTest === "na") {
				countResults.countNa++;
			}

			// Gather information about each page's results
			pages.push({
				name: dataPages[page].name,
				url: dataPages[page].url,
				resultatTest: currentItem.resultatTest,
				issues: currentItem.issues
			});

			// Count issues for each criteria
			currentItem.issues.forEach(issue => {
				if (issue.issueUserImpact === "Mineur") {
					countIssues.countMinor++;
				} else if (issue.issueUserImpact === "Majeur") {
					countIssues.countMajor++;
				} else if (issue.issueUserImpact === "Bloquant") {
					countIssues.countBlocking++;
				}
			});
		}

		// Calculate total issues for each criteria
		countIssues.total = countIssues.countMinor + countIssues.countMajor + countIssues.countBlocking;

		// Determine compliance status for each criteria
		let compliance;
		if (countResults.countKo > 0) {
			compliance = langVallydette.template.status2;
		} else if (countResults.countNa == dataPages.length) {
			compliance = langVallydette.template.status3;
		} else {
			compliance = langVallydette.template.status1;
		}

		// Gather information about each criteria
		let currentCriterion = dataPages[0]["items"][i];
		criteriaArray[i] = {
			topic: currentCriterion["themes"],
			ID: currentCriterion["ID"],
			IDorigin: currentCriterion["IDorigin"],
			title: currentCriterion["title"],
			goodPractice: currentCriterion["goodPractice"],
			verifier: currentCriterion["verifier"],
			wcag: currentCriterion["wcag"],
			pages: pages,
			countResults: countResults,
			countIssues: countIssues,
			result: compliance
		};

	}

	return criteriaArray;
}


/**
 * Retrieves an array of compliance statistics based on audit results.
 * @returns {array} compliancesArray - An array containing various compliance statistics.
 */
const getCompliancesArray = () => {
	
	// Retrieve audit results for each page and criteria
	const pagesArray = getPagesArray();
	const criteriaArray = getCriteriaArray();
	const compliancesArray = [];

	// Calculate the average compliance rate across all pages
	let sum = 0;
	let medium = 0;
	for (let page in pagesArray) {
		sum += pagesArray[page].rateCompliance;
	}
	medium = sum / pagesArray.length;

	// Count the number of "ok", "ko", and "na" results for all criteria
	let global = 0;
	const countResults = criteriaArray.reduce((acc, item) => {
		if (item.result === langVallydette.template.status1) {
			acc.countOk++;
		} else if (item.result === langVallydette.template.status2) {
			acc.countKo++;
		} else if (item.result === langVallydette.template.status3) {
			acc.countNa++;
		}
		return acc;
	}, { countOk: 0, countKo: 0, countNa: 0 });
	global = countResults.countOk / (countResults.countOk + countResults.countKo) * 100;

	// Store compliance statistics in compliancesArray
	compliancesArray["counts"] = countResults;
	compliancesArray["medium"] = medium;
	compliancesArray["global"] = global;

	return compliancesArray;
}

/**
 * Retrieves an array of compliance statistics for each topic.
 * @returns {array} topicsArray - An array containing compliance statistics for each topic.
 */
const getTopicsArray = () => {

	// Retrieve criteria and their results
	const criteriaArray = getCriteriaArray();
	const resultsPerTopic = {};

	// Count the number of "ok", "ko", and "na" results for each topic
	for (let i = 0; i < criteriaArray.length; i++) {
		const topic = criteriaArray[i].topic;
		if (!resultsPerTopic[topic]) {
			resultsPerTopic[topic] = {
				countOk: 0,
				countKo: 0,
				countNa: 0
			};
		}

		if (criteriaArray[i].result === langVallydette.template.status1) {
			resultsPerTopic[topic].countOk++;
		} else if (criteriaArray[i].result === langVallydette.template.status2) {
			resultsPerTopic[topic].countKo++;
		} else if (criteriaArray[i].result === langVallydette.template.status3) {
			resultsPerTopic[topic].countNa++;
		}
	}

	// Format compliance statistics for each topic into an array
	const topicsArray = Object.keys(resultsPerTopic).map(topic => ({
		topic,
		...resultsPerTopic[topic]
	}));

	return topicsArray;
}

/**
 * returns {array} resultsArray
*/
const getResultsArray = () => {

	const resultsArray = [];
	resultsArray["pages"] = getPagesArray();
	resultsArray["criteria"] = getCriteriaArray();
	resultsArray["topics"] = getTopicsArray();
	resultsArray["compliances"] = getCompliancesArray();
	console.log(resultsArray);
	return resultsArray;
}