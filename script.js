/*  GLOBALS */ 

// let GRID_SIZE = prompt("Enter in Size of Grid you want");
let GRID_SIZE = 3
let TILE = localStorage.getItem("Tile")
let TILE_DEFAULT;
let map = [];
let moveCount = 0; 
let gameArea = document.querySelector(".game-area")
let playerTurn = 1; 
let player1DataUrl;
let player2DataUrl;





const generateEventListener = (element) => {
    console.log("generating gameArea event listener")
    element.addEventListener("click", (event) => {
        let target = event.target
        if(!target.classList.contains("cell")){
            return
             
        }
        console.log("we clicked a cell")
        // modify background
        if(target.style.backgroundImage === ""){
            console.log(player1DataUrl)
            if(player1DataUrl !== undefined && playerTurn === 1){
                console.log("i have a picture (p1)")
            }
            else if(player2DataUrl !== undefined && playerTurn === 2){
                console.log("i have a picture (p2)")
            }else{
                target.style.backgroundImage = `url('src/${playerTurn}.png')`
            }
            
            target.textContent = `${playerTurn}`
            moveCount += 1
             // call moveValidation passing in targets dataset attributes    
            moveValidation(playerTurn,target.dataset.column -1,target.parentElement.dataset.row -1)
        // change the turn 
            playerTurn === 1 ? playerTurn = 2 : playerTurn = 1
            
        }
       
    })
}






const moveValidation = (marker,x,y) =>{

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
    
    function cell(x,y) {
        let element = grabDrawnCell(x+1,y+1)
       
        return element.textContent
    }

   

     createMap();
    
     console.log(map)
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
    if( x + y === GRID_SIZE - 1){
        for(let l = 0; l < GRID_SIZE; l++){
            if(map[l][l-1] != marker){
                break;
            }
            if(l === GRID_SIZE -1){
                console.log(`${marker} Win`)
            }
        }
    }
    if(moveCount === (Math.pow(GRID_SIZE, 2) - 1)){
        console.log("Draw Nerds")
    }
   
}


const uploadTile = (input) => {
    let file = input.files[0]
    let reader = new FileReader();
    reader.readAsDataURL(file)
    
    reader.onload = function() {
        if(input.id === "file-upload-1"){
                player1DataUrl = reader.result
                
        }else{
                player2DataUrl = reader.result
            }
            
           
    }
    
    
    
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
        cell_html += `<div class="cell" data-column = "${i+1}" ></div>`;
    }

    for( ; j < height; j++) {
        grid += `<div class="row" data-row = "${j+1}">'` + cell_html + '</div>';
    }

    grid += '</div>';
    
    generateEventListener(gameArea)

    return grid;
}

const initializeGame = () => {


    gameArea.innerHTML = drawGrid(GRID_SIZE,GRID_SIZE)

}


const grabDrawnCell = (dColumn,dRow) => {
    let cellColumn = document.querySelectorAll(`[data-column="${dColumn}"]`)

    let cellColumnArray = Array.from(cellColumn)
    let cell = cellColumnArray.filter(element => element.parentElement.dataset.row === `${dRow}`)
    return cell[0]
}




 initializeGame()
let inputHandler = document.querySelector(".load-file-container")
inputHandler.addEventListener("input", (event) => {
let element = event.target 
uploadTile(element)
} )




