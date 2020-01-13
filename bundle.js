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

	//import { barchart } from './barchart';

	const svg = d3.select('svg');
	const width = +svg.attr('width');
	const height = +svg.attr('height');
	let margin = { top: 20, right: 40, bottom: 100, left: 160 };
	let dataValue = d => d.yesPct;
	let catValue = d => d.qNum;
	 

	let data;
	let displayCategory;
	let restrictedData;
	let catIndex;

	const myCat = [ "Services",
		      "Procedure",
		      "Economics",
		      "Health and Well Being",
		      "Interpersonal"];



	const dcRestrict = d => d.CatGrp === catIndex;


	const onMyCatClicked = category => {
	    catIndex = +category;
	    displayCategory = myCat[catIndex];
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
	    let catAxisLabel = displayCategory;

	    const innerHeight = height - margin.top - margin.bottom;
	    const innerWidth = width - margin.left - margin.right;
	    
	    const dataScale = d3.scaleLinear()
		  .domain([0, 100])
		  .range([0, innerWidth]);
	    
	    
	    const catScale = d3.scaleBand()
		  .domain(restrictedData.map(catValue))
		  .range([0, innerHeight])
		  .padding(0.1);
	    
	    const g = svg.selectAll('.container').data([null]);
	    const gEnter = g
		  .enter().append('g')
		  .attr('class','container');
	    
	    gEnter
		.merge(g)
		.attr('transform',
			`translate(${margin.left},${margin.top})`);
	    
	    const catAxis =d3.axisLeft(catScale);

	    const xAxis = d3.axisBottom(dataScale);

	    const catAxisG = g.select('y-axis');
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
		  .text(catAxisLabel);
	    
	    const xAxisG = g.select('.x-axis');
	    const xAxisGEnter = gEnter
		  .append('g')
		  .attr('class', 'x-axis');
	    xAxisG
		.merge(xAxisGEnter)
		.attr('transform', `translate(0,${innerHeight})`)
		.call(xAxis)
		.selectAll('domain').remove();

	    // const xAxisLabelText = xAxisGEnter
	    // 	  .append('text')
	    // 	  .attr('class', 'axis-label')
	    // 	  .attr('y', 75)
	    // 	  .attr('fill', 'black')
	    // 	  .merge(xAxisG.select('.axis-label'))
	    // 	  .attr('x', innerWidth / 2)
	    // 	  .text(xAxisLabel);
		  



	    const rectanglesG = g.merge(gEnter).data(restrictedData);
	    const rectanglesGEnter = rectanglesG
		  .append('g')
		  .attr('class','rect')
		  .attr('y',d=>catScale(catValue(d)))
		  .attr('width',d=>dataScale(dataValue(d)))
		  .attr('height', catScale.bandwidth());

	    rectanglesG
		.merge(rectanglesGEnter)
		.data(restrictedData)
		.selectAll('').remove();

	    // selectAll('rect').data(restrictedData);
	    // rectangles.enter().append('rect')
	    // 	.merge(rectangles)

	    
	    // svg.call(barchart, {
	    //  	dataValue: d => d.yesPct,
	    // 	catValue: d => d.qNum,
	    // 	margin: { top: 20, right: 40, bottom: 20, left: 100 },
	    // 	width,
	    // 	height,
	    // 	restrictedData
	    // });
	};





	 d3.csv('aggq1results.csv').then(loadedData => {
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
	     restrictedData = data.filter(d => d.CatGrp === 0);
	     render();

	 });

}(d3));
