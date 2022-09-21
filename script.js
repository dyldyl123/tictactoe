/*  Selectors */ 


let currentTurnComplain = document.querySelector("#current-turn-complain")
let gameArea = document.querySelector(".game-area")
let inputHandler = document.querySelector(".load-file-container")
let gameTimeElement = document.querySelector("#current-game-time")
let turnTimeElement = document.querySelector("#current-turn-time")
let cells = document.querySelectorAll(".cell")
let resetButton = document.querySelector(".reset")
let fileUploadButton = document.querySelectorAll(".file-uploader")
let playerOneWinElement = document.querySelector(".player-one-wins")
let playerTwoWinElement = document.querySelector(".player-two-wins")
let sl = document.querySelector(".switch") 
let p1image = document.querySelector("#player-one-profile") 
let p2image = document.querySelector("#player-two-profile")
let rangeSlider = document.querySelector("#range-slider")


/* GLOBALS */

let ls = localStorage
let aiModeFlag = "2"
let GRID_SIZE = 5
let INTERVAL = 1
let map = [];
let moveCount = 0; 
let playerTurn = 1; 
let player1DataUrl;
let player2DataUrl;
let currentTurnTime = 0
let currentGameTime = 0
let outcome = 0;
let playerOneWins = 0
let playerTwoWins = 0



/* event listeners*/
rangeSlider.addEventListener("input", (event) =>{
    GRID_SIZE = event.target.value
    initializeGame()
    resetGame()
})

sl.addEventListener("click", (event) =>{
    console.log(event.target.checked)
    console.log(event.target.id)
    if(event.target.checked){
        aiModeFlag = "1"
    } else { 
        aiModeFlag = "2" 
    }
    resetGame()
})

const generateEventListener = (element) => {
    element.addEventListener("click", (event) => {
        let target = event.target
        if(!target.classList.contains("cell")){
            return
             
        }
       if(outcome !== 0){
        return
       }
        // modify background
        if(target.style.backgroundImage === ""){
            
            if(player1DataUrl !== undefined  && playerTurn === 1){
                
                target.style.backgroundImage = `url(${player1DataUrl})`
                target.style.backgroundSize = "contain"
                
            }
            else if(player2DataUrl !== undefined && playerTurn === 2){
                target.style.backgroundImage = `url(${player2DataUrl})`
                target.style.backgroundSize = "contain"
            }else{
                target.style.backgroundImage = `url('src/${playerTurn}.png')`
            }
            
            target.textContent = `${playerTurn}`
            moveCount += 1
             // call moveValidation passing in targets dataset attributes    
            moveValidation(playerTurn,target.dataset.column -1,target.parentElement.dataset.row -1)
        // change the turn 
            playerTurn === 1 ? playerTurn = 2 : playerTurn = 1
            currentTurnTime = 0
        }
       
    })
}


resetButton.addEventListener("click", () =>{
    resetGame();
})

inputHandler.addEventListener("input", (event) => {
    let element = event.target 
    uploadTile(element)
})


/* time handlers */

let currentGameTimeHandler = setInterval(() => {
    if(outcome === 0){
        currentGameTime +=1;
        gameTimeElement.textContent = currentGameTime
    }
   
}, 1000);



let currentTurnTimeHandler = setInterval(() => {
    if(outcome !== 0){
        return
    }
    currentTurnTime +=1;
    turnTimeElement.textContent = currentTurnTime
    if(currentTurnTime >= INTERVAL ){ 
        if(aiModeFlag === "2"){
            currentTurnComplain.textContent = `Your Turn Player ${playerTurn}`
            return
        }
        if(aiModeFlag === "1" && playerTurn === 1){
            currentTurnComplain.textContent = `Your Turn Player ${playerTurn}`
            return
        }
        if(aiModeFlag === "1"){
            currentTurnComplain.textContent = `AI Took its turn`
        }else {
            currentTurnComplain.textContent = `You took too long player ${playerTurn} so we made your turn for you`
        }
       
        let currentCells = document.querySelectorAll(".cell")
        
        let cellArray = [];
        for( let cell of currentCells){
            if(cell.textContent === ""){
                cellArray.push(cell)
            }
        }
        if(cellArray.length === 0){
            // alert(`game over, game was ${currentGameTime} seconds long`)
            return
        }
        let randomNo = Math.floor(Math.random() * (currentCells.length - 1))
        // do all the move validation
        let selectedCell = cellArray[randomNo]
        console.log(cellArray)
        console.log(randomNo)
        console.log(selectedCell)
        selectedCell.textContent = `${playerTurn}`
        if(selectedCell.style.backgroundImage === ""){
            
            if(player1DataUrl !== undefined && playerTurn === 1){
                
                selectedCell.style.backgroundImage = `url(${player1DataUrl})`
                selectedCell.style.backgroundSize = "contain"
            }
            else if(player2DataUrl !== undefined && playerTurn === 2){
                selectedCell.style.backgroundImage = `url(${player2DataUrl})`
                selectedCell.style.backgroundSize = "contain"
            }else{
                selectedCell.style.backgroundImage = `url('src/${playerTurn}.png')`
            }
        }    
        moveCount += 1
            moveValidation(playerTurn,selectedCell.dataset.column -1,selectedCell.parentElement.dataset.row -1)
        // change the turn 
        playerTurn === 1 ? playerTurn = 2 : playerTurn = 1
        currentTurnTime = 0;
    }
    
    
}, 1000);



