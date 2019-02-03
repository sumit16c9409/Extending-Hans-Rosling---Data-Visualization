//Initializing Global Variables
	activeYear = 2007;
	indexForYear = 0;
	activeCountry = "All";
	activeCountryForPillar1 = "None";
	activeCountryForPillar2 = "None";
	comparisonCountry = "None";
	intervalHandle =null;
	animationTransitionDuration = 700;
	var colorscheme=[];
	var scatterTicks = {x:[200,300,500, 1000, 2000, 5000, 10000, 20000, 50000],
							y:[0,1,2,3,4,5,6,7]};
	var countryTrace = {}
/** Defining Margins for SVG**/

	var margin = {top: 20, right: 4, bottom: 60, left: 60};
	var margin_bars = {top: 20, right: 4, bottom: 60, left: 175};
	colorscheme = d3.schemeCategory10; // Color Codes for regions

	outerWidth = 800;
	outerHeight = 500;
	class_name = "scatter";
	var svgWidth =outerWidth-margin.left-margin.right ;
	var svgHeight = outerHeight-margin.top-margin.bottom;
	var canvas = d3.select("#scatter-plot")
			.append("svg")
			.attr("width", svgWidth + margin.left + margin.right)
			.attr("height", svgHeight + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "	," + margin.top + ")");
//Defining Margins for Bar Graph(Multivariate Abalysis)
			var svg = d3.select("#pillar-bar-graph svg"),
			    margin_bar = {top: 20, right: 20, bottom: 30, left: 200},
			    width = +svg.attr("width") - margin_bar.left - margin_bar.right,
			    height = +svg.attr("height") - margin_bar.top - margin_bar.bottom;

			var tooltip = d3.select("body").append("div").attr("class", "toolTip");

			var xBarAxis = d3.scaleLinear().range([0, width]);
			var yBarAxis = d3.scaleBand().range([height, 0]);

			var barGroup = svg.append("g")
					.attr("transform", "translate(250," + margin_bar.top + ")");

					barGroup.append("g")
							.attr("class", "x axis")
							.attr("transform", "translate(0," + height + ")")
							.call(d3.axisBottom(xBarAxis)
							.ticks(5).tickFormat(function(d) { return d ; }).tickSizeInner([-height]));


//Scales for Graphs

	//1. Scatter Plot
	var xScale = d3.scaleLog().domain([80, 200000]).range([0, svgWidth]);
	var yScale =d3.scaleLinear().domain([0, 7]).range([svgHeight, 0]);

	//Text and Radius Scale for Population
	var radiusScale = d3.scaleSqrt().domain([0, 5e8]).range([2, 20]);
	var textScale = d3.scaleSqrt().domain([0, 5e8]).range([3, 20]);
	var colorScale = d3.scaleOrdinal(colorscheme);

//******* Create  X & Y axes


	x_label_xoffset=svgWidth/4;
	x_label_yoffset = 35;
	y_label_xoffset = -180;
	y_label_yoffset = -125;
	title_yoffset = -30;
	title_font = "13px";
	otherClassLabels = "bar-labels"

		var xAxis =d3.axisBottom(xScale)
								.tickValues(scatterTicks.x)
								.tickFormat(function (d) {return ""+d;}).tickSize(4);
		var yAxis =d3.axisLeft(yScale)
							.tickValues(scatterTicks.y)
							.tickSize(4);

		//Ticks for X-axis and calling it
		canvas.append("g")
			.attr("class", "axis scatter-plot")
			.attr("transform", "translate(0," + svgHeight + ")")
			.call(xAxis);

		x_label_xoffset = 90;
		x_label_yoffset = 52;
		y_label_xoffset = -340;
		y_label_yoffset = -45;
		title_yoffset = 0;
		title_font = "20px";
		otherClassLabels="";

		// Append Y axes and call it
		canvas.append("g")
			.attr("class", "axis")
			.attr("id", "y-axis")
			.call(yAxis);

	// X-axis Labels
	canvas.append("text")
		.attr("class", "x label "+otherClassLabels)
		.attr("text-anchor", "start")
		.attr("x",x_label_xoffset)
		.attr("y", svgHeight + x_label_yoffset)
		.html("GDP/capita, Inflation adjusted, log scale  &nbsp;&rarr;")

