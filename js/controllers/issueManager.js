/**
 * Comment manager
 */

/**
 * Management of deprecated comments that no longer exist 
 * @param {array} data - data valydette
 */
const managementDeprecatedComment = (data) => {
	data.checklist.page.forEach(
		page => {
			page.items.forEach(item => {
				if (typeof item.issues === 'undefined') {
					item.issues = [];
				}
				if (typeof item.commentaire !== 'undefined') {
					if (item.commentaire !== "") {
						newIssue = {
							issueTitle: item.commentaire,
							issueUserImpact: "",
							issueDetail: "",
							issueSolution: "",
							issueTechnicalSolution: ""
						};
						item.issues.push(newIssue);
					}
					delete item.commentaire
				}
			})
		}
	);
	return data;
}

/**
 * Issue manager
 */

/**
 * Load issue
*/
const loadIssue = () => {
	if (typeof checklistVallydette[dataVallydette.checklist.referentiel] !== 'undefined') {
		const issuesRequest = new XMLHttpRequest();
		issuesRequest.open("GET", "json/" + checklistVallydette[dataVallydette.checklist.referentiel].filename + "-issues-" + globalLang + ".json", true);
		issuesRequest.onreadystatechange = function () {
			if (issuesRequest.readyState === 4 && issuesRequest.status === 200) {
				issuesVallydette = JSON.parse(issuesRequest.responseText);
			}
		};
		issuesRequest.send();
	}
}

