/*  GLOBALS */ 

let GRID_SIZE = 3;
let TILE = localStorage.getItem("Tile")
let TILE_DEFAULT;
let map = [];
let moveCount = 0; 
let gameArea = document.querySelector(".game-area")
let playerTurn = 1; 





const generateEventListener = (element) => {
    console.log("generating gameArea event listener")
    element.addEventListener("click", (event) => {
        console.log("event")
        console.log(event.target)
        let target = event.target
        if(!target.classList.contains("cell")){
            return
             
        }
        console.log("we clicked a cell")
        
        if(target.style.backgroundImage === ""){
            target.style.backgroundImage = `url('src/${playerTurn}.png')`
            playerTurn === 1 ? playerTurn = 2 : playerTurn = 1
        }
        
    })
}




const makeAMove = (player) => {
    let moveX;
    let moveY;
    let playerMarker
    // do the move 
    moveValidation(playerMarker,moveX,moveY)
}

const moveValidation = (marker,x,y) =>{
    for(let i = 0; i < GRID_SIZE; i++){
        if(map[x][i] != marker){
            break;
        }
        if(i === GRID_SIZE - 1){
            console.log(`${marker} Win`)
        }
    }
    for(let j = 0; j < GRID_SIZE; j++){
        if (map[j][y]!= marker) {
            break
        }
        if(j === GRID_SIZE -1){
            console.log(`${marker} Win`)
        }
    }
    if( x === y){
        for(let k = 0; k < GRID_SIZE; k++){
            if(map[k][k] != marker){
                break;
            }
            if(k === GRID_SIZE -1){
                console.log(`${marker} Win`)
            }
        }
    }
    if( x + y === n - 1){
        for(let l = 0; l < GRID_SIZE; l++){
            if(map[l][l-1] != marker){
                break;
            }
            if(l === GRID_SIZE -1){
                console.log(`${marker} Win`)
            }
        }
    }
    if(moveCount == (Math.pow(GRID_SIZE, 2) - 1)){
        console.log("Draw Nerds")
    }
}


const uploadTile = () => {

}

const deployToStorage = () => {

}

const resetGame = () => {

}
let drawGrid = (width, height) =>{

    let grid = '<div id="grid">'
    let cell_html = ''
    let i = 0 
    let j = 0

    for( ; i < width; i++) {
        cell_html += `<div class="cell" data-column = "${i}" ></div>`;
    }

    for( ; j < height; j++) {
        grid += `<div class="row" data-row = "${j}">'` + cell_html + '</div>';
    }

    grid += '</div>';
    
    generateEventListener(gameArea)
    return grid;
}

const initializeGame = () => {
    function createMap() {
        for (let x = 0; x < GRID_SIZE; x++) {
                        map[x] = [];
            for (let y = 0; y < GRID_SIZE; y++) {
                addCell(x, y); 
            }
        }
    }
    
    function addCell(x, y) {
        map[x][y] = cell(x,y); 
    }
    
    function cell(arg) {
        return `${arg}`
        // return (x+1)+":"+(y+1);
    }

   

    createMap();
    
    
    

    

    gameArea.innerHTML = drawGrid(GRID_SIZE,GRID_SIZE)

    
   

}




initializeGame()