//	Y-axis Labels
	canvas.append("text")
		.attr("class", "y label "+otherClassLabels)
		.attr("y", y_label_yoffset)
		.attr("x", y_label_xoffset)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.html("Global_Competitiveness_Index &nbsp;&rarr;");

	// //Scatter Plot  Title
	canvas.append("text")
		.attr("class", "title")
		.attr("text-anchor", "start ")
		.attr("y", margin.top + title_yoffset)
		.attr("x", margin.left-50)
		.style("font-size",title_font)
		.style("opacity", 1)
		.html("GapMinder World  <tspan class='yearlabel'>"+activeYear+"</tspan>");


	//gridlines
	var xGrid = d3.axisBottom(d3.scaleLinear().range([0, svgWidth]))
	  .ticks(5)
	  .tickSize(-svgHeight)
	  .tickFormat("")

		var yGrid =d3.axisLeft(d3.scaleLinear().range([svgHeight,0]))
	  .ticks(5)
	  .tickSize(-svgWidth)
	  .tickFormat("")

	//Appending X gridlines
	canvas.append("g")
	  .attr("class", "gridline")
	  .attr("transform", "translate(0," + svgHeight + ")")
	  .call(xGrid)

	//Appending Y gridlines
	canvas.append("g")
	  .attr("class", "gridline")
	  .call(yGrid)

	//Scatter Plot
	canvas.append("text")
		.attr("class", "sub-title")
		.attr("text-anchor", "start")
		.attr("y", margin.top+20)
		.attr("x", margin.left-50)
		.text("Mapping the health and Wealth of Nations")
		.style("opacity", 1);

	//Scatter Plot Year Label
	canvas.append("text")
		.attr("class", "yearlabel backgroundlabel")
		.attr("text-anchor", "middle")
		.attr("y", 3*svgHeight/4)
		.attr("x", svgWidth/2)
		.text(activeYear);

	//Scatter Plot Population Legend
	l_population = canvas.append("g");

	l_population.append("text")
		.attr("text-anchor", "start")
		.attr("y", yScale(1.0))
		.attr("x", xScale(55000))
		.text("Size by Population")
		.style("font-weight", "700")
		.style("opacity", 1);

	//Scatter Plot-Population Legends
	l_population.append("circle")
		.attr("class", "legend-circle")
		.attr("cy", yScale(0.5))
		.attr("cx", xScale(54000))
		.attr("r", radiusScale(100))
		.style("opacity", 1)
		.style( "stroke", "#000")
		.attr("fill","white");

	l_population.append("text")
		.attr("class", "sub-title")
		.attr("text-anchor", "start")
		.attr("y", yScale(0.2))
		.attr("x", xScale(50000))
		.html("10");



	l_population.append("circle")
		.attr("class", "legend-circle")
		.attr("cy", yScale(0.5))
		.attr("cx", xScale(80000))
		.attr("r", radiusScale(1e7))
		.style("opacity", 1)
		.style( "stroke", "#000")
		.attr("fill","white");

	l_population.append("text")
		.attr("class", "sub-title")
		.attr("text-anchor", "start")
		.attr("y", yScale(0.2))
		.attr("x", xScale(65000))
		.html("100 million");


	l_population.append("circle")
		.attr("class", "legend-circle")
		.attr("cy", yScale(0.5))
		.attr("cx", xScale(140000))
		.attr("r", radiusScale(1e9))
		.style("opacity", 1)
		.style( "stroke", "#000")
		.attr("fill","white");

	l_population.append("text")
		.attr("class", "sub-title")
		.attr("text-anchor", "start")
		.attr("y", yScale(0.4))
		.attr("x", xScale(122500))
		.html("1000");

	l_population.append("text")
		.attr("class", "sub-title")
		.attr("text-anchor", "start")
		.attr("y", yScale(0.2))
		.attr("x", xScale(115000))
		.html("million");


/******* Creating Tool tip*******/
var tooltipDiv = d3.select("body").append("div").attr("class", "tt").style("opacity", 0);


