	
	//Equipment
	//	O2
	//	WheelchairToFrom
	//	BariatricWheelchair
	
	//Requirements
	//	Bariatric
	//	CarryChair
	//	BringWheelchair
	
	var maxWheelchairWeight= 158; //kg
	var maxCarryWeight= 158; //kg, 25st
	var min3ManWeight = 89; //kg, 14st
	var min4ManWeight = 114; //kg, 18st
	var bariatricWeight = 114; //kg, 18st
	
	var iterator = 0;
	
	var useCookies = false;
	
	var previousAnswers = null;
	var allValues = "";
	var cookieDuration = 60; //minutes
	
	var o2 = false;
	var selfAdministers = false;
	
	var wheelchairToFrom = false;
	var bariatricWheelchair = false;
	
	var bariatric = false;
	var carryChair = false;
	var bringWheelchair = false;
	var electricWheelchair = false;
	
	var steps = false;
	
	var q3StoreNextQuestion = '';
	
	var howMuchOxygen = 0;
	var weight = -1;	var usesWheelchair = false;	var stretcher = false;
	
	var threeManLift = false;
	var fourManLift = false;	
	var wheelchairVehicle = false;
	
	var weightAsked = false;
	
	var contract;
	
	
	function setup() {
		hideEverything();
		checkCookies();
		
		if(useCookies) {
			document.getElementById("contractSelect").selectedIndex = getCookie("contract");
		}
		else {
			//fallback default
			document.getElementById("contractSelect").selectedIndex = 0;
			contract = "k&m";
		}
		
		changeContract();
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

			case 'q1a': // self administers?
				
				if(document.getElementById('q1aDropdown').value == "Yes"){
					selfAdministers = true;
					showQuestion('q2');
				}
				else if(document.getElementById('q1aDropdown').value == "No"){
					selfAdministers = false;
					showSubQuestion('q1b');
					howMuchOxygen = 0;
				}
				
				break;

			case 'q1b': // more than 4 litres?
				
				if(document.getElementById('q1bDropdown').value == "Yes"){
					showSubQuestion('q1c');
				}
				else if(document.getElementById('q1bDropdown').value == "No"){
					showQuestion('q2');
					howMuchOxygen = 0;
				}
				
				break;

			case 'q1c':
				
				howMuchOxygen = document.getElementById('q1cInputBox').value;
				if(howMuchOxygen < contractOxygenMinimum())
				{
					showOxygenConfirmBox();
					break;
				}
				
				suggestMobility('EMT');
				break;

			
			
			case 'q2':
				
				if(document.getElementById('q2Dropdown').value == "Yes"){
					suggestMobility('Walker car');
				}
				else if(document.getElementById('q2Dropdown').value == "No"){
					showQuestion('q3');
				}
				
				break;

				
				
			case 'q3': //Will the patient need to be in a wheelchair to and from the vehicle?
				
				if(document.getElementById('q3Dropdown').value == "Yes"){
					showSubQuestion('q3a');
					usesWheelchair = true;
				}
				else if(document.getElementById('q3Dropdown').value == "No"){
					usesWheelchair = false;
					//Must be at least 2 man if the patient needs oxygen
					// but if the patient self administers they can still go in a walker car or 1 man ambulance
					if(o2 && !selfAdministers)
					{
						showQuestion('q5');
					}
					else
					{
						showQuestion('q4');
					}
				}
				
				break;

			case 'q3a': //Would the patient be able to transfer out of their wheelchair?
				
				if(document.getElementById('q3aDropdown').value == "Yes"){
					showSubQuestion('q3b');
				}
				else if(document.getElementById('q3aDropdown').value == "No"){
					wheelchairVehicle = true;
					//If the patient can't transfer out of their wheelchair, they must have their own
					//But we still have to know if it's manual or electric
					showSubQuestion('q3c');
				}
				
				break;

			case 'q3b': //Will the patient provide their own wheelchair?
				
				if(document.getElementById('q3bDropdown').value == "Yes"){
					updateEquipment('wheelchairToFrom', false);
					wheelchairVehicle = true;
					if(wheelchairVehicle)
					{
						showSubQuestion('q3c');
					}
					else
					{
						if(o2 && !selfAdministers)
						{
							q3StoreNextQuestion = 'q5';
							showSubQuestion('q3d');
						}
						else
						{
							q3StoreNextQuestion = 'q4';
							showSubQuestion('q3d');
						}
					}
				}
				else if(document.getElementById('q3bDropdown').value == "No"){
					updateEquipment('wheelchairToFrom', true);
					if(o2 && !selfAdministers)
					{
						q3StoreNextQuestion = 'q5';
						showSubQuestion('q3d');
					}
					else
					{
						q3StoreNextQuestion = 'q4';
						showSubQuestion('q3d');
					}
				}
				
				break;

			case 'q3c': //Is the patient's wheelchair manual or electric?
				
				updateEquipment('electricWheelchair', false);
				if(document.getElementById('q3cDropdown').value == "Electric"){
					showWheelchairCheckBox();
				}
				//Wheelchair vehicle may have been set to true by 2a
				if(wheelchairVehicle)
				{
					if(o2 && !selfAdministers)
					{
						q3StoreNextQuestion = 'q5';
						showSubQuestion('q3d');
					}
					else
					{
						//If it has to be a wheelchair vehicle it can't be a Walker car
						q3StoreNextQuestion = 'q4';
						showSubQuestion('q3d');
					}
				}
				else
				{
					q3StoreNextQuestion = 'q4';
					showSubQuestion('q3d');
				}
				
				break;
			
			case 'q3d':
				
				if(document.getElementById('q3dDropdown').value == "Yes"){
					updateRequirements('bariatric', true);
					showSubQuestion('q3e');
				}
				else if(document.getElementById('q3dDropdown').value == "No"){
					showQuestion(q3StoreNextQuestion);
					updateRequirements('bariatric', false);
				}
				
				weightAsked = true;
				break;

			case 'q3e':
				
				weight = document.getElementById('q3eInputBox').value;
				if(weight < bariatricWeight)
				{
					showWeightConfirmBox('q3e');
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
					showQuestion(q3StoreNextQuestion);
				}
				else
				{
					updateRequirements('bariatric', false);
					showQuestion(q3StoreNextQuestion);
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
				
				updateRequirements('3ManLift', false);
				updateRequirements('4ManLift', false);
				updateRequirements('carryChair', false);
				
				if(document.getElementById('q5Dropdown').value == "Yes"){
					
					if(usesWheelchair)
					{
						updateRequirements('carryChair', true);
						if(weight == -1)
						{
							showSubQuestion('q5b');
						}
						else
						{
							if(weight >= min3ManWeight && weight < min4ManWeight)
							{
								updateRequirements('3ManLift', true);
							}
							else if(weight >= min4ManWeight)
							{
								updateRequirements('4ManLift', true);
							}
							if(weight >= bariatricWeight)
							{
								updateRequirements('bariatric', true);
								updateRequirements('carryChair', true);
							}
							if(wheelchairVehicle)
							{
								suggestMobility('Wheelchair 2 Man');
							}
							else
							{						
								suggestMobility('Seated 2 Man');
							}
						}
					}
					else
					{
						showSubQuestion('q5a');
					}
					steps = true;
				}
				else if(document.getElementById('q5Dropdown').value == "No"){
					if(usesWheelchair)
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
				
			case 'q5a': // Will the patient need to be carried down the stairs/steps?
				
				updateRequirements('3ManLift', false);
				updateRequirements('4ManLift', false);
				updateRequirements('carryChair', false);
				
				if(document.getElementById('q5aDropdown').value == "Yes"){
					updateRequirements('carryChair', true);
					if(weight == -1)
					{
						showSubQuestion('q5b');
					}
					else
					{
						if(weight > maxCarryWeight){
							showReferToControlBox("The patient's weight exceeds the maximum carry weight");
							break;
						}
						if(weight >= min3ManWeight && weight < min4ManWeight)
						{
							updateRequirements('3ManLift', true);
						}
						else if(weight >= min4ManWeight)
						{
							updateRequirements('4ManLift', true);
						}
						if(weight >= bariatricWeight)
						{
							updateRequirements('bariatric', true);
						}
						if(usesWheelchair)
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
				else if(document.getElementById('q5aDropdown').value == "No"){
					if(wheelchairVehicle)
					{
						suggestMobility('Wheelchair 2 Man');
					}
					else
					{						
						suggestMobility('Seated 2 Man');
					}
				}
				break;

			case 'q5b': // What is the patient's weight (in kg)?
				weightAsked = true;
				weight = document.getElementById('q5bInputBox').value;
				
				updateRequirements('3ManLift', false);
				updateRequirements('4ManLift', false);
				
				if(weight > maxCarryWeight){
					showReferToControlBox("The patient's weight exceeds the maximum carry weight");
					break;
				}
				if(weight >= min3ManWeight && weight < min4ManWeight)
				{
					updateRequirements('3ManLift', true);
				}
				else if(weight >= min4ManWeight)
				{
					updateRequirements('4ManLift', true);
				}
				if(weight >= bariatricWeight)
				{
					updateRequirements('bariatric', true);
				}
				if(usesWheelchair)
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
			additionalDetails = additionalDetails.concat("<p>" + (selfAdministers ? "Self administers O2":"Requires O2" + ((howMuchOxygen == 0) ? " (less than 4 litres)" : " (" + howMuchOxygen + " litres)") + "</p>"));
			equipment = equipment.concat(selfAdministers?"<p>Oxygen Self Admin</p>":"<p>Oxygen req'd</p>");
		}
		if(wheelchairToFrom && !stretcher){
			additionalDetails = additionalDetails.concat("<p>" + (bariatric ? "Bariatric " : "") + "Wheelchair required to and from vehicle</p>");
			equipment = equipment.concat("<p>Wheel Chair to/from</p>");
		}
		if(electricWheelchair){
			equipment = equipment.concat("Electric Wheelchair");
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
			//requirements = requirements.concat("<p>Needs " + (bariatric ? "Bariatric " : "") + "Wheelchair on arrival</p>");			
		}
		if(weight > -1){
			additionalDetails = additionalDetails.concat("<p>Weight: " + weight + "kg</p>");
		}
		if(steps) {
			additionalDetails = additionalDetails.concat("<p>Steps on property (if possible, add how many steps there are)</p>");
		}
		if(threeManLift){
			requirements = requirements.concat("<p>3 Crew Lift</p>");
			additionalDetails = additionalDetails.concat("<p>Requires a 3 Man lift</p>");
		}
		if(fourManLift){
			requirements = requirements.concat("<p>4 Crew lift</p>");
			additionalDetails = additionalDetails.concat("<p>Requires a 4 Man Lift</p>");
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
	
	
	function showQuestion(question) {
		document.getElementById(question).style.display = 'inline-block';
		highlightQuestion(question);
	}
	
	function showSubQuestion(question) {
		document.getElementById(question).style.visibility = 'visible';
		highlightQuestion(question);
	}
	
	function highlightQuestion(question) {
		document.getElementById(question).className += " highlightQuestion";
		setTimeout(function(){
			document.getElementById(question).classList.remove("highlightQuestion");
		}, 500);
	}
	
	
	function changeContract() {
		contract = document.getElementById("contractSelect").value;
		
		if(useCookies)
		{
			document.cookie = "contract=" + document.getElementById("contractSelect").selectedIndex + "; expires=Tue, 19 Jan 2038 04:14:07 UTC" + "; path=/";
		}
		
		document.getElementById("contractOxygenMinimum").innerHTML = contractOxygenMinimum();
		document.getElementById("q1cInputBox").setAttribute('min', contractOxygenMinimum());
		document.getElementById("q1cInputBox").setAttribute('value', contractOxygenMinimum());
	}
	
	function contractOxygenMinimum() {
		switch(contract)
		{
			case "k&m": return 4;
			case "uclh": return 6;
		}
	}
	
	function contractIndexToText(index) {
		switch(index)
		{
			case 0: return "k&m";
			case 1: return "uclh";
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
			default: return "unknown mobility";
		}
	}
	
	
	function hideEverything() {
		
		hideSuggestionBox();
		hideReferToControlBox();
		hideWheelchairCheckBox();
		hideWeightConfirmBox();
		hideWeightContradictionBox();
		hideOxygenConfirmBox();
		hideActiveXPrompt();
		
		document.getElementById('q1a').style.visibility = 'hidden';
		document.getElementById('q1b').style.visibility = 'hidden';
		document.getElementById('q1c').style.visibility = 'hidden';
		document.getElementById('q3').style.display = 'none';
		document.getElementById('q3a').style.visibility = 'hidden';
		document.getElementById('q3b').style.visibility = 'hidden';
		document.getElementById('q3c').style.visibility = 'hidden';
		document.getElementById('q3d').style.visibility = 'hidden';
		document.getElementById('q3e').style.visibility = 'hidden';
		document.getElementById('q2').style.display = 'none';
		document.getElementById('q4').style.display = 'none';
		document.getElementById('q5').style.display = 'none';
		document.getElementById('q5a').style.visibility = 'hidden';
		document.getElementById('q5b').style.visibility = 'hidden';
		document.getElementById('q6').style.display = 'none';
		document.getElementById('q6a').style.visibility = 'hidden';
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
	
	function showOxygenConfirmBox() {
		document.getElementById('modalOverlay').style.visibility = 'visible';
		document.getElementById('oxygenConfirmBox').style.visibility = 'visible';
	}
	function hideOxygenConfirmBox() {
		document.getElementById('modalOverlay').style.visibility = 'hidden';
		document.getElementById('oxygenConfirmBox').style.visibility = 'hidden';
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
			case 'electricWheelchair':
					if(setActive)
					{
						document.getElementById("infoElectricWheelchair").style.backgroundColor = "#44FFFF";
						electricWheelchair = true;
					}
					else
					{
						document.getElementById("infoElectricWheelchair").style.backgroundColor = "#DDDDDD";
						electricWheelchair = false;
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
			case '3ManLift':
					if(setActive)
					{
						document.getElementById("info3ManLift").style.backgroundColor = "#44FFFF";
						threeManLift = true;
					}
					else
					{
						document.getElementById("info3ManLift").style.backgroundColor = "#DDDDDD";
						threeManLift = false;
					}
				break;
			case '4ManLift':
					if(setActive)
					{
						document.getElementById("info4ManLift").style.backgroundColor = "#44FFFF";
						fourManLift = true;
					}
					else
					{
						document.getElementById("info4ManLift").style.backgroundColor = "#DDDDDD";
						fourManLift = false;
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
			previousAnswers.push(q3StoreNextQuestion);	//7
			previousAnswers.push(howMuchOxygen);		//8
			previousAnswers.push(selfAdministers);		//9
			previousAnswers.push(weight);				//10
			previousAnswers.push(weightAsked);			//11
			previousAnswers.push(usesWheelchair);		//12
			previousAnswers.push(stretcher);			//13
			previousAnswers.push(wheelchairVehicle);	//14			
			previousAnswers.push(electricWheelchair);	//15
			
			previousAnswers.push("placeholder");		//16
			previousAnswers.push("placeholder");		//17
			previousAnswers.push("placeholder");		//18
			previousAnswers.push("placeholder");		//19
			
			
			updateEquipment("o2", false);
			updateEquipment("wheelchairToFrom", false);
			updateEquipment("bariatricWheelchair", false);
			updateEquipment("electricWheelchair", false);
			
			updateRequirements("bariatric", false);
			updateRequirements("carryChair", false);
			//updateRequirements("bringWheelchair", false);
		
			steps = false;
		
			q3StoreNextQuestion = '';
		
			howMuchOxygen = 0;
			weight = -1;
			usesWheelchair = false;
			stretcher = false;
			weightAsked = false;
			
			wheelchairVehicle = false;
			
			
			
			previousAnswers.push(document.getElementById('q1Dropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q1aDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q1bDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q1cInputBox').value);
			previousAnswers.push(document.getElementById('q3Dropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q3aDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q3bDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q3cDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q3dDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q3eInputBox').value);		
			previousAnswers.push(document.getElementById('q2Dropdown').selectedIndex);		
			previousAnswers.push(document.getElementById('q4Dropdown').selectedIndex);		
			previousAnswers.push(document.getElementById('q5Dropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q5aDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q5bDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q5bDropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q5dInputBox').value);		
			previousAnswers.push(document.getElementById('q6Dropdown').selectedIndex);
			previousAnswers.push(document.getElementById('q6aInputBox').value);
			
			
			previousAnswers.push(document.getElementById('q1a').style.visibility);
			previousAnswers.push(document.getElementById('q1b').style.visibility);
			previousAnswers.push(document.getElementById('q1c').style.visibility);
			previousAnswers.push(document.getElementById('q3').style.display);
			previousAnswers.push(document.getElementById('q3a').style.visibility);
			previousAnswers.push(document.getElementById('q3b').style.visibility);
			previousAnswers.push(document.getElementById('q3c').style.visibility);
			previousAnswers.push(document.getElementById('q3d').style.visibility);
			previousAnswers.push(document.getElementById('q3e').style.visibility);
			previousAnswers.push(document.getElementById('q2').style.display);
			previousAnswers.push(document.getElementById('q4').style.display);
			previousAnswers.push(document.getElementById('q5').style.display);
			previousAnswers.push(document.getElementById('q5a').style.visibility);
			previousAnswers.push(document.getElementById('q5b').style.visibility);
			previousAnswers.push(document.getElementById('q5b').style.visibility);
			previousAnswers.push(document.getElementById('q6').style.display);
			previousAnswers.push(document.getElementById('q6a').style.visibility);
			
			document.getElementById('q1Dropdown').selectedIndex = 0;
			document.getElementById('q1aDropdown').selectedIndex = 0;
			document.getElementById('q1bDropdown').selectedIndex = 0;
			document.getElementById('q1cInputBox').value = contractOxygenMinimum();
			document.getElementById('q3Dropdown').selectedIndex = 0;
			document.getElementById('q3aDropdown').selectedIndex = 0;
			document.getElementById('q3bDropdown').selectedIndex = 0;
			document.getElementById('q3cDropdown').selectedIndex = 0;
			document.getElementById('q3dDropdown').selectedIndex = 0;
			document.getElementById('q3eInputBox').value = bariatricWeight;
			document.getElementById('q2Dropdown').selectedIndex = 0;
			document.getElementById('q4Dropdown').selectedIndex = 0;
			document.getElementById('q5Dropdown').selectedIndex = 0;
			document.getElementById('q5aDropdown').selectedIndex = 0;
			document.getElementById('q5bDropdown').selectedIndex = 0;
			document.getElementById('q5bDropdown').selectedIndex = 0;
			document.getElementById('q5dInputBox').value = bariatricWeight;
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
			
			setup();
		}
	}
	
	function restoreAssessment() {
		if(document.getElementById('q1Dropdown').selectedIndex == 0) {
			
			var theCookie = getCookie("allValues");
			
			previousAnswers = theCookie.split('|');
			
			updateEquipment("o2", 					previousAnswers[0] == "true");
			updateEquipment("wheelchairToFrom", 	previousAnswers[1] == "true");
			updateEquipment("bariatricWheelchair", 	previousAnswers[2] == "true");
			updateEquipment("electricWheelchair",	previousAnswers[15] == "true");
			updateRequirements("bariatric", 		previousAnswers[3] == "true");
			updateRequirements("carryChair", 		previousAnswers[4] == "true");
			
			steps = 								previousAnswers[6] == "true";
			q3StoreNextQuestion = 					previousAnswers[7];
			howMuchOxygen = 						previousAnswers[8];
			selfAdministers = 						previousAnswers[9];
			weight = 								previousAnswers[10];
			weightAsked = 							previousAnswers[11] == "true";
			usesWheelchair = 						previousAnswers[12] == "true";
			stretcher = 							previousAnswers[13] == "true";
			wheelchairVehicle = 					previousAnswers[14] == "true";
			
			
			document.getElementById('q1Dropdown').selectedIndex = 	previousAnswers[20];
			document.getElementById('q1aDropdown').selectedIndex = 	previousAnswers[21];
			document.getElementById('q1bDropdown').selectedIndex = 	previousAnswers[22];
			document.getElementById('q1cInputBox').value = 			previousAnswers[23];
			document.getElementById('q3Dropdown').selectedIndex = 	previousAnswers[24];
			document.getElementById('q3aDropdown').selectedIndex = 	previousAnswers[25];
			document.getElementById('q3bDropdown').selectedIndex = 	previousAnswers[26];
			document.getElementById('q3cDropdown').selectedIndex = 	previousAnswers[27];
			document.getElementById('q3dDropdown').selectedIndex = 	previousAnswers[28];
			document.getElementById('q3eInputBox').value = 			previousAnswers[29];			
			document.getElementById('q2Dropdown').selectedIndex = 	previousAnswers[30];			
			document.getElementById('q4Dropdown').selectedIndex = 	previousAnswers[31];			
			document.getElementById('q5Dropdown').selectedIndex = 	previousAnswers[32];
			document.getElementById('q5aDropdown').selectedIndex = 	previousAnswers[33];
			document.getElementById('q5bDropdown').selectedIndex = 	previousAnswers[34];
			document.getElementById('q5bDropdown').selectedIndex = 	previousAnswers[35];
			document.getElementById('q5dInputBox').value = 			previousAnswers[36];			
			document.getElementById('q6Dropdown').selectedIndex = 	previousAnswers[37];
			document.getElementById('q6aInputBox').value = 			previousAnswers[38];
			
			
			document.getElementById('q1a').style.visibility = 		previousAnswers[39];
			document.getElementById('q1b').style.visibility = 		previousAnswers[40];
			document.getElementById('q1c').style.visibility = 		previousAnswers[41];
			document.getElementById('q3').style.display = 			previousAnswers[42];
			document.getElementById('q3a').style.visibility = 		previousAnswers[43];
			document.getElementById('q3b').style.visibility = 		previousAnswers[44];
			document.getElementById('q3c').style.visibility = 		previousAnswers[45];
			document.getElementById('q3d').style.visibility = 		previousAnswers[46];
			document.getElementById('q3e').style.visibility = 		previousAnswers[47];
			document.getElementById('q2').style.display = 			previousAnswers[48];
			document.getElementById('q4').style.display = 			previousAnswers[49];
			document.getElementById('q5').style.display = 			previousAnswers[50];
			document.getElementById('q5a').style.visibility = 		previousAnswers[51];
			document.getElementById('q5b').style.visibility = 		previousAnswers[52];
			document.getElementById('q5b').style.visibility = 		previousAnswers[53];
			document.getElementById('q6').style.display = 			previousAnswers[54];
			document.getElementById('q6a').style.visibility = 		previousAnswers[55];			
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