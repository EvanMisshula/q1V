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
	    restrictedData,
	    margin,
	    width,
	    height
	      } = props;
    };

    
    const xAxisLabel = "Yes Pct";

    console.log(props.height);
    const innerHeight = props.height - props.margin.top - props.margin.bottom;
    const innerWidth = props.width - props.margin.left - props.margin.right;
    
    const dataScale = scaleLinear()
	  .domain([0, 100])
	  .range([0, innerWidth]);
    
    
    const catScale = scaleBand()
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
    
    const catAxis =axisLeft(catScale);

    const xAxis = axisBottom(dataScale);

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

};


    