d3.select("#playPath")
	.on("mouseover", function(d){showAndHideToolTip(200,1,"Play")})
	.on("mouseout", function(d){showAndHideToolTip(500,0,"")});
d3.select("#pausePath")
	.on("mouseover", function(d){showAndHideToolTip(200,1,"Pause")})
	.on("mouseout", function(d){showAndHideToolTip(500,0,"")});

d3.select("#stopPath")
	.on("mouseover", function(d){showAndHideToolTip(200,1,"Stop")})
	.on("mouseout", function(d){showAndHideToolTip(500,0,"")});

d3.select("#reset")
	.on("mouseover", function(d){showAndHideToolTip(200,1,"Reset")})
	.on("mouseout", function(d){showAndHideToolTip(500,0,"")});



//Click for Play Button handled
d3.select("#animate").on("click", function(){
	console.log(indexForYear);
	if(indexForYear == yearArray.length-1)
	{
		indexForYear = 0;
		activeYear = yearArray[indexForYear];
		generateVisualization();
	}
	play();
});

//Event Handler for Click on Pause Button
d3.select("#unanimate").on("click", function(){pause();});

//Event Handler for Changing country
d3.selectAll('#countrylist').on('change', showHideCountry);
d3.selectAll('#countrylist-bar').on('change', manageBarTransitions);
d3.selectAll('#countrylist-bar2').on('change', manageBarTransitions);

function showHideCountry()
{
	activeCountry = d3.select("#countrylist").property('value');
	pause();
	if(activeCountry != "All")
	{
		//comparisonCountry = d3.select("#countrylist-2").property('value');
		d3.select("#countrylist-bar").attr('disabled', null).style("opacity","1");
		d3.select("#countrylist-bar").style("opacity","1");
		disableButtons();
		generateVisualization();
	}
	else{

		enableButtons();
		showHideCountries(animationTransitionDuration,0.9)
		canvas.selectAll(".countryView1").remove();
			generateVisualization();

	}
}

function manageBarTransitions(){
	activeCountryForPillar1 = d3.select("#countrylist-bar").property('value');
	activeCountryForPillar2 = d3.select("#countrylist-bar2").property('value');
	generateVisualization();
}

//Function to see data for a particular year
function jumpToIndex(i)
{
	pause();
	activeYear = yearArray[i];
	indexForYear = i;
	generateVisualization();
}

//Animation
function play()
{
	d3.select("#animate").style("opacity", 0.3);
	d3.select("#unanimate").style("opacity", 1);
	intervalHandle = setInterval(function() {
						indexForYear = parseInt(indexForYear) + 1;
						activeYear = yearArray[indexForYear];
						if(indexForYear >= yearArray.length){
							indexForYear = yearArray.length - 1;
							activeYear = yearArray[indexForYear];
							pause();
						}
						else{
							generateVisualization();
						}
					}, animationTransitionDuration-5);
}
function stop()
{
	pause();
	indexForYear = 0
	activeYear = yearArray[indexForYear];
	generateVisualization();
}
function resetCountry()
{
	d3.select("#countrylist").property("value","All");
	showHideCountry();
}
//Function to pause Animation
function pause()
{
	if(intervalHandle!=null)
		clearInterval(intervalHandle);

	d3.select("#animate").style("opacity", 1);
	d3.select("#unanimate").style("opacity", 0.3);
}

//Function to enable buttons and disable them
function enableButtons() {
    d3.selectAll('button').attr('disabled', null).classed("disable",false).classed("enable",true);
	d3.selectAll('button#reset').attr('disabled', true).classed("disable",true).classed("enable",false);
	d3.selectAll('#yearSlider').attr('disabled', null).classed("disable",false).classed("enable",true);
};

//Function to disable buttons for a single country selection
function disableButtons() {
    d3.selectAll('button').attr('disabled', true).classed("disable",true).classed("enable",false);
	d3.selectAll('button#reset').attr('disabled', null).classed("disable",false).classed("enable",true);
	d3.selectAll('#yearSlider').attr('disabled', true).classed("disable",true).classed("enable",false);

};



function showHideCountries(d, o)
{
	d3.selectAll(".dot,.countrylabel")
		.transition()
		.duration(d)
		.ease(d3.easeCircle)
		.style("opacity", o);
}

