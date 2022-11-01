class PopUp {
	constructor(){
		console.log("criado PopUp");
		this.logs = [];
		this.list = [];
		this.classes = [];
		this.classes["default"] = {
			name: "default",
			time: 3, 
			style: `
				background-color: white;
				bottom: 30px;
				opacity: 0;
				left: 100px;
			`,	
		};
		this.superStyle = `
			position: fixed;
			border-radius: 10px;
			border: 1px solid black;
			z-index: 5;
			padding: 5px 30px 10px 20px;
			max-width: 150px;
		`;
	}

	addLog(id, action){
		let log = {
			lodId: this.logs.length,
			popId: id,
			action: action
		}

		this.logs[this.logs.length] = log;
	}

	render(){
		let moveHeight = 0;

		if(this.list.length > 1){
			if(this.list[this.list.length - 2].status != "done"){
				moveHeight += document.getElementById("popUp-" + this.list[this.list.length - 1].id).clientHeight + 17; // 15 de margen e 2 de borda
			}
		}

		this.move(moveHeight, this.list.length - 1);
	}

	removePopUpDom(id){
		let pop = document.getElementById("popUp-" + id);
		
		if(pop != null){
			let opacity = parseFloat(pop.style.opacity);
			let left = parseFloat(pop.style.left);

			if(opacity > 0){
			    pop.style.opacity = opacity - .05;
			} 
			if(left > -100){
				pop.style.left = (left - 3) + 'px';
			}

			if((opacity > 0) || (left > -100)){
			  	let esse = this;
				setTimeout(function(){
			      esse.removePopUpDom(id);
			    }, 15);
			} else {
				this.addLog(id, "removed");
				this.list[id].status = "done";
				pop.remove();
			}
		}
	}

	createPopUp(obj){

			obj.status = 'new';
			obj.id = this.list.length;
						
			let style = this.superStyle + this.classes[obj.type].style;
			
			let html = `<div style="${style}" id="popUp-${obj.id}" class="popUp">
				<h1>${obj.title}</h1>
				<p>${obj.body}</p>
			</div>`;

			this.list.push(obj);
			document.getElementsByTagName("body")[0].innerHTML += html;

			this.render();
	}

	move(q, id){
		let speed = 10;
	 	if(q > 0){
		  	let esse = this;
		    setTimeout(function(){
		      esse.move(q-speed, id);
		    }, 15);
		    
		    let pops = document.getElementsByClassName("popUp");
		    let bottom = parseInt(pops[pops.length - 2].style.bottom);
		    let top = window.innerHeight * .5;

		    for(let i = pops.length - 2;i >= 0 ;i--){
		    	if(bottom + speed >= top){
		    		let idNumber = pops[i].id;
		    		idNumber = idNumber.slice(idNumber.indexOf('-')+1);

		    		this.removePopUpDom(idNumber);
		    	}

			    	let b = (bottom + speed) + "px";
			    	pops[i].style.bottom = b;
			    	bottom += pops[i].clientHeight + 15;
		    }

		} else {
			this.addLog(id, "moved");
			this.display(id);

			let esse = this;
			let time = this.classes[esse.list[id].type].time;
			setTimeout(function(){
				esse.removePopUpDom(id);
			}, (time + .5) * 1000);
		}
	}

	display(id){
		let pop = document.getElementById("popUp-" + id);
		if(pop != null){
			let opacity = parseFloat(pop.style.opacity);
			let left = parseFloat(pop.style.left);
			
			if(opacity < 1){
			    pop.style.opacity = opacity + .05;
			} 
			if(left > 20){
				pop.style.left = (left - 3) + 'px';
			}


			if((opacity < 1) || (left > 20)){
			  	let esse = this;
				setTimeout(function(){
			      esse.display(id);
			    }, 15);
			} else {
				this.addLog(id, "Displayed");
			}
		}
	}
}



// let pop = new PopUp();


// function click(){
// 	// alert("On click works");
// 	console.log("aaa");
// }

// let p = {
// 	type: "default",
// 	title: "First class",
// 	body: "Esse é o corpo grande de um pop up",
// 	onClick: click,
// }

// let r = setInterval(function(){
// 	// pop.createPopUp(p);
// }, 400);

// setTimeout(function(){
// 	// pop.buildPopDom();
// 	clearInterval(r);
// }, 3000);