/**
 * Issue popin initialization.
 * @param {string} targetId - current test ID.
 * @param {string} title - current test title.
*/
const setIssue = (targetId, title, targetIdOrigin) => {
	const titleModal = title;
	const htmlModal = `
		<div class="modal-dialog modal-lg " role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title" id="modalAddIssueTitle">${langVallydette.issueTxt1} ${titleModal}</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${langVallydette.close}"></button>
				</div>
				<form id="editIssueForm">
					<div class="modal-body">
						<p class="text-muted">${langVallydette.fieldRequired}</p>
						${(issuesVallydette[targetIdOrigin]) ? getPredefinedIssues(targetIdOrigin) : ""}
						<div class="mb-3">
							<label class="form-label" for="issueNameValue" id="issueNameValueLabel">${langVallydette.summary} <span class="text-danger">*</span></label>
							<input type="text" class="form-control" id="issueNameValue" aria-labelledby="issueNameValueLabel" value="" required aria-invalid="false">
							<div id="issueNameValueError" class="alert alert-danger alert-sm d-none">
								<span class="alert-icon" aria-hidden="true"></span>
								<p>${langVallydette.summaryError}</p>
							</div>
						</div>
						<div class="mb-3">
							<select class="form-select" id="issueUserImpactValue" aria-label="${langVallydette.select}">
								<option value="${langVallydette.userImpact1}">${langVallydette.userImpact1}</option>
								<option value="${langVallydette.userImpact2}">${langVallydette.userImpact2}</option>
								<option value="${langVallydette.userImpact3}">${langVallydette.userImpact3}</option>
							</select>
						</div>
						<div class="mb-3">
							<label class="mt-2 form-label" for="issueDetailValue" id="issueDetailValueLabel">${langVallydette.description} <span class="text-danger">*</span></label>
							<textarea class="form-control" id="issueDetailValue" aria-labelledby="issueDetailValueLabel" rows="8" required aria-invalid="false"></textarea>
							<div id="issueDetailValueError" class="alert alert-danger alert-sm d-none">
								<span class="alert-icon" aria-hidden="true"></span>
								<p>${langVallydette.descriptionError}</p>
							</div>
						</div>
						<div class="mb-3">
							<label for="issueSolutionValue" class="mt-2 form-label">${langVallydette.solution}</label>
							<textarea class="form-control" id="issueSolutionValue"></textarea>
						</div>
						<div class="mb-3">
							<label for="issueTechnicalSolutionValue" class="mt-2 form-label">${langVallydette.technical_solution}</label>
							<textarea class="form-control" id="issueTechnicalSolutionValue"></textarea>
						</div>
						<div class="modal-footer">
							<button type="button" id="closeIssueBtnBtn" class="btn btn-secondary" data-bs-dismiss="modal">${langVallydette.cancel}</button>
							<button type="submit" id="saveIssueBtnBtn" class="btn btn-primary">${langVallydette.save}</button>
						</div>
					</form>
				</div>
			</div>
		`;

	const elModal = document.getElementById('modalAddIssue');
	elModal.innerHTML = htmlModal;
	const saveIssueBtnBtn = document.getElementById('saveIssueBtnBtn');
	saveIssueBtnBtn.addEventListener('click', (e) => {
		e.preventDefault();
		const error = 0;
		const propertyName = document.getElementById("issueNameValue");
		const propertyDescription = document.getElementById("issueDetailValue");
		if (propertyDescription.value == "") {
			invalidField(document.getElementById('issueDetailValueError'), propertyDescription, "issueDetailValueLabel", "issueDetailValueError")
			error++;
		} else {
			validField(document.getElementById('issueDetailValueError'), propertyDescription, "issueDetailValueLabel")
		}
		if (propertyName.value == "") {
			invalidField(document.getElementById('issueNameValueError'), propertyName, "issueNameValueLabel", "issueNameValueError");
			error++;
		} else {
			validField(document.getElementById('issueNameValueError'), propertyName, "issueNameValueLabel")
		}
		if (error == 0) {
			addIssue(targetId, issueNameValue.value, issueUserImpactValue.value, issueDetailValue.value, issueSolutionValue.value, issueTechnicalSolutionValue.value);
			document.getElementById('closeIssueBtnBtn').click();
		}
	})
	if (document.getElementById('btnValidatePredefined')) {
		document.getElementById('btnValidatePredefined').addEventListener('click', function (e) {
			e.preventDefault();
			issueNameValue.value = issuesVallydette[targetIdOrigin][issuePredefined.value].title;
			issueUserImpactValue.value = issuesVallydette[targetIdOrigin][issuePredefined.value].userImpact;
			issueDetailValue.value = issuesVallydette[targetIdOrigin][issuePredefined.value].detail;
			issueSolutionValue.value = issuesVallydette[targetIdOrigin][issuePredefined.value].solution;
			issueTechnicalSolutionValue.value = issuesVallydette[targetIdOrigin][issuePredefined.value].technicalSolution;
			issueNameValue.focus();
		});
	}
	
	const issueNameValueInput = document.getElementById('issueNameValue');
	const modal = document.getElementsByClassName('modal');
	modal[0].addEventListener('shown.bs.modal', () => {
		issueNameValueInput.focus()
	})
}

/**
 * Add the issue to the vallydette object.
 * @param {string} targetId - current test ID.
 * @param {string} issueTitle.
 * @param {string} issueDetail.
*/
const addIssue = (targetId, issueTitle, issueUserImpact, issueDetail, issueSolution, issueTechnicalSolution) => {
	for (const i in dataVallydette.checklist.page[currentPage].items) {
		if (dataVallydette.checklist.page[currentPage].items[i].ID === targetId) {
			newIssue = {};
			newIssue['issueTitle'] = issueTitle;
			newIssue['issueUserImpact'] = issueUserImpact;
			newIssue['issueDetail'] = issueDetail;
			newIssue['issueSolution'] = issueSolution;
			newIssue['issueTechnicalSolution'] = issueTechnicalSolution;
			dataVallydette.checklist.page[currentPage].items[i].issues.push(newIssue);
			document.getElementById("issueDisplayBtn" + targetId).removeAttribute("disabled");
		}
	}
	jsonUpdate();
}

