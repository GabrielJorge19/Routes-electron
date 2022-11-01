const http = require('http');
const fs = require('fs');
const XLSX = require('xlsx');


 







const urls = {
	main: 'todos.xlsx',
	bomb: 'http://bombeiros.sp.gov.br/hidrantes/04comitegestorsp/cbpmesp_hidrantes_municipiosp.xlsx',
	bsg: 'http://bombeiros.sp.gov.br/hidrantes/08bsg/cbpmesp_dados_bsg.xlsx',
	manutations: 'http://api.ona.io/api/v1/data/617853.csv'
}

function file(){
	return '123aa';
}
















var bombTable = fs.createWriteStream("bomb.xlsx");
var bsgTable = fs.createWriteStream("bsg.xlsx");
var fixTable = fs.createWriteStream("fix.txt");

function load_tables(){


	const bombRequest = http.get(urls.bomb, function(response) {
	   response.pipe(bombTable);

	   // after download completed close filestream
	   bombTable.on("finish", () => {
	        bombTable.close();
	        bombTable = XLSX.readFile('bomb.xlsx');
	   });
	});
	
	const bsgRequest = http.get(urls.bsg, function(response) {
	   response.pipe(bsgTable);

	   // after download completed close filestream
	   bsgTable.on("finish", () => {
	        bsgTable.close();
	        bsgTable = XLSX.readFile('bsg.xlsx');
	   });
	});

	const fixRequest = http.get(urls.manutations, function(response) {
	   //response.pipe(fixTable);
	   //console.log(response);

	   	response.on('data', (data) => {
			console.log(data.toString());
		});



	   // after download completed close filestream
	   fixTable.on("finish", () => {
	        fixTable.close();
	        fixTable = fs.readFileSync('fix.txt','utf8');
	   });
	});
	
}


function lookTables(){
	var xlData = XLSX.utils.sheet_to_json(bsgTable.Sheets[bsgTable.SheetNames[0]]);
    //console.log("Bsg table loaded", bsgTable.SheetNames[0], xlData[0], xlData[0].TIPO, xlData[0].ID, xlData.length);
	//console.log(fixTable);
}













setTimeout(() => {
	//lookTables();
}, 5000);


//load_tables();
module.exports = file;


/*


*/