	
	//Equipment
	//	O2
	//	WheelchairToFrom
	//	BariatricWheelchair
	
	//Requirements
	//	Bariatric
	//	CarryChair
	//	BringWheelchair
	
	const maxWheelchairWeight= 300; //kg
	const maxCarryWeight= 158; //kg, 25st
	const bariatricWeight = 114; //kg, 18st
	
	var iterator = 0;
	
	var useCookies = false;
	
	var previousAnswers = null;
	var allValues = "";
	var cookieDuration = 60; //minutes
	
	var o2 = false;
	var wheelchairToFrom = false;
	var bariatricWheelchair = false;
	
	var bariatric = false;
	var carryChair = false;
	var bringWheelchair = false;
	
	var steps = false;
	
	var q2StoreNextQuestion = '';
	
	var howMuchOxygen = 0;
	var weight = -1;	var travelsInWheelchair = false;	var stretcher = false;	
	var wheelchairVehicle = false;
	
	var weightAsked = false;
	
	var contract;
	
	function setup() {
		hideEverything();
		checkCookies();
		
		window.alert("setup");
		if(useCookies)
		{
			window.alert("contract index: " + getCookie("contract"));
			document.getElementById("contractSelect").index = getCookie("contract");
			changeContract();
		}
	}
	
	function updateAnswers(sender) {
		switch(sender)
		{
			case 'q1':
				howMuchOxygen = 0;
				if(document.getElementById('q1Dropdown').value == "Yes"){
					updateEquipment('o2', true);
					showSubQuestion('q1a');
				}
				else if(document.getElementById('q1Dropdown').value == "No"){
					updateEquipment('o2', false);
					showQuestion('q2');
				}
				
				break;

			case 'q1a':
				
				if(document.getElementById('q1aDropdown').value == "Yes"){
					showSubQuestion('q1b');
					howMuchOxygen = 0;
				}
				else if(document.getElementById('q1aDropdown').value == "No"){
					showQuestion('q2');
				}
				
				break;

			case 'q1b':
				
				howMuchOxygen = document.getElementById('q1bInputBox').value;
				suggestMobility('EMT');
				
				break;

				
			case 'q2': //Will the patient need to be in a wheelchair to and from the vehicle?
				
				if(document.getElementById('q2Dropdown').value == "Yes"){
					updateEquipment('wheelchairToFrom', true);
					showSubQuestion('q2a');
				}
				else if(document.getElementById('q2Dropdown').value == "No"){
					updateEquipment('wheelchairToFrom', false);
					//Must be at least 2 man if the patient needs oxygen
					if(o2)
					{
						showQuestion('q5');
					}
					else
					{
						showQuestion('q3');
					}
				}
				
				break;

			case 'q2a': //Would the patient be able to transfer out of their wheelchair?
				
				if(document.getElementById('q2aDropdown').value == "Yes"){
					showSubQuestion('q2b');
				}
				else if(document.getElementById('q2aDropdown').value == "No"){
					wheelchairVehicle = true;
					//If the patient can't transfer out of their wheelchair, they must have their own
					//But we still have to know if it's manual or electric
					showSubQuestion('q2c');
				}
				
				break;

			case 'q2b': //Will the patient provide their own wheelchair?
				
				if(document.getElementById('q2bDropdown').value == "Yes"){
					updateRequirements('bringWheelchair', false);
					if(wheelchairVehicle)
					{
						showSubQuestion('q2c');
					}
					else
					{
						if(o2)
						{
							q2StoreNextQuestion = 'q5';
							showSubQuestion('q2d');
						}
						else
						{
							q2StoreNextQuestion = 'q4';
							showSubQuestion('q2d');
						}
					}
				}
				else if(document.getElementById('q2bDropdown').value == "No"){
					updateRequirements('bringWheelchair', true);
					if(o2)
					{
						q2StoreNextQuestion = 'q5';
						showSubQuestion('q2d');
					}
					else
					{
						q2StoreNextQuestion = 'q4';
						showSubQuestion('q2d');
					}
				}
				
				break;

			case 'q2c': //Is the patient's wheelchair manual or electric?
				
				if(document.getElementById('q2cDropdown').value == "Electric"){
					showWheelchairCheckBox();
				}
				//Wheelchair vehicle may have been set to true by 2a
				if(wheelchairVehicle)
				{
					if(o2)
					{
						q2StoreNextQuestion = 'q5';
						showSubQuestion('q2d');
					}
					else
					{
						//If it has to be a wheelchair vehicle it can't be a Walker car
						q2StoreNextQuestion = 'q4';
						showSubQuestion('q2d');
					}
				}
				else
				{
					q2StoreNextQuestion = 'q3';
					showSubQuestion('q2d');
				}
				
				break;
			
			case 'q2d':
				
				if(document.getElementById('q2dDropdown').value == "Yes"){
					updateRequirements('bariatric', true);
					showSubQuestion('q2e');
				}
				else if(document.getElementById('q2dDropdown').value == "No"){
					showQuestion(q2StoreNextQuestion);
					updateRequirements('bariatric', false);
				}
				
				weightAsked = true;
				break;

			case 'q2e':
				
				weight = document.getElementById('q2eInputBox').value;
				if(weight < bariatricWeight)
				{
					showWeightConfirmBox('q2e');
					break;
				}
				if(weight >= maxWheelchairWeight)
				{
					updateRequirements('bariatric', true);
					showReferToControlBox("The patient's weight exceeds the maximum wheelchair weight");
				}
				if(weight >= bariatricWeight)
				{
					updateRequirements('bariatric', true);
					if(bringWheelchair)
					{
						updateEquipment('bariatricWheelchair', true);
					}
					showQuestion(q2StoreNextQuestion);
				}
				else
				{
					updateRequirements('bariatric', false);
					showQuestion(q2StoreNextQuestion);
				}
				
				
				break;
			
			
			case 'q3':
				
				if(document.getElementById('q3Dropdown').value == "Yes"){
					suggestMobility('Walker car');
				}
				else if(document.getElementById('q3Dropdown').value == "No"){
					showQuestion('q4');
				}
				
				break;



			case 'q4':
				
				if(document.getElementById('q4Dropdown').value == "Yes"){
					if(wheelchairVehicle)
					{
						suggestMobility('Wheelchair 1 Man');
					}
					else
					{
						suggestMobility('Seated 1 Man');
					}
				}
				else if(document.getElementById('q4Dropdown').value == "No"){
					showQuestion('q5');
				}
				
				window.scrollBy(0, 1000);
				
				break;



			case 'q5': // Does the patient have any stairs/steps on their property that they will need assistance with?
				
				if(document.getElementById('q5Dropdown').value == "Yes"){
					
					if(weight > maxCarryWeight){
						showReferToControlBox("The patient's weight exceeds the maximum carry weight");
					}
					else {
						showSubQuestion('q5a');
						steps = true;
					}
				}
				else if(document.getElementById('q5Dropdown').value == "No"){
					if(wheelchairToFrom)
					{
						if(wheelchairVehicle)
						{
							suggestMobility('Wheelchair 2 Man');
						}
						else
						{						
							suggestMobility('Seated 2 Man');
						}
					}
					else
					{
						showQuestion('q6');
					}
					window.scrollBy(0, 1000);
					steps = false;
				}
				
				break;
				
			case 'q5a': // Are there any turns in the stairs/steps?
				
				if(document.getElementById('q5aDropdown').value == "Yes"){
					showReferToControlBox("");
				}
				else if(document.getElementById('q5aDropdown').value == "No"){
					if(!weightAsked)
					{
						showSubQuestion('q5b');
					}
					else
					{
						if(weight >= bariatricWeight)
						{
							updateRequirements('bariatric', true);
							updateRequirements('carryChair', true);
						}
						if(wheelchairToFrom)
						{
							if(wheelchairVehicle)
							{
								suggestMobility('Wheelchair 2 Man');
							}
							else
							{						
								suggestMobility('Seated 2 Man');
							}
						}
						else
						{
							showQuestion('q6');
						}
					}
				}
				
				break;

			case 'q5b': // Is the patient over 18 stone/114kg?
				
				weightAsked = true;
				if(document.getElementById('q5bDropdown').value == "Yes"){
					showSubQuestion('q5c');
					updateRequirements('bariatric', true);
					updateRequirements('carryChair', true);
				}
				else if(document.getElementById('q5bDropdown').value == "No"){
					updateRequirements('bariatric', false);
					updateRequirements('carryChair', false);
					if(wheelchairToFrom)
					{
						if(wheelchairVehicle)
						{
							suggestMobility('Wheelchair 2 Man');
						}
						else
						{						
							suggestMobility('Seated 2 Man');
						}
					}
					else
					{
						showQuestion('q6');
					}
				}
				
				break;

			case 'q5c': // What is the patient's weight (in kg)?
				weightAsked = true;
				weight = document.getElementById('q5cInputBox').value;
				
				if(weight < bariatricWeight)
				{
					showWeightConfirmBox("q5c");
					break;
				}
				if(weight > maxCarryWeight){
					showReferToControlBox("The patient's weight exceeds the maximum carry weight");
				}
				else {
					if(wheelchairToFrom)
					{
						if(wheelchairVehicle)
						{
							suggestMobility('Wheelchair 2 Man');
						}
						else
						{						
							suggestMobility('Seated 2 Man');
						}
					}
					else
					{
						showQuestion('q6');
					}
				}
				break;





			case 'q6':
				
				if(document.getElementById('q6Dropdown').value == "No"){
					if(wheelchairVehicle)
					{
						suggestMobility('Wheelchair 2 Man');
					}
					else
					{						
						suggestMobility('Seated 2 Man');
					}
					stretcher = false;
				}
				else if(document.getElementById('q6Dropdown').value == "Yes"){
					stretcher = true;
					if(bariatric && weight > -1){
						suggestMobility('Bariatric Stretcher');
					}
					else
					{
						showSubQuestion('q6a');
					}
				}
				
				break;

			case 'q6a':
				
				weight = document.getElementById('q6aInputBox').value;
				
				if(document.getElementById('q6aInputBox').value >= bariatricWeight){
					if(weightAsked && bariatric == false) //Contradiction box's continue button sets weightAsked to false to avoide reaching this again
					{
						showWeightContradictionBox();
						break;
					}
					if(document.getElementById('q6aInputBox').value >= maxCarryWeight)
					{
						showReferToControlBox("Patient's weight exceeds the maximum carry weight");
						break;
					}
					updateRequirements('bariatric', true);
					suggestMobility('Bariatric Stretcher');
				}
				else{
					updateRequirements('bariatric', false);
					suggestMobility('Stretcher');
				}
				
				break;
		}
		
	}
	
	
	function suggestMobility(mobility) {
		document.getElementById('suggestion').innerHTML = parseContractMobility(mobility);
		showSuggestionBox();
		
		var additionalDetails = "";
		var equipment = "";
		var requirements = "";
		
		if(o2){
			additionalDetails = additionalDetails.concat("<p>Requires O2" + ((howMuchOxygen == 0) ? " (less than 4 litres)" : " (" + howMuchOxygen + " litres)") + "</p>");
			equipment = equipment.concat("<p>Oxygen req'd</p>");
		}
		if(wheelchairToFrom && !stretcher){
			additionalDetails = additionalDetails.concat("<p>Wheelchair required to and from vehicle</p>");
			equipment = equipment.concat("<p>Wheel Chair to/from</p>");
		}
		if(mobility == 'Bariatric Wheelchair'){
			equipment = equipment.concat("<p>Bariatric Wheelchair Required</p>");
		}
		if(bariatric){
			additionalDetails = additionalDetails.concat("<p>Patient is Bariatric</p>");
			requirements = requirements.concat("<p>Bariatric Patient</p>");
		}
		if(carryChair && !stretcher){
			requirements = requirements.concat("<p>Requires Carry Chair</p>");
		}
		if(bringWheelchair && !stretcher){
			requirements = requirements.concat("<p>Needs " + (bariatric ? "Bariatric " : "") + "Wheelchair on arrival</p>");			
		}
		if(weight > -1){
			additionalDetails = additionalDetails.concat("<p>Weight: " + weight + "kg</p>");
		}
		if(steps)
		{
			additionalDetails = additionalDetails.concat("<p>Steps on property (if possible, add how many steps there are)</p>");
		}
		
		if(additionalDetails == ""){
			additionalDetails = "None";
		}
		if(requirements == ""){
			requirements = "None";
		}
		if(equipment == ""){
			equipment = "None";
		}
		
		document.getElementById("journeyNotesDiv").innerHTML = additionalDetails;
		document.getElementById("mobilityDescription").innerHTML = getMobilityDescription(mobility);
		document.getElementById("requirementsDiv").innerHTML = requirements;
		document.getElementById("equipmentDiv").innerHTML = equipment;
		
	}
	
	function getMobilityDescription(mobility){
		switch(mobility)
		{
			case 'EMT':
				return "Patient requires specialist care";
			
			case 'Walker car':
				return "Walking patient. Can mobilise and travel by car";
			
			case 'Seated 1 Man':
				return "Can transfer with the assistance one staff member and does not require conveyance over 2 or more steps at pick up/drop off location.";
			
			case 'Seated 2 Man':
				return "Requires 2 staff to transfer and requires conveyance over 2 or more steps at the pick up/drop off location. Non- self caring patients who require oxygen also need to be booked as this mobility."
			
			case 'Wheelchair 1 Man':
				return "Requires one staff member to assist at pick up/drop off location and travels in their own wheelchair";
			
			case 'Wheelchair 2 Man':
				return "Requires two staff members to assist at pick up and/or drop off location and travels in their own wheelchair";
			
			case 'Stretcher':
				return "Patient is bed bound and requires a stretcher to be conveyed";
			
			case 'Bariatric Stretcher':
				return "Patient requires the use of specialist lifting or carrying equipment, and/or the assistance of more than 2 crew";
			
			default: return "null";
		}
		
	}
	
	function hideEverything() {
		
		hideSuggestionBox();
		hideReferToControlBox();
		hideWheelchairCheckBox();
		hideWeightConfirmBox();
		hideWeightContradictionBox();
		hideActiveXPrompt();
		
		document.getElementById('q1a').style.visibility = 'hidden';
		document.getElementById('q1b').style.visibility = 'hidden';
		document.getElementById('q2').style.display = 'none';
		document.getElementById('q2a').style.visibility = 'hidden';
		document.getElementById('q2b').style.visibility = 'hidden';
		document.getElementById('q2c').style.visibility = 'hidden';
		document.getElementById('q2d').style.visibility = 'hidden';
		document.getElementById('q2e').style.visibility = 'hidden';
		document.getElementById('q3').style.display = 'none';
		document.getElementById('q4').style.display = 'none';
		document.getElementById('q5').style.display = 'none';
		document.getElementById('q5a').style.visibility = 'hidden';
		document.getElementById('q5b').style.visibility = 'hidden';
		document.getElementById('q5c').style.visibility = 'hidden';
		document.getElementById('q6').style.display = 'none';
		document.getElementById('q6a').style.visibility = 'hidden';
	}
	
	
	function showQuestion(question) {
		document.getElementById(question).style.display = 'inline-block';
	}
	
	function showSubQuestion(question) {
		document.getElementById(question).style.visibility = 'visible';
		highlightQuestion(question);
	}
	
	function highlightQuestion(question) {
		document.getElementById(question).className += " highlightQuestion";
		setTimeout(function(){document.getElementById(question).classList.remove("highlightQuestion");}, 500);		
	}
	
	
	function changeContract() {
		contract = document.getElementById("contractSelect").value;
		
		if(useCookies)
		{
			document.cookie = "contract=" + document.getElementById("contractSelect").index + "; expires=Tue, 19 Jan 2038 04:14:07 UTC" + "; path=/";
		}
		
		switch(contract)
		{
			case "k&m":
				document.getElementById("contractOxygenMinimum").innerHTML = "4";
				document.getElementById("q1bInputBox").setAttribute('min', '4');
				document.getElementById("q1bInputBox").setAttribute('value', '4');
				break;
			case "uclh":
				document.getElementById("contractOxygenMinimum").innerHTML = "6";
				document.getElementById("q1bInputBox").setAttribute('min', '6');
				document.getElementById("q1bInputBox").setAttribute('value', '6');
				break;
		}
	}
	
	
	function hideActiveXPrompt() {
		document.getElementById('activeXEnablePromptOverlay').style.display = 'none';
	}
	
	function showSuggestionBox() {
		document.getElementById('modalOverlay').style.visibility = 'visible';
		document.getElementById('suggestionBox').style.visibility = 'visible';
	}
	function hideSuggestionBox() {
		document.getElementById('modalOverlay').style.visibility = 'hidden';
		document.getElementById('suggestionBox').style.visibility = 'hidden';
	}
	
	function showReferToControlBox(reason) {
		document.getElementById('modalOverlay').style.visibility = 'visible';
		document.getElementById('referToControlBox').style.visibility = 'visible';
		document.getElementById('referReason').innerHTML = reason;
	}
	function hideReferToControlBox() {
		document.getElementById('modalOverlay').style.visibility = 'hidden';
		document.getElementById('referToControlBox').style.visibility = 'hidden';
	}
	
	function showWheelchairCheckBox() {
		document.getElementById('modalOverlay').style.visibility = 'visible';
		document.getElementById('wheelchairCheck').style.visibility = 'visible';
	}
	function hideWheelchairCheckBox() {
		document.getElementById('modalOverlay').style.visibility = 'hidden';
		document.getElementById('wheelchairCheck').style.visibility = 'hidden';
	}

	function showWeightConfirmBox() {
		document.getElementById('modalOverlay').style.visibility = 'visible';
		document.getElementById('weightConfirmBox').style.visibility = 'visible';
	}
	function hideWeightConfirmBox() {
		document.getElementById('modalOverlay').style.visibility = 'hidden';
		document.getElementById('weightConfirmBox').style.visibility = 'hidden';
	}

	function showWeightContradictionBox() {
		document.getElementById('modalOverlay').style.visibility = 'visible';
		document.getElementById('weightContradictionBox').style.visibility = 'visible';
	}
	function hideWeightContradictionBox() {
		document.getElementById('modalOverlay').style.visibility = 'hidden';
		document.getElementById('weightContradictionBox').style.visibility = 'hidden';
	}
	
	
	function updateEquipment(equipment, setActive) {
		switch(equipment)
		{
			case 'o2':
					if(setActive)
					{
						document.getElementById("infoO2").style.backgroundColor = "#44FFFF";
						o2 = true;
					}
					else
					{
						document.getElementById("infoO2").style.backgroundColor = "#DDDDDD";
						o2 = false;
					}
				break;
			case 'wheelchairToFrom':
					if(setActive)
					{
						document.getElementById("infoWheelchairToFrom").style.backgroundColor = "#44FFFF";
						wheelchairToFrom = true;
					}
					else
					{
						document.getElementById("infoWheelchairToFrom").style.backgroundColor = "#DDDDDD";
						wheelchairToFrom = false;
					}
				break;
			case 'bariatricWheelchair':
					if(setActive)
					{
						document.getElementById("infoBariatricWheelchair").style.backgroundColor = "#44FFFF";
						bariatricWheelchair = true;
					}
					else
					{
						document.getElementById("infoBariatricWheelchair").style.backgroundColor = "#DDDDDD";
						bariatricWheelchair = false;
					}
				break;
		}
	}
	
	function updateRequirements(requirement, setActive) {
		switch(requirement)
		{
			case 'bariatric':
					if(setActive)
					{
						document.getElementById("infoBariatric").style.backgroundColor = "#44FFFF";
						bariatric = true;
					}
					else
					{
						document.getElementById("infoBariatric").style.backgroundColor = "#DDDDDD";
						bariatric = false;
					}
				break;
			case 'carryChair':
					if(setActive)
					{
						document.getElementById("infoCarryChair").style.backgroundColor = "#44FFFF";
						carryChair = true;
					}
					else
					{
						document.getElementById("infoCarryChair").style.backgroundColor = "#DDDDDD";
						carryChair = false;
					}
				break;
			case 'bringWheelchair':
					if(setActive)
					{
						document.getElementById("infoBringWheelchair").style.backgroundColor = "#44FFFF";
						bringWheelchair = true;
					}
					else
					{
						document.getElementById("infoBringWheelchair").style.backgroundColor = "#DDDDDD";
						bringWheelchair = false;
					}
				break;
		}
	}
	
	
	function restartAssessment() {
		
		if(document.getElementById('q1Dropdown').selectedIndex != 0)
		{
			previousAnswers = [];
			
			previousAnswers.push(o2);					//0
			previousAnswers.push(wheelchairToFrom);		//1
			previousAnswers.push(bariatricWheelchair);	//2
			previousAnswers.push(bariatric);			//3
			previousAnswers.push(carryChair);			//4
			previousAnswers.push(bringWheelchair);		//5
			previousAnswers.push(steps);				//6
			previousAnswers.push(q2StoreNextQuestion);	//7
			previousAnswers.push(howMuchOxygen);		//8
			previousAnswers.push(weight);				//9
			previousAnswers.push(travelsInWheelchair);	//10
			previousAnswers.push(stretcher);			//11
			previousAnswers.push(wheelchairVehicle);	//12
			
			updateEquipment("o2", false);
			updateEquipment("wheelchairToFrom", false);
			updateEquipment("bariatricWheelchair", false);
			
			updateRequirements("bariatric", false);
			updateRequirements("carryChair", false);
			updateRequirements("bringWheelchair", false);
		
			steps = false;
		
			q2StoreNextQuestion = '';
		
			howMuchOxygen = 0;
			weight = -1;
			travelsInWheelchair = false;
			stretcher = false;
			
			wheelchairVehicle = false;
			
			
			
			previousAnswers.push(document.getElementById('q1Dropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q1aDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q1bInputBox').value);		
			previousAnswers.push(document.getElementById('q2Dropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q2aDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q2bDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q2cDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q2dDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q2eInputBox').value);		
			previousAnswers.push(document.getElementById('q3Dropdown').selectedIndex);		
			previousAnswers.push(document.getElementById('q4Dropdown').selectedIndex);		
			previousAnswers.push(document.getElementById('q5Dropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q5aDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q5bDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q5cInputBox').value);		
			previousAnswers.push(document.getElementById('q6Dropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q6aInputBox').value);
			
			
			previousAnswers.push(document.getElementById('q1a').style.visibility);
			previousAnswers.push(document.getElementById('q1b').style.visibility);
			previousAnswers.push(document.getElementById('q2').style.display);
			previousAnswers.push(document.getElementById('q2a').style.visibility);
			previousAnswers.push(document.getElementById('q2b').style.visibility);
			previousAnswers.push(document.getElementById('q2c').style.visibility);
			previousAnswers.push(document.getElementById('q2d').style.visibility);
			previousAnswers.push(document.getElementById('q2e').style.visibility);
			previousAnswers.push(document.getElementById('q3').style.display);
			previousAnswers.push(document.getElementById('q4').style.display);
			previousAnswers.push(document.getElementById('q5').style.display);
			previousAnswers.push(document.getElementById('q5a').style.visibility);
			previousAnswers.push(document.getElementById('q5b').style.visibility);
			previousAnswers.push(document.getElementById('q5c').style.visibility);
			previousAnswers.push(document.getElementById('q6').style.display);
			previousAnswers.push(document.getElementById('q6a').style.visibility);
			
			document.getElementById('q1Dropdown').selectedIndex = 0;
			document.getElementById('q1aDropdown').selectedIndex = 0;
			document.getElementById('q1bInputBox').value = 4;		
			document.getElementById('q2Dropdown').selectedIndex = 0;
			document.getElementById('q2aDropdown').selectedIndex = 0;
			document.getElementById('q2bDropdown').selectedIndex = 0;
			document.getElementById('q2cDropdown').selectedIndex = 0;
			document.getElementById('q2dDropdown').selectedIndex = 0;
			document.getElementById('q2eInputBox').value = bariatricWeight;		
			document.getElementById('q3Dropdown').selectedIndex = 0;		
			document.getElementById('q4Dropdown').selectedIndex = 0;		
			document.getElementById('q5Dropdown').selectedIndex = 0;
			document.getElementById('q5aDropdown').selectedIndex = 0;
			document.getElementById('q5bDropdown').selectedIndex = 0;
			document.getElementById('q5cInputBox').value = bariatricWeight;
			document.getElementById('q6Dropdown').selectedIndex = 0;
			document.getElementById('q6aInputBox').value = bariatricWeight;
			
			if(useCookies)
			{
				allValues = "";
				for(iterator = 0; iterator < previousAnswers.length; iterator++)
				{
					allValues += previousAnswers[iterator] + "|";
				}
				document.cookie = "allValues=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
				
				var now = new Date();
				var time = now.getTime();
				time += (60*1000) * cookieDuration;
				now.setTime(time);
				document.cookie = "allValues=" + allValues + "; expires=" + now.toUTCString() + "; path=/";
			}
			
			hideEverything();
		}
	}
	
	function restoreAssessment() {
		if(document.getElementById('q1Dropdown').selectedIndex == 0) {
			
			var theCookie = getCookie("allValues");
			
			previousAnswers = theCookie.split('|');
			
			updateEquipment("o2", 					previousAnswers[0] == "true");
			updateEquipment("wheelchairToFrom", 	previousAnswers[1] == "true");
			updateEquipment("bariatricWheelchair", 	previousAnswers[2] == "true");
			updateRequirements("bariatric", 		previousAnswers[3] == "true");
			updateRequirements("carryChair", 		previousAnswers[4] == "true");
			updateRequirements("bringWheelchair", 	previousAnswers[5] == "true");
			
			steps = 								previousAnswers[6] == "true";
			q2StoreNextQuestion = 					previousAnswers[7];
			howMuchOxygen = 						previousAnswers[8];
			weight = 								previousAnswers[9];
			travelsInWheelchair = 					previousAnswers[10] == "true";
			stretcher = 							previousAnswers[11] == "true";
			wheelchairVehicle = 					previousAnswers[12] == "true";
			
			
			document.getElementById('q1Dropdown').selectedIndex = 	previousAnswers[13];
			document.getElementById('q1aDropdown').selectedIndex = 	previousAnswers[14];
			document.getElementById('q1bInputBox').value = 			previousAnswers[15];			
			document.getElementById('q2Dropdown').selectedIndex = 	previousAnswers[16];
			document.getElementById('q2aDropdown').selectedIndex = 	previousAnswers[17];
			document.getElementById('q2bDropdown').selectedIndex = 	previousAnswers[18];
			document.getElementById('q2cDropdown').selectedIndex = 	previousAnswers[19];
			document.getElementById('q2dDropdown').selectedIndex = 	previousAnswers[20];
			document.getElementById('q2eInputBox').value = 			previousAnswers[21];			
			document.getElementById('q3Dropdown').selectedIndex = 	previousAnswers[22];			
			document.getElementById('q4Dropdown').selectedIndex = 	previousAnswers[23];			
			document.getElementById('q5Dropdown').selectedIndex = 	previousAnswers[24];
			document.getElementById('q5aDropdown').selectedIndex = 	previousAnswers[25];
			document.getElementById('q5bDropdown').selectedIndex = 	previousAnswers[26];
			document.getElementById('q5cInputBox').value = 			previousAnswers[27];			
			document.getElementById('q6Dropdown').selectedIndex = 	previousAnswers[28];
			document.getElementById('q6aInputBox').value = 			previousAnswers[29];
			
			
			document.getElementById('q1a').style.visibility = 		previousAnswers[30];
			document.getElementById('q1b').style.visibility = 		previousAnswers[31];
			document.getElementById('q2').style.display = 			previousAnswers[32];
			document.getElementById('q2a').style.visibility = 		previousAnswers[33];
			document.getElementById('q2b').style.visibility = 		previousAnswers[34];
			document.getElementById('q2c').style.visibility = 		previousAnswers[35];
			document.getElementById('q2d').style.visibility = 		previousAnswers[36];
			document.getElementById('q2e').style.visibility = 		previousAnswers[37];
			document.getElementById('q3').style.display = 			previousAnswers[38];
			document.getElementById('q4').style.display = 			previousAnswers[39];
			document.getElementById('q5').style.display = 			previousAnswers[40];
			document.getElementById('q5a').style.visibility = 		previousAnswers[41];
			document.getElementById('q5b').style.visibility = 		previousAnswers[42];
			document.getElementById('q5c').style.visibility = 		previousAnswers[43];
			document.getElementById('q6').style.display = 			previousAnswers[44];
			document.getElementById('q6a').style.visibility = 		previousAnswers[45];
		}
	}
	
	
	function enableCookies() {
		useCookies = true;
		
		var now = new Date();
		var time = now.getTime();
		time += (60*60*1000) * 24; //24 Hours
		now.setTime(time);
		document.cookie = "useCookies=true; expires=Tue, 19 Jan 2038 04:14:07 UTC; path=/";
		
		document.getElementById('restartButton').style.display = "inline-block";
		document.getElementById('restoreButton').style.display = "inline-block";
		document.getElementById('cookieButton').style.display = "none";
	}
	
	function checkCookies() {
		if(getCookie("useCookies") == "true"){
			enableCookies();
		}
	}
	
	function getCookie(cookieName) {
		cookieName += "=";
		
		var decodedCookie = decodeURIComponent(document.cookie);
		var splitCookie = decodedCookie.split(';');
		
		for(var i = 0; i <splitCookie.length; i++) {
			var c = splitCookie[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(cookieName) == 0) {
				return c.substring(cookieName.length, c.length);
			}
		}
	}
	
	
	function parseContractMobility(mobility) {
		switch(mobility)
		{
			case "Walker car":
				return contract=="k&m" ? mobility : (contract=="uclh" ? "10 Car Suitable" : "null");
			case "Bariatric Stretcher":
				return contract=="k&m" ? mobility : (contract=="uclh" ? "BS Bariatric Amb Stretcher" : "null");
			case "EMT":
				return contract=="k&m" ? mobility : (contract=="uclh" ? "TC HDU Amb Chair" : "null");
			case "Seated 1 Man":
				return contract=="k&m" ? mobility : (contract=="uclh" ? "11 Ambulance walker" : "null");
			case "Seated 2 Man":
				return contract=="k&m" ? mobility : (contract=="uclh" ? "12 Amb 2 Crew for lifting" : "null");
			case "Stretcher":
				return contract=="k&m" ? mobility : (contract=="uclh" ? "32 Ambulance Stretcher" : "null");
			case "Wheelchair 1 Man":
				return contract=="k&m" ? mobility : (contract=="uclh" ? "41 Amb 1 C travel own chair" : "null");
			case "Wheelchair 2 Man":
				return contract=="k&m" ? mobility : (contract=="uclh" ? "42 Amb 2 C travel own chair" : "null");
		}
	}
	
	
	function updateKg(){
		var stToLbs = document.getElementById("convertSt").value * 14 * 0.453592;
		document.getElementById("convertKg").value = Math.round((document.getElementById("convertLb").value * 0.453592) + stToLbs);
	}
	function updateLb(){
		var totalLbs = Math.round(document.getElementById("convertKg").value / 0.453592);
		var lbs = totalLbs % 14;
		var st = Math.round((totalLbs / 14)-0.5);
		
		document.getElementById("convertSt").value = st;
		document.getElementById("convertLb").value = lbs;
	}
	
	var confirmWeightSender;
	function confirmWeight(sender){
		if(sender != "confirm")
		{
			confirmWeightSender = sender;
			showWeightConfirmBox();
		}
		else
		{
			hideWeightConfirmBox();
			highlightQuestion(sender);
		}
	}