/**
 * Get the predefined issues if exists, and update the select menu
 * @param {string} targetId - current test ID
 * @return {string} htmlPredefinedIssue - html of the updated select menu
*/
const getPredefinedIssues = (targetId) => {
	const htmlPredefinedIssues = `
		<div class="mb-3 row">
			<div class="col-sm-10">
				<select class="form-select" id="issuePredefined" aria-label="${langVallydette.selectIssue}">
					<option selected>${langVallydette.selectIssue}</option>
					${issuesVallydette[targetId].map((issue, index) => `<option value="${index}">${issue.title}</option>`).join('')}
				</select>
			</div>
			<div class="col-sm-2">
				<button id="btnValidatePredefined" class="btn btn-secondary">${langVallydette.import}</button>
			</div>
		</div>
		`;
	return htmlPredefinedIssues;
}

/**
 * Get an issue property
 * @param {string} targetId - current test ID
 * @param {string} issueProperty - property name
 * @param {string} issueIndex - index of the issue to remove into an issue array
 * @return {string} currentIssue[issueProperty] - issue property value
*/
const getIssue = (targetId, issueProperty, issueIndex) => {
	let currentIssue;
	for (const i in dataVallydette.checklist.page[currentPage].items) {
		if (dataVallydette.checklist.page[currentPage].items[i].ID === targetId) {
			currentIssue = dataVallydette.checklist.page[currentPage].items[i].issues[issueIndex];
		}
	}
	return currentIssue[issueProperty];
}

