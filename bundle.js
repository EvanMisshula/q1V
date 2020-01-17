(function (d3) {
	'use strict';

	const dropDownMenu = (selection, props) => {
	    {
		const {
		    options,
		    onCategoryClicked
		} = props;

		let  select = selection.selectAll('select').data([null]);
		select = select.enter().append('select')
		    .merge(select)
		    .on('change', function() {
			onCategoryClicked(this.value);
		    });
		
		const availCats = select.selectAll('option').data(options);
		availCats.enter().append('option').
		    merge(availCats)
		    .attr('value',(d,i)=>i)
		    .text(d => d);
	    }};

	const barchart = (selection, props) => {

	    
	    const xAxisLabel = "Yes Pct";

	    console.log(props.height);
	    const innerHeight = props.height - props.margin.top - props.margin.bottom;
	    const innerWidth = props.width - props.margin.left - props.margin.right;
	    
	    const dataScale = d3.scaleLinear()
		  .domain([0, 100])
		  .range([0, innerWidth]);
	    
	    
	    const catScale = d3.scaleBand()
		  .domain(props.restrictedData.map(props.catValue))
		  .range([0, innerHeight])
		  .padding(0.1);
		

	    const g = selection.selectAll('.container').data([null]);
	    const gEnter = g
		  .enter().append('g')
		  .attr('class','container');
	    
	    gEnter
		.merge(g)
		.attr('transform',
			`translate(${props.margin.left},${props.margin.top})`);
	    
	    const catAxis =d3.axisLeft(catScale);

	    const xAxis = d3.axisBottom(dataScale);

	    const catAxisG = gEnter
		  .append('g')
		  .attr('class','y-axis')
		  .merge(g.select('.y-axis'))
		  .call(catAxis)
		  .selectAll('.domain').remove();
	    
	    const catAxisGEnter =  gEnter
		  .append('g')
	     	  .attr('class','y-axis');
	    catAxisG
		  .merge(catAxisGEnter)
		  .call(catAxis)
		  .selectAll('.domain').remove();

	    const yAxisLabelText = catAxisGEnter
		  .append('text')
		  .attr('class','axis-label')
		  .attr('y',-93)
		  .attr('fill','black')
		  .attr('transform',`rotate(90)`)
		  .attr('text-anchor','middle')
		  .merge(catAxisG.select('.axis-label'))
		  .attr('x', -innerHeight/2)
		  .text(props.displayCategory);
	    
	    const xAxisG = g.select('.x-axis');
	    const xAxisGEnter = gEnter
		  .append('g')
		  .attr('class', 'x-axis');
	    xAxisG
		.merge(xAxisGEnter)
		.attr('transform', `translate(0,${innerHeight})`)
		.call(xAxis)
		.selectAll('domain').remove();

	    const xAxisLabelText = xAxisGEnter
		  .append('text')
		  .attr('class', 'axis-label')
		  .attr('y', 75)
		  .attr('fill', 'black')
		  .merge(xAxisG.select('.axis-label'))
		  .attr('x', innerWidth / 2)
		  .text(xAxisLabel);


	    const rectangles = g.merge(gEnter).
		  selectAll('rect').data(props.restrictedData);


	    rectangles.exit().remove();
	    
	    rectangles.enter().append('rect')
		.merge(rectangles)
		.attr('y',d=>catScale(props.catValue(d)))
		.attr('width',d=>dataScale(props.dataValue(d)))
		.attr('height', catScale.bandwidth());

	//    const textSamp = "Are you able to regularly access religious services?";

	    
	//    console.log(wrap(textSamp,20));    
	};

	//import { wrap } from './twrap';

	const svg = d3.select('svg');

	// let dataValue = d => d.yesPct;
	// let catValue = d => d.qNum;
	 

	let data;
	let displayCategory;
	let restrictedData;
	let catIndex;


	let myCat = [ "Services",
		      "Procedure",
		      "Economics",
		      "Health and Well Being",
		      "Interpersonal"];



	const dcRestrict = d => d.Category === displayCategory;

	const margin = { top: 20, right: 40, bottom: 140, left: 200 };
	const width = +svg.attr('width');
	const height = +svg.attr('height');
	    

	const onMyCatClicked = category => {
	    catIndex = +category;
	    displayCategory=myCat[catIndex];
	    restrictedData = data.filter(dcRestrict);
	    render();
	};
	    
	const render = ()  => {
	    
	    d3.select('#menus')
		.call(dropDownMenu, {
		    options: myCat,
		    onCategoryClicked: onMyCatClicked
		});

	    console.log(displayCategory);
	    console.log(restrictedData);
	    console.log(height);



	    
	    svg.call(barchart,{
		dataValue: d => d.yesPct,
		catValue: d => d.qNum,
		quesText: d => d.Question,
		restrictedData: restrictedData,
		margin: margin,
		width: width,
		height: height
	    });

	};





	 d3.csv('./aggq1Results.csv').then(loadedData => {
	     data = loadedData;
	     data.forEach(d=>{
		 d.Category = d.Category;
		 d.CatGrp = +d.CatGrp;
		 d.Question = d.Question;
		 d.noCount = +d.noCount;
		 d.yesCount = +d.yesCount;
		 d.NoAnswer = +d.NoAnswer;
		 d.NoPct = +d.NoPct;
		 d.yesPct = +d.yesPct;
		 d.qNum = d.qNum;
		 d.totalSurveys = +d.totalSurveys;
	    });
	//     console.log(data);
	     displayCategory = "Services";
	     restrictedData = data.filter(d => d.Category === "Services");
	     render();

	 });

}(d3));
