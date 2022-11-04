// $("#numbers").animate({"height": "200px"}).removeClass("toggled");
// overflow: auto;

console.log('Primeira linha do arquivo newTools.js');

$("#filter").click(() => {
    $('#newTools').slideToggle();
})

$(".tool").click((obj) => {
    let id = obj.target.id;
    id = id.slice(0, id.indexOf('-'));
    let ul = $(`#${id}`);
    ul.slideToggle();
});

function buildFilters(filters){
    let ableFilters = ['REGIAO', 'TIPO', 'VAZAO', 'SITUACAO', 'Manutenir'];
    let html = "";
    for(let i = 0;i < filters.length;i++){

        if(ableFilters.indexOf(filters[i]) != -1){
            let options = geo.mapOptions(filters[i]);
            
            html += `
            <h1 class="filtro" id='${filters[i]}'>${filters[i]}</h1>
            <ul id='filtro-${filters[i]}' class="filter-options">`;

            for(let o = 0;o < options.length;o++){
                html += `
                    <li class="filtro-${filters[i]}" id="${filters[i]}-${options[o]}">${options[o]}
                        <img class="icon" src="./mapIcons/${colors[o]}.png" id="icon-${options[o]}">
                        <img class="look" src="./imgs/icons/hide.png" id="see-${options[o]}">
                    </li>`;

                objetosDoMapa[`${filters[i]}-${options[o]}`] = {
                    changed: false,
                    refresh: true,
                    visible: false,
                    icon: colors[o],
                    objs: geo.filterObjs(geo.data, [filters[i]], ['equal'], [[options[o]]])
                }
                //console.log("geo.data", [filters[i]], ['equal'], [[options[o]]]);
            }
            html += "</ul>";
        }
    }
    document.getElementById('filtros').innerHTML = html;

    setTimeout(() => {
        $(".icon").click((obj) => {
            let fullPath = obj.target.src;
            let path = fullPath.slice(0, fullPath.lastIndexOf('/'));
            let name = fullPath.slice(fullPath.lastIndexOf('/')+1, fullPath.lastIndexOf('.'));
            let ext = fullPath.slice(fullPath.lastIndexOf('.'));

            let indexIcon;

            colors.map((obj, index) => {
                if(obj == name){
                    indexIcon = ++index;
                }
            });

            indexIcon = (indexIcon > colors.length -1)?0:indexIcon;
            fullPath = path + "/" + colors[indexIcon] + ext;
            obj.target.src = fullPath;

            objetosDoMapa[obj.target.parentElement.id].changed = true;
            objetosDoMapa[obj.target.parentElement.id].icon = colors[indexIcon];
            atualizarMapa();
        });

        $(".look").click((obj) => {
            let fullPath = obj.target.src;
            let path = fullPath.slice(0, fullPath.lastIndexOf('/'));
            let name = fullPath.slice(fullPath.lastIndexOf('/')+1, fullPath.lastIndexOf('.'));
            let ext = fullPath.slice(fullPath.lastIndexOf('.'));

            name = (name == "see")?"hide":"see";

            fullPath = path + "/" + name + ext
            obj.target.src = fullPath;

            objetosDoMapa[obj.target.parentElement.id].changed = true;
            objetosDoMapa[obj.target.parentElement.id].visible = (name == "see")?true:false;;
            atualizarMapa();


            //console.log(obj.target.id);
        });

        $(".filtro").click((obj) => {
            let id = obj.target.id;
            let ul = $(`#filtro-${id}`);
            ul.slideToggle();
        });

        atualizarMapa();        
    }, 100);
}