/**
 * Edit an issue
 * @param {string} targetId - current test ID
 * @param {string} issueIndex - index of the issue to remove into an issue array
*/
const editIssue = (targetId, issueIndex) => {
	const htmlEditIssue = `
		<form id="editIssueForm-${targetId}-${issueIndex}">
			<p class="text-muted">${langVallydette.fieldRequired}</p>
			<label class="form-label" for="issueNameValue-${issueIndex}" id="issueNameValueLabel-${issueIndex}">${langVallydette.summary} <span class="text-danger">*</span></label>
			<input type="text" class="form-control" id="issueNameValue-${issueIndex}" aria-labelledby="issueNameValueLabel-${issueIndex}" value="${utils.escape_html(getIssue(targetId, 'issueTitle', issueIndex))}" required aria-invalid="false">
			<div id="issueNameValueError-${issueIndex}" class="alert alert-danger alert-sm d-none">
				<span class="alert-icon" aria-hidden="true"></span>
				<p>${langVallydette.summaryError}</p>
			</div>
			<div class="mb-3">
				<select class="form-select" id="issueUserImpactValue-${issueIndex}" aria-label="${langVallydette.select}">
					<option value="${langVallydette.userImpact1}" ${(utils.escape_html(getIssue(targetId, 'issueUserImpact', issueIndex)) === langVallydette.userImpact1) ? 'selected' : ''}>${langVallydette.userImpact1}</option>
					<option value="${langVallydette.userImpact2}" ${(utils.escape_html(getIssue(targetId, 'issueUserImpact', issueIndex)) === langVallydette.userImpact2) ? 'selected' : ''}>${langVallydette.userImpact2}</option>
					<option value="${langVallydette.userImpact3}" ${(utils.escape_html(getIssue(targetId, 'issueUserImpact', issueIndex)) === langVallydette.userImpact3) ? 'selected' : ''}>${langVallydette.userImpact3}</option>
				</select>
			</div>
			<label class="mt-2 form-label" for="issueDetailValue-${issueIndex}" id="issueDetailValueLabel-${issueIndex}">${langVallydette.description} <span class="text-danger">*</span></label>
			<textarea class="form-control" id="issueDetailValue-${issueIndex}" aria-labelledby="issueDetailValueLabel-${issueIndex}" rows="8" required aria-invalid="false">${utils.escape_html(getIssue(targetId, 'issueDetail', issueIndex))}</textarea>
			<div id="issueDetailValueError-${issueIndex}" class="alert alert-danger alert-sm d-none">
				<span class="alert-icon" aria-hidden="true"></span>
				<p>${langVallydette.descriptionError}</p>
			</div>
			<label for="issueSolutionValue-${issueIndex}" class="mt-2 form-label">${langVallydette.solution}</label>
			<textarea class="form-control" id="issueSolutionValue-${issueIndex}">${utils.escape_html(getIssue(targetId, 'issueSolution', issueIndex))}</textarea>
			<label for="issueTechnicalSolutionValue-${issueIndex}" class="mt-2 v">${langVallydette.technical_solution}</label>
			<textarea class="form-control" id="issueTechnicalSolutionValue-${issueIndex}">${utils.escape_html(getIssue(targetId, 'issueTechnicalSolution', issueIndex))}</textarea>
			<button type="button" id="cancelIssueBtn-${targetId}-${issueIndex}" class="btn btn-secondary btn-sm mt-1 me-1 mb-1">${langVallydette.cancel}</button>
			<button type="submit" id="saveIssueBtn-${targetId}-${issueIndex}" class="btn btn-primary btn-sm mt-1 mb-1">${langVallydette.save}</button>
			<div class="border-top border-light my-3"></div>
		</form>
	`;

	const elIssueCard = document.getElementById(`issue-body-${targetId}-${issueIndex}`);
	elIssueCard.innerHTML = htmlEditIssue;

	const elTitle = document.getElementById(`issueNameValue-${issueIndex}`);
	elTitle.focus();

	const saveIssueBtn = document.getElementById(`saveIssueBtn-${targetId}-${issueIndex}`);
	saveIssueBtn.addEventListener('click', (e) => {
		e.preventDefault();
		const error = 0;
		const propertyName = document.getElementById(`issueNameValue-${issueIndex}`);
		const propertyDescription = document.getElementById(`issueDetailValue-${issueIndex}`);
		if (propertyDescription.value == "") {
			invalidField(document.getElementById(`issueDetailValueError-${issueIndex}`), propertyDescription, `issueDetailValueLabel-${issueIndex}`, `issueDetailValueError-${issueIndex}`)
			error++;
		} else {
			validField(document.getElementById(`issueDetailValueError-${issueIndex}`), propertyDescription, `issueDetailValueLabel-${issueIndex}`)
		}
		if (propertyName.value == "") {
			invalidField(document.getElementById(`issueNameValueError-${issueIndex}`), propertyName, `issueNameValueLabel-${issueIndex}`, `issueNameValueError-${issueIndex}`);
			error++;
		} else {
			validField(document.getElementById(`issueNameValueError-${issueIndex}`), propertyName, `issueNameValueLabel-${issueIndex}`)
		}
		if (error == 0) {
			saveIssue(targetId, issueIndex, document.getElementById(`editIssueForm-${targetId}-${issueIndex}`));
		}
	});
	
	const issueForm = document.getElementById(`editIssueForm-${targetId}-${issueIndex}`);
	issueForm.addEventListener('submit', (event) => {
		event.preventDefault();
		saveIssue(targetId, issueIndex, this);
	});
	
	document.getElementById(`editIssueBtn-${targetId}-${issueIndex}`).style.display = "none";
	document.getElementById(`deleteIssueBtn-${targetId}-${issueIndex}`).style.display = "none";
	document.getElementById('closeModalIssue').disabled = true;
	document.getElementById(`cancelIssueBtn-${targetId}-${issueIndex}`).addEventListener('click', () => {
		cancelIssue(targetId, issueIndex, getIssue(targetId, 'issueTitle', issueIndex), getIssue(targetId, 'issueDetail', issueIndex));
	});
}

/**
 * Save an issue
 * @param {string} targetId - current test ID
 * @param {string} issueIndex - index of the issue to remove into an issue array
 * @param {object} issueEditForm - issue edit form object
*/
const saveIssue = (targetId, issueIndex, issueEditForm) => {
	for (const i in dataVallydette.checklist.page[currentPage].items) {
		if (dataVallydette.checklist.page[currentPage].items[i].ID === targetId) {
			dataVallydette.checklist.page[currentPage].items[i].issues[issueIndex]['issueTitle'] = issueEditForm.elements["issueNameValue-" + issueIndex].value;
			dataVallydette.checklist.page[currentPage].items[i].issues[issueIndex]['issueUserImpact'] = issueEditForm.elements["issueUserImpactValue-" + issueIndex].value;
			dataVallydette.checklist.page[currentPage].items[i].issues[issueIndex]['issueDetail'] = issueEditForm.elements["issueDetailValue-" + issueIndex].value;
			dataVallydette.checklist.page[currentPage].items[i].issues[issueIndex]['issueSolution'] = issueEditForm.elements["issueSolutionValue-" + issueIndex].value;
			dataVallydette.checklist.page[currentPage].items[i].issues[issueIndex]['issueTechnicalSolution'] = issueEditForm.elements["issueTechnicalSolutionValue-" + issueIndex].value;
		}
	}
	cancelIssue(targetId, issueIndex, issueEditForm.elements["issueNameValue-" + issueIndex].value, issueEditForm.elements["issueDetailValue-" + issueIndex].value);
	jsonUpdate();
}


/**
 * Cancel the issue edition form
 * @param {string} targetId - current test ID
 * @param {string} issueIndex - index of the issue to remove into an issue array
 * @param {string} issueTitle - issue title property
 * @param {string} issueDetail - issue detail property
*/
const cancelIssue = (targetId, issueIndex, issueTitle, issueDetail) => {
	const htmlEditIssue = `${utils.escape_html(issueDetail)}`;
	const elIssueCard = document.getElementById(`issue-body-${targetId}-${issueIndex}`);
	elIssueCard.innerHTML = htmlEditIssue;
	const elIssueCardHeader = document.getElementById(`btnIssue${targetId}-${issueIndex}`);
	elIssueCardHeader.innerHTML = `# ${(issueIndex + 1)} ${utils.escape_html(issueTitle)}`;
	document.getElementById(`editIssueBtn-${targetId}-${issueIndex}`).style.display = "inline-flex";
	document.getElementById(`deleteIssueBtn-${targetId}-${issueIndex}`).style.display = "inline-flex";
	document.getElementById('closeModalIssue').disabled = false;
	document.getElementById(`editIssueBtn-${targetId}-${issueIndex}`).focus();
}

/**
 * Generate issue body
 * @param {string} targetId - current test ID.
 * @return {string} htmlModal - return html to issue body
*/
const displayIssueBody = (targetId) => {
	let htmlModal = "";
	for (const i in dataVallydette.checklist.page[currentPage].items) {
		if (dataVallydette.checklist.page[currentPage].items[i].ID === targetId && dataVallydette.checklist.page[currentPage].items[i].issues.length > 0) {
			let auditNumber = 0;
			for (const j in dataVallydette.checklist.page[currentPage].items[i].issues) {
				auditNumber++;
				htmlModal += `
					<div class="accordion-item" id="cardIssue${targetId}-${j}">
						<div class="accordion-header" id="issue${targetId}-${j}">
							<h2 class="mb-0">
								<button id="btnIssue${targetId}-${j}" class="accordion-button collapsed w-100 m-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${targetId}-${j}" aria-expanded="false" aria-controls="#collapse${targetId}-${j}">
									#${auditNumber} [${utils.escape_html(dataVallydette.checklist.page[currentPage].items[i].issues[j].issueUserImpact)}] ${utils.escape_html(dataVallydette.checklist.page[currentPage].items[i].issues[j].issueTitle)}
								</button>
							</h2>
						</div>
						<div id="collapse${targetId}-${j}" data-bs-parent="#issueList" class="accordion-collapse collapse" aria-labelledby="issue${targetId}-${j}">
							<div class="accordion-body">
								<div id="issue-body-${targetId}-${j}" class="px-3">
									<h3 class="mb-0">${langVallydette.description}</h3>
									${utils.escape_html(dataVallydette.checklist.page[currentPage].items[i].issues[j].issueDetail)}
									<h3 class="mb-0">${langVallydette.solution}</h3>
									${dataVallydette.checklist.page[currentPage].items[i].issues[j].issueSolution !== "" ? utils.escape_html(dataVallydette.checklist.page[currentPage].items[i].issues[j].issueSolution) : langVallydette.notSpecified}
									<h3 class="mb-0">${langVallydette.technical_solution}</h3>
									${dataVallydette.checklist.page[currentPage].items[i].issues[j].issueTechnicalSolution !== "" ? utils.escape_html(dataVallydette.checklist.page[currentPage].items[i].issues[j].issueTechnicalSolution) : langVallydette.notSpecified}
								</div>
								<button id="editIssueBtn-${targetId}-${j}" class="btn btn-secondary btn-sm" onClick="editIssue('${targetId}','${j}')">${langVallydette.edit}</button>
								<button id="deleteIssueBtn-${targetId}-${j}" class="btn btn-secondary btn-sm" onClick="deleteConfirmationIssue('${targetId}','${j}')">${langVallydette.delete}</button>
							</div>
						</div>
					</div>
				`;
			}
		}
	}
	return htmlModal;
}

