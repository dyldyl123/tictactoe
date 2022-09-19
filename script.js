/*  GLOBALS */ 

let GRID_SIZE = 3;
let TILE = localStorage.getItem("Tile")
let TILE_DEFAULT;
let map = [];
let moveCount = 0; 


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
    
    console.log(map);
    console.log(typeof map[1][1])
    
   

}

const drawGrid = (width, height) =>{

    const grid = '<div id="grid">'
    let cell_html = ''
    let i = 0 
    let j = 0

    for( ; i < width; i++) {
        cell_html += '<div class="cell"></div>';
    }

    for( ; j < height; j++) {
        grid += '<div class="row">' + cell_html + '</div>';
    }

    grid += '</div>';

    return grid;
}

initializeGame()