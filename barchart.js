import { select,
	 selectAll,
	 csv,
	 scaleLinear,
	 scaleBand,
	 axisLeft,
	 axisBottom
       } from 'd3';

export const barchart = (selection, props) => {
    {
	const { 
		dataValue,
		catValue,
		margin,
		width,
		height,
		restrictedData
	      } = props;
    };

    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;
    
    const dataScale = scaleLinear()
	  .domain([0, 100])
	  .range([0, innerWidth]);
    
    
    const catScale = scaleBand()
	  .domain(restrictedData.map(catValue))
	  .range([0, innerHeight])
	  .padding(0.1);
    
    const g = selection.selectAll('.container').data([null]);

	gEnter.attr('transform',
		`translate(${margin.left},${margin.top})`);
    
    const catAxis =axisLeft(catScale);

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
	  .merge(catAxisG.select('.asix-label'))
	  .attr('x', -innerHeight/2)
	  .text(catAxisLabel);
    
    const xAxisG = g.append('g')
	  .call(axisBottom(dataScale))
	  .attr('transform', `translate(0,${innerHeight})`);



    const rectangles = g.merge(gEnter).
	  selectAll('rect').data(restrictedData);
    rectangles.enter().append('rect')
	.merge(rectangles)
	.attr('y',d=>catScale(catValue(d)))
	.attr('width',d=>dataScale(dataValue(d)))
	.attr('height', catScale.bandwidth());

    // gEnter.append('text')
    // 	.attr('class','title')
    // 	.attr('y',-10)
    // 	.title(displayCategory);
	




};