/* starting the game*/

/* load from storage */
if(ls.getItem("playerOneWins")!== undefined){
    playerOneWins = ls.getItem("playerOneWins")
    playerOneWinElement.textContent = playerOneWins
}

if(ls.getItem("playerTwoWins") !== undefined){
    playerTwoWins = ls.getItem("playerTwoWins")
    playerTwoWinElement.textContent = playerTwoWins
}


const initializeGame = () => {


    gameArea.innerHTML = drawGrid(GRID_SIZE,GRID_SIZE)
    /* adjust cell size based on GRID_SIZE */
    let GRID_RATIO = 60/GRID_SIZE
    let drawnCells = document.querySelectorAll(".cell")
    for(let cell of drawnCells){
    cell.style.width =  `${GRID_RATIO}vh`
    cell.style.height = `${GRID_RATIO}vh`
    }
    /* adjust borders based on GRID_SIZE */
    let corner1 = grabDrawnCell(1,1)
    let corner2 = grabDrawnCell(1,GRID_SIZE)
    let corner3 = grabDrawnCell(GRID_SIZE,1)
    let corner4 = grabDrawnCell(GRID_SIZE,GRID_SIZE)
    for(let temp=2;temp<=(GRID_SIZE -1);temp++){

        let grabbedCell = grabDrawnCell(1,temp)
        
        grabbedCell.style.borderLeft = '0'
        
    }
    for(let temp=2;temp<=(GRID_SIZE -1);temp++){
        
        let grabbedCell = grabDrawnCell(temp,1)
        
        grabbedCell.style.borderTop = '0'
        
    }
    for(let temp=2;temp<=(GRID_SIZE -1);temp++){
        
        let grabbedCell = grabDrawnCell(GRID_SIZE,temp)
        
        grabbedCell.style.borderRight = '0'
        
    }
    for(let temp=2;temp<=(GRID_SIZE -1);temp++){
        
        let grabbedCell = grabDrawnCell(temp,GRID_SIZE)
        
        grabbedCell.style.borderBottom = '0'
        
    }

    
    corner1.style.borderTop = '0'
    corner1.style.borderLeft = '0'
    corner2.style.borderBottom = '0'
    corner2.style.borderLeft = '0'
    corner3.style.borderTop = '0'
    corner3.style.borderRight = '0'
    corner4.style.borderBottom = '0'
    corner4.style.borderRight = '0'
   
}

let drawGrid = (width, height) =>{

    let grid = '<div id="grid">'
    let cell_html = ''
    let i = 0 
    let j = 0

    for( ; i < width; i++) {
        cell_html += `<div class="cell" draggable = "true" data-column = "${i+1}" ></div>`;
    }

    for( ; j < height; j++) {
        grid += `<div class="row" data-row = "${j+1}">'` + cell_html + '</div>';
    }

    grid += '</div>';
    
    generateEventListener(gameArea)

    return grid;
}

const grabDrawnCell = (dColumn,dRow) => {
    let cellColumn = document.querySelectorAll(`[data-column="${dColumn}"]`)

    let cellColumnArray = Array.from(cellColumn)
    let cell = cellColumnArray.filter(element => element.parentElement.dataset.row === `${dRow}`)
    return cell[0]
}


/* playing the game */

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
    
     
    for(let i = 0; i < GRID_SIZE; i++){
        if(map[x][i] != marker){
            break;
        }
        if(i === GRID_SIZE - 1){
            console.log(`${marker} Win`)
            outcome = playerTurn
            completeGame()
            return
        }
    }
    for(let j = 0; j < GRID_SIZE; j++){
        if (map[j][y]!= marker) {
            break
        }
        if(j === GRID_SIZE -1){
            console.log(`${marker} Win`)
            outcome = playerTurn
            completeGame()
            return
        }
    }
    if( x === y){
        for(let k = 0; k < GRID_SIZE; k++){
            if(map[k][k] != marker){
                break;
            }
            if(k === GRID_SIZE -1){
                console.log(`${marker} Win`)
                outcome = playerTurn
                completeGame()
                return
            
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
                outcome = playerTurn
                completeGame()
                return
            
            }
        }
    }
    if(moveCount === (Math.pow(GRID_SIZE, 2))){
        console.log("Draw Nerds")
        outcome = 3
        completeGame()
        return
            
    }
   
}

