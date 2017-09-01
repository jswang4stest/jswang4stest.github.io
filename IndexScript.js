var i;
var activeAssessment = "";

function ChangeTab(assessment)
{
	if(assessment != activeAssessment)
	{
		activeAssessment = assessment;
		document.getElementById(assessment + "Frame").contentWindow.restartAssessment();
		ClearActiveTabs();
		ClearActiveFrames();
		document.getElementById(assessment + "Frame").style.display = "block";
		document.getElementById(assessment + 'Tab').classList.add("tab_selected");
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