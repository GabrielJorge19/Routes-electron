var reader = new FileReader();
var linhas = [];
var novo = 0;
var repetido = 0;


function readFile(){
  let a = document.getElementById('dados');
  reader.readAsDataURL(a.files[0]);
  setTimeout(function(){
		let q = (reader.result).split(',');
		checkData(atob(q[1]));
  }, 1000);  
}

function checkData(string){
	//let lines = string.replaceAll('\r', ``);
	let lines = string.split('\n');


	for(let i = 1;i < lines.length;i++){
		let existed = false;
		let line = lines[i].replaceAll('\r', ``).split(';');

		for(let o = 0;o < linhas.length;o++){
			if(line[1] == linhas[o][1]){
				existed = true;
			}
		}

		if(!existed){
			linhas.push(line);
			novo++;
		} else {
			repetido++;
		}
	}
	console.log('Done');
}

function ext(){
				let separador = ';';
					let csv = 'linhas; ID\n';

					for(let i = 0;i < linhas.length;i++){
						csv += `${linhas[i][0] + ';' + linhas[i][1]}\n`;
					}

					var hiddenElement = document.createElement('a');
	    		hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
			    hiddenElement.target = '_blank';
			    hiddenElement.download = 'linhas.csv';
			    hiddenElement.click();

					console.log("exporting");
				
			
		}