//Function to show/hide tool tip div

function showAndHideToolTip(t,o,d)
{
	tooltipDiv.transition()
		.duration(t)
		.ease(d3.easeLinear)
		.style("opacity", o);
	var left = "0px";
	var top = "0px"
	if(o!=0)
	{
			left = (d3.event.pageX+18) + "px";
			top = (d3.event.pageY-28) + "px";
	}
	tooltipDiv.html(d)
			.style("left", left)
			.style("top", top);
}


//Step 3: Loading data, countries Drop down,generatig visualizations
	// Load the file data.csv and generate a visualisation based on it
d3.queue().defer(d3.csv, './resources/data/GCI_CompleteData4.csv').await(function(error,data) {
	// handle any data loading errors
	if(error){
		console.log("Something went wrong");
		console.log(error);
	}else{
		console.log("Data Loaded");
		enableButtons();

		//Set Country Dropdown
		d3.selectAll(".c-list").selectAll("option")
			.data(d3.map(data, function(d){return d.Country;}).keys())
			.enter()
			.append("option")
			.text(function(d){return d;})
			.attr("value",function(d){return d;});

		//Set Year buttons (stored years in global variable)
		yearArray = d3.map(data, function(d){return d.Year;}).keys().sort();

		//Year Dropdown
		d3.select("#yearlist").selectAll("option")
			.data(yearArray)
			.enter()
			.append("option")
			.attr("name",function(d,i){return d;})
			.attr("value",function(d,i){return i;})
			.attr("class",function(d){return ("year-option y_"+d);})
			.text(function(d){return d;});

		// Assign data to dataset and globalized it to reduce transfer amongst functions.
		dataset = data;
		// Generate the visualisation
		generateVisualization();
		//events for year transition
		d3.selectAll("#yearlist").on("change", function(){
			console.log(d3.select(this).property("value"));
			jumpToIndex(d3.select(this).property("value"));

		});

		//events for slider transition
		d3.select("#yearSlider").on("click", function(){
			jumpToIndex(d3.select(this).property("value"));
		});

	}
});

//****************************
// Generate Visualizations

function countryFilter(value){
	return value.Country == activeCountry;
};

function countryFilterForPillar1(value){
	return value.Country == activeCountryForPillar1;
};
function countryFilterForPillar2(value){
	return value.Country == activeCountryForPillar2;
};
//Pillar Plot
function generatePillarPlot(){
			if(activeCountryForPillar1 == "None" && activeCountryForPillar2 == "None")
				return;
			var yearSet = dataset.filter(yearFilter)
			var filtered_datset = [];
			filtered_datset.push(yearSet.filter(countryFilterForPillar1)[0]);
			if(activeCountryForPillar2 != "None")
				filtered_datset.push(yearSet.filter(countryFilterForPillar2)[0]);

			console.log(filtered_datset);
			countryCount=filtered_datset.length;

			var pillarData = [];
			for(i=0;i<filtered_datset.length;i++)
			{
				var yearTemp = filtered_datset[i];
				var pd = [];
				for (var k in yearTemp) {
					var temp = {};
					if (yearTemp.hasOwnProperty(k)) {
							if(k.indexOf("pillar")>0){
								temp['name'] = k;
								temp['value'] = yearTemp[k];
								temp['country'] = yearTemp.Country;
								pd.push(temp);
							}
					}
				}
				console.log(pd);
				pillarData.push(pd);
			}
			console.log(pillarData);




			xBarAxis.domain([0, d3.max(pillarData[0], function(d) { return d.value; })]);
			yBarAxis.domain(pillarData[0].map(function(d) { return d.name; })).padding(0.1);

			barGroup.append("g")
					.attr("class", "y axis")
					.call(d3.axisLeft(yBarAxis));

			var bars =barGroup.selectAll("rect.compare1")
							.data(pillarData[0]);

			bars.transition()
					.duration(animationTransitionDuration)
					.ease(d3.easeLinear)
					.attr("class", "bar compare1")
					.attr("x", 0)
					.attr("height", yBarAxis.bandwidth()/countryCount)
					.attr("y", function(d) { return yBarAxis(d.name); })
					.attr("width", function(d) { return xBarAxis(d.value); })

      bars.enter().append("rect")
        .attr("class", "bar compare1")
        .attr("x", 0)
        .attr("height", yBarAxis.bandwidth()/countryCount)
        .attr("y", function(d) { return yBarAxis(d.name); })
        .attr("width", function(d) { return xBarAxis(d.value); })
        .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.name) + "<br>"  + (d.value));
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});

			bars.exit().remove();

			if(pillarData.length==2){
				var bars1 =barGroup.selectAll("rect.compare2")
								.data(pillarData[1]);
				bars1.transition()
						.duration(animationTransitionDuration)
						.ease(d3.easeLinear)
						.attr("class", "bar compare2")
						.attr("x", 0)
						.attr("height", yBarAxis.bandwidth()/countryCount)
						.attr("y", function(d) {
							var y2 = yBarAxis(d.name)-yBarAxis.bandwidth()/countryCount;
							return y2;
						})
						.attr("width", function(d) { return xBarAxis(d.value); })

	      bars1.enter().append("rect")
	        .attr("class", "bar compare2")
	        .attr("x", 0)
	        .attr("height", yBarAxis.bandwidth()/countryCount)
	        .attr("y", function(d) { return yBarAxis(d.name); })
	        .attr("width", function(d) { return xBarAxis(d.value); })
	        .on("mousemove", function(d){
	            tooltip
	              .style("left", d3.event.pageX - 50 + "px")
	              .style("top", d3.event.pageY - 70 + "px")
	              .style("display", "inline-block")
	              .html((d.name) + "<br>"  + (d.value));
	        })
	    		.on("mouseout", function(d){ tooltip.style("display", "none");});


				bars1.exit().remove();

			
			}


}

function generateVisualization()
{
	var filtered_dataset = []
	if(activeCountry == "All")
	{
		//Set Widgets and labels
		d3.selectAll(".yearlabel").text(activeYear)
		d3.select("#yearSlider").property("value", indexForYear);
		d3.select('#yearlist').property('value', indexForYear);
		//Scatter-Plot
		generateScatterPlot();
		generatePillarPlot();
	}
	else
	{
		//Filter dataset according to country name
		filtered_dataset = dataset.filter(function countryFilter(value){
			return (value.Country == activeCountry)
		});
		generateStaticCountryPlot(filtered_dataset,1);			//4. Visualization for Selected Country

	}



	//Private function to generate scatter plot for health and weatlh of nations
	function generateScatterPlot()
	{
		filtered_dataset = dataset.filter(yearFilter);

		//Join new data with old elements, if any
		var countryCircle = canvas
							.selectAll("circle.dot")
							.data(filtered_dataset, function key(d) { return d.Country; });
		var countryText = canvas
							.selectAll("text.countrylabel")
							.data(filtered_dataset, function key(d) { return d.Country; });

		/******** HANDLE UPDATE SELECTION ************/
		// Update the display of existing circles to match new data
		countryCircle
			.transition()
			.duration(animationTransitionDuration)
			.ease(d3.easeLinear)
			.attr("class", function(d){ return ("dot " +d.Country+" "+d.Region); })
			.attr("id", function(d){ return d.Country; })
			.attr("cx", function(d) { return xScale(+d.GDP); })
			.attr("cy", function(d) { return yScale(+d.Global_Competitiveness_Index); })
			.attr("r", function(d) { return radiusScale(+d.Population); })
			.style("fill", function(d) { return colorScale(d.Region); })

		// Update the display of existing country text labels to match new data
		countryText
			.transition()
			.duration(animationTransitionDuration)
			.ease(d3.easeLinear)
			.attr("class", function(d){ return ("countrylabel " +d.Country+" "+d.Region); })
			.attr("text-anchor", "middle")
			.attr("y", function(d) { return (yScale(+d.Global_Competitiveness_Index) + (radiusScale(+d.Population)/2));})
			.attr("x", function(d) { return (xScale(+d.GDP)+ radiusScale(+d.Population)); })
			.text(function(d){ return d.Country; });

		/******** HANDLE ENTER SELECTION ************/
		// Create new circles in the dataset
		countryCircle
			.enter().append("circle")
			.attr("class", function(d){ return ("dot " +d.Country+" "+d.Region); })
			.attr("id", function(d){ return d.Country; })
			.attr("cx", function(d) { return xScale(+d.GDP); })
			.attr("cy", function(d) { return yScale(+d.Global_Competitiveness_Index); })
			.attr("r", function(d) { return radiusScale(+d.Population); })
			.style("fill", function(d) { return colorScale(d.Region); })
			.on("mouseover", mouseOverCountry)
			.on("mouseout", mouseOutCountry);

		// Create new country text labels in the dataset
		countryText
			.enter().append("text")
			.attr("class", "countrylabel")
			.attr("text-anchor", "middle")
			.attr("y", function(d) { return (yScale(+d.Global_Competitiveness_Index) + (radiusScale(+d.Population)/2));})
			.attr("x", function(d) { return (xScale(+d.GDP)+ radiusScale(+d.Population)); })
			.style("font-size",function(d) { return textScale(+d.Population); })
			.on("mouseover", mouseOverCountry)
			.on("mouseout", mouseOutCountry)
			.text(function(d){ return d.Country; });

		/******** HANDLE EXIT SELECTION ************/
		countryCircle.exit().remove();
		countryText.exit().remove();
	}



	//generate static country plot
	//Requires: Country filtered dataset, coutry_id
	function generateStaticCountryPlot(filtered_datset, id)
	{
		//Hide All Countries
		d3.selectAll(".dot,.countrylabel")
			.transition()
			.duration(200)
			.style("opacity", 0.10);

		//Create group to plot country path
		countryTrace[id] = canvas.attr("class","countryView"+id).selectAll("circle.countryView"+id).data(filtered_datset);

		/******** HANDLE UPDATE SELECTION ************/
		// Update the display of existing circles to match new data
		countryTrace[id]
			.transition()
			.duration(animationTransitionDuration)
			.ease(d3.easeLinear)
			.attr("class", function(d){ return ("countryView"+id+" "+d.Code+" "+d.Region); })
			.attr("cx", function(d) { return xScale(+d.GDP); })
			.attr("cy", function(d) { return yScale(+d.Global_Competitiveness_Index); })
			.attr("r", function(d) { return radiusScale(+d.Population); })
			.style("fill", function(d) { return colorScale(d.Region); })
			.style( "stroke", "#000");

		/******** HANDLE ENTER SELECTION ************/
		// Creating new circles in the dataset
		countryTrace[id]
				.enter().append("circle")
				.attr("class", function(d){ return ("countryView"+id+" "+d.Code+" "+d.Region); })
				.attr("cx", function(d) { return xScale(+d.GDP); })
				.attr("cy", function(d) { return yScale(+d.Global_Competitiveness_Index); })
				.attr("r", function(d) { return radiusScale(+d.Population); })
				.style("fill", function(d) { return colorScale(d.Region); })
				.style( "stroke", "#000")
				.on("mouseover", mouseOverCountry)
				.on("mouseout", mouseOutCountry);

		/******** HANDLE EXIT SELECTION ************/
		countryTrace[id].exit().remove();
	}
}



//Function for filtering data by year yearFilter
function yearFilter(value){
	return (value.Year == activeYear)
}


//Function for Country Tooltip MouseOverCountry
function mouseOverCountry(d){
	if(activeCountry == "All")
	{
		pause();
		showHideCountries(animationTransitionDuration,0.1)
		d3.select("#"+d.Country)
			.transition()
			.duration(200)
			.style("opacity", 1);
	}
	var Global_Competitiveness_Index = Math.round(d.Global_Competitiveness_Index * 100) / 100
	var h = "<b>Country: </b>" + d.Country+"<br><b>Year: </b>"+d.Year+"<br><b>GDP: </b>"+d.GDP
			+"<br><b>Global_Competitiveness_Index: </b>"+Global_Competitiveness_Index+"<br><b>Population: </b>"+d.Population;
	showAndHideToolTip(200,1,h)
}
//Function for Country Tooltip MouseOutCountry
function mouseOutCountry(d)
{
	if(activeCountry == "All")
		showHideCountries(animationTransitionDuration,0.9)
	showAndHideToolTip(500,0,"")
}
