	
	var iterator = 0;
	
	var useCookies = false;
	
	var previousAnswers = null;
	var allValues = "";
	var cookieDuration = 60; //minutes
	
	
	function updateAnswers(sender) {
		switch(sender)
		{
			case 'q1':
				if(document.getElementById('q1Dropdown').value == "Yes"){
					showSubQuestion('q1a');
				}
				else if(document.getElementById('q1Dropdown').value == "No"){
					showReviewPromptModal();
				}
				break;
			case 'q1a':
				if(document.getElementById('q1aDropdown').value == "Yes"){
					showQuestion('q2');
				}
				else if(document.getElementById('q1aDropdown').value == "No"){
					showAssessPromptModal();
				}
				break;
				
			case 'q2':
				if(document.getElementById('q2Dropdown').value == "Yes"){
					showQuestion('q4');
				}
				else if(document.getElementById('q2Dropdown').value == "No"){
					showSubQuestion('q2a');
				}
				break;
			case 'q2a':
				if(document.getElementById('q2aDropdown').value == "Yes"){
					showQuestion('q4');
				}
				else if(document.getElementById('q2aDropdown').value == "No"){
					showSubQuestion('q2b');
				}
				break;
			case 'q2b':
				if(document.getElementById('q2bDropdown').value == "Yes"){
					showQuestion('q4');
				}
				else if(document.getElementById('q2bDropdown').value == "No"){
					showQuestion('q3');
				}
				break;
				
			case 'q3':
				if(document.getElementById('q3Dropdown').value == "Yes"){
					showSubQuestion('q3a');
				}
				else if(document.getElementById('q3Dropdown').value == "No"){
					showSuccessModal();
				}
				break;
			case 'q3a':
				if(document.getElementById('q3aDropdown').value == "Yes"){
					showSuccessModal();
				}
				else if(document.getElementById('q3aDropdown').value == "No"){
					showQuestion('q4');
				}
				break;
				
			case 'q4':
				if(document.getElementById('q4Dropdown').value == "Yes"){
					showSubQuestion('q4a');
				}
				else if(document.getElementById('q4Dropdown').value == "No"){
					showTrustProvideModal();
				}
				break;
			case 'q4a':
				if(document.getElementById('q4aDropdown').value == "Yes"){
					showSuccessTrustProvideModal();
				}
				else if(document.getElementById('q4aDropdown').value == "No"){
					showProvideBriefingModal();
				}
				break;
		}
	}
	
	function hideEverything() {
		
		hideReviewPromptModal();
		hideAssessPromptModal();
		hideSuccessModal();
		hideTrustProvideModal();
		hideSuccessTrustProvideModal();
		hideProvideBriefingModal();
		hideActiveXPrompt();
		
		document.getElementById('q1a').style.visibility = 'hidden';
		document.getElementById('q2').style.display = 'none';
		document.getElementById('q2a').style.visibility = 'hidden';
		document.getElementById('q2b').style.visibility = 'hidden';
		document.getElementById('q3').style.display = 'none';
		document.getElementById('q3a').style.visibility = 'hidden';
		document.getElementById('q4').style.display = 'none';
		document.getElementById('q4a').style.visibility = 'hidden';
	}
	
	function showQuestion(question) {
		document.getElementById(question).style.display = 'inline-block';
		document.getElementById(question).className += " highlightQuestion";
		setTimeout(function(){document.getElementById(question).classList.remove("highlightQuestion");}, 500);
	}

	function showSubQuestion(question) {
		document.getElementById(question).style.visibility = 'visible';
		document.getElementById(question).className += " highlightQuestion";
		setTimeout(function(){document.getElementById(question).classList.remove("highlightQuestion");}, 500);
		
	}
	
	
	function hideActiveXPrompt() {
		document.getElementById('activeXEnablePromptOverlay').style.display = 'none';
	}
	
	function showReviewPromptModal() {
		document.getElementById('modalOverlay').style.visibility = 'visible';
		document.getElementById('reviewPromptModal').style.visibility = 'visible';
	}
	function hideReviewPromptModal() {
		document.getElementById('modalOverlay').style.visibility = 'hidden';
		document.getElementById('reviewPromptModal').style.visibility = 'hidden';
	}
	
	function showAssessPromptModal() {
		document.getElementById('modalOverlay').style.visibility = 'visible';
		document.getElementById('assessPromptModal').style.visibility = 'visible';
	}
	function hideAssessPromptModal() {
		document.getElementById('modalOverlay').style.visibility = 'hidden';
		document.getElementById('assessPromptModal').style.visibility = 'hidden';
	}
	
	function showSuccessModal() {
		document.getElementById('modalOverlay').style.visibility = 'visible';
		document.getElementById('successModal').style.visibility = 'visible';
	}
	function hideSuccessModal() {
		document.getElementById('modalOverlay').style.visibility = 'hidden';
		document.getElementById('successModal').style.visibility = 'hidden';
	}
	
	function showTrustProvideModal() {
		document.getElementById('modalOverlay').style.visibility = 'visible';
		document.getElementById('trustProvideModal').style.visibility = 'visible';
	}
	function hideTrustProvideModal() {
		document.getElementById('modalOverlay').style.visibility = 'hidden';
		document.getElementById('trustProvideModal').style.visibility = 'hidden';
	}
	
	function showSuccessTrustProvideModal() {
		document.getElementById('modalOverlay').style.visibility = 'visible';
		document.getElementById('successTrustProvideModal').style.visibility = 'visible';
	}
	function hideSuccessTrustProvideModal() {
		document.getElementById('modalOverlay').style.visibility = 'hidden';
		document.getElementById('successTrustProvideModal').style.visibility = 'hidden';
	}
	
	function showProvideBriefingModal() {
		document.getElementById('modalOverlay').style.visibility = 'visible';
		document.getElementById('provideBriefingModal').style.visibility = 'visible';
	}
	function hideProvideBriefingModal() {
		document.getElementById('modalOverlay').style.visibility = 'hidden';
		document.getElementById('provideBriefingModal').style.visibility = 'hidden';
	}
	
	
	function restartAssessment() {
		
		document.getElementById('q1Dropdown').selectedIndex = 0;
		document.getElementById('q1aDropdown').selectedIndex = 0;
		document.getElementById('q2Dropdown').selectedIndex = 0;
		document.getElementById('q2aDropdown').selectedIndex = 0;
		document.getElementById('q2bDropdown').selectedIndex = 0;
		document.getElementById('q3Dropdown').selectedIndex = 0;
		document.getElementById('q3aDropdown').selectedIndex = 0;
		document.getElementById('q4Dropdown').selectedIndex = 0;
		document.getElementById('q4aDropdown').selectedIndex = 0;
		
		hideEverything();
	}
	