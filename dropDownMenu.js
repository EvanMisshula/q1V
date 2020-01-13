export const dropDownMenu = (selection, props) => {
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
    };
};