const completeGame = () => {
    console.log("complete game")
    console.log(outcome)
    
    if(outcome === 1){
        playerOneWins = parseInt(playerOneWins) + 1
        playerOneWinElement.textContent = parseInt(playerOneWins) 
        deployToStorage("playerOneWins",parseInt(playerOneWins))
        popUpOverlay()
    }else if(outcome === 2){
        playerTwoWins = parseInt(playerTwoWins) + 1
        playerTwoWinElement.textContent = parseInt(playerTwoWins)
        deployToStorage("playerTwoWins",parseInt(playerTwoWins))
        popUpOverlay()
    }else if(outcome === 3){
        popUpOverlay()
    }
    
}



/* additional functionality */
const uploadTile = (input) => {
    let file = input.files[0]
    let reader = window.URL.createObjectURL(file);
    if(input.id === "file-upload-1"){
        player1DataUrl = reader
        console.log(p1image)
        p1image.style.backgroundImage = `url(${player1DataUrl})`
        console.log(p1image.style.backgroundImage)
    }else{
        player2DataUrl = reader
        p2image.style.backgroundImage = `url(${player1DataUrl})`
        
    }
    
    
}

const deployToStorage = (item,value) => {
    localStorage.setItem(`${item}`,value)
}

const resetGame = () => {
 map = [];
 moveCount = 0; 
 playerTurn = 1; 
 player1DataUrl;
 player2DataUrl;
 currentTurnTime = 0
 currentGameTime = 0
 outcome = 0
let currentCells = document.querySelectorAll(".cell")
 for( let button of fileUploadButton){
    button.value = ""
 }

 for( let cell of currentCells){
    cell.textContent = ""
    cell.style.backgroundImage = ""
 }
 reverseOverlay()
}

 /* css manipulation functions */

 function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
 
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

const popUpOverlay = () =>{
    let overlayElement = document.querySelector(".overlay")
    let winningTextElement = document.querySelector(".winning-text")
    overlayElement.style.opacity = "1"
    overlayElement.style.zIndex = "1"
    resetButton.style.zIndex = "2"
    outcome === 1 ? winningTextElement.textContent = "Player 1 Wins" : outcome === 2 ? winningTextElement.textContent = "Player 2 Wins" : winningTextElement.textContent = "Draw"
    winningTextElement.style.zIndex = "2"
    winningTextElement.style.fontSize = "larger"
}

const reverseOverlay = () => {
    let overlayElement = document.querySelector(".overlay")
    let winningTextElement = document.querySelector(".winning-text")
    overlayElement.style.opacity = "0"
    overlayElement.style.zIndex = "-10"
    resetButton.style.zIndex = "0" 
    winningTextElement.style.zIndex = "-10"
    winningTextElement.style.fontSize = "0"
}





initializeGame()


//  deployToStorage("playerOneWins",0)
//  deployToStorage("playerTwoWins",0)
let dragged = null
let temp = document.querySelectorAll(".cell")

for(thing of temp){
    thing.addEventListener("dragover",(event) =>{
        event.preventDefault()
    })
    thing.addEventListener("dragstart", (event) =>{
        dragged = event.target
    })
    thing.addEventListener("drop", (event) => {
        if( event.target !== dragged){
           
            let sourceStyle = window.getComputedStyle(dragged)
            let targetStyle = window.getComputedStyle(event.target)
            let targetIntermediateStyle = handleSwapStyle(["background-color","border-left-width","border-right-width","border-top-width","border-bottom-width"],sourceStyle,targetStyle)
            let sourceIntermediateStyle = handleSwapStyle(["border-left-width","border-right-width","border-top-width","border-bottom-width"],targetStyle,sourceStyle)
            event.target.style.cssText = targetIntermediateStyle
            dragged.style.cssText = sourceIntermediateStyle
           
            
            
            // todo: call move validation / change turn logic
        }
    })
}

const handleSwapStyle = (filterArray,sourceItem,targetItem) => {
    let filteredStyleString = ""
    let initialStyleArray = Array.from(sourceItem)
    let filteredSyleArray = initialStyleArray.filter((element) =>{
        if(filterArray.includes(element)){
            filteredStyleString = `${filteredStyleString}${element}:${targetItem.getPropertyValue(element)};`
            return
        }else{
            return element
        }
    })
    let outputString = filteredSyleArray.reduce((str, property)=>{
        return `${str}${property}:${sourceItem.getPropertyValue(property)};` 
    })
    return outputString + filteredStyleString 
}
    