/**
 * Delete confirmation feedback
 * @param {string} targetId - current test ID
 * @param {string} issueIndex - index of the issue to remove into an issue array
*/
const deleteConfirmationIssue = (targetId, issueIndex) => {
	const htmlIssueFeedback = `
		<div id="deleteIssueBtn-${targetId}-${issueIndex}-feedback">
			<span id="deleteIssueMessage-${targetId}-${issueIndex}">${langVallydette.issueTxt3}</span>
			<button type="button" id="btnDeleteIssueNo-${targetId}-${issueIndex}" aria-labelledby="deleteIssueMessage-${targetId}-${issueIndex} btnDeleteIssueNo-${targetId}-${issueIndex}" class="btn btn-secondary btn-sm" onClick="deleteIssue('${targetId}','${issueIndex}', false)">${langVallydette.no}</button>
			<button type="button" id="btnDeleteIssueYes-${targetId}-${issueIndex}" class="btn btn-secondary btn-sm"  aria-labelledby="deleteIssueMessage-${targetId}-${issueIndex} btnDeleteIssueYes-${targetId}-${issueIndex}"  onClick="deleteIssue('${targetId}','${issueIndex}', true)">${langVallydette.yes}</button>
		</div>
	`;

	const elButton = document.getElementById(`deleteIssueBtn-${targetId}-${issueIndex}`);
	elButton.insertAdjacentHTML("afterend", htmlIssueFeedback);
	document.getElementById(`btnDeleteIssueNo-${targetId}-${issueIndex}`).focus();
}

/**
 * Delete an issue from the vallydette object.
 * @param {string} targetId - current test ID.
 * @param {string} issueIndex - index of the issue to remove into an issue array
 * @param {boolean} issueValidation - if true => run the deletion, if false => come back to the issues list
*/
const deleteIssue = (targetId, issueIndex, issueValidation) => {
	if (issueValidation) {
		for (const i in dataVallydette.checklist.page[currentPage].items) {
			if (dataVallydette.checklist.page[currentPage].items[i].ID === targetId) {
				dataVallydette.checklist.page[currentPage].items[i].issues.splice(issueIndex, 1);
				if (dataVallydette.checklist.page[currentPage].items[i].issues.length === 0) {
					document.getElementById(`issueDisplayBtn${targetId}`).setAttribute("disabled", true);
				}
			}
		}
		utils.removeElement(document.getElementById(`cardIssue${targetId}-${issueIndex}`));
		utils.putTheFocus(document.getElementById("modalEditIssueTitle"));
		jsonUpdate();
		document.getElementById('issueList').innerHTML = displayIssueBody(targetId);
	} else {
		utils.removeElement(document.getElementById(`deleteIssueBtn-${targetId}-${issueIndex}-feedback`));
		document.getElementById(`deleteIssueBtn-${targetId}-${issueIndex}`).focus();
	}
}
