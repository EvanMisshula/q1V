import { select,
	 csv,
	 scaleLinear,
	 scaleBand,
	 axisLeft,
	 axisBottom
       } from 'd3';

import { dropDownMenu } from './dropDownMenu';
import { barchart } from './barchart';
//import { wrap } from './twrap';

const svg = select('svg');

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
    
    select('#menus')
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





 csv('./aggQ1Results.csv').then(loadedData => {
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
