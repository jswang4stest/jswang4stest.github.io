var i;
var activeAssessment = "";

function ChangeTab(assessment)
{
		window.alert("debug1");
	if(assessment != activeAssessment)
	{
		window.alert("debug2");
		activeAssessment = assessment;
		if(assessment == "MobilityAssessment")
		{
		window.alert("debug3");
			document.getElementById(assessment + "Frame").contentWindow.setup();
		}
		window.alert("debug4");
		//document.getElementById(assessment + "Frame").contentWindow.restartAssessment();
		ClearActiveTabs();
		window.alert("debug5");
		ClearActiveFrames();
		window.alert("debug6");
		document.getElementById(assessment + "Frame").style.display = "block";
		document.getElementById(assessment + 'Tab').classList.add("tab_selected");
		window.alert("debug7");
	}
}


function ClearActiveTabs()
{
	var tabs = document.getElementsByClassName("tab");
	for(i = 0; i < tabs.length; i++)
	{
		tabs[i].classList.remove("tab_selected");
	}
}

function ClearActiveFrames()
{
	var frames = document.getElementsByClassName("frame");
	for(i = 0; i < frames.length; i++)
	{
		frames[i].style.display = "none";
	}
}