function Chess() {
        this.init();
}

Chess.prototype.getCurrentState = function() {
    return this.state[this.state.length-1];
        // return the current state of the application
};

Chess.prototype.init = function() {
        this.state = [];
       // setting initial state
        this.state.push({
                activePlayer: 'b',
                currentBoard: this.freshBoard(),
                selectedPiece: null,
                selectedPieceLocation: [],
                validPieceSelected: false
        });
};

Chess.prototype.reset = function() {
        this.init();
};

Chess.prototype.freshBoard = function() {
        var board =[];
        // initialize array with with values of pieces, empty place is null

        board[0] = [5,4,3,9,10,3,4,5]; 
        for(var i=1;i<7;i++){
          board[i]=[];
          for(var j=0;j<8;j++){
            (i==1 || i==6) ? board[i][j]= 1 : board[i][j]=null;
          }
        }
        board[7] = [5,4,3,9,10,3,4,5];
        return board;
};

Chess.prototype.isValidTurn = function(x, y) {
  var state = this.getCurrentState();

  if(!state.validPieceSelected) return false;
    
    var checkEdges = (x >= 0 && y >= 0 && x <= 7 && y <= 7 &&
           state.currentBoard[x][y] === null) ? true : false;
  
    // checking for valid moves for various piece
    var checkMove = function(){
      var selectedPiece = state.selectedPiece;
      var selectedPieceLocation = state.selectedPieceLocation;
      var currentBoard =state.currentBoard;
      var oldx = selectedPieceLocation[0];
      var oldy = selectedPieceLocation[1];
      var tmpOldx;
      var tmpX;
        if(state.activePlayer == 'w'){ // change direction for checking valid conditions
          tmpOldx=oldx;
          tmpX=x;
          x=7-x;
          oldx=7-oldx;

        }

        switch (selectedPiece) {
          case 1:
            return isValidPawn();
            break;
          case 5:
            return isValidRook();
            break;
          case 4:
            return isValidKnight();
            break;
          case 3:
            return isValidBishop();
            break;
          case 9:
            return isValidQueen();
            break;
          case 10:
            return isValidPawn();
            break;
        }

      function isValidPawn(){
        if(selectedPiece == 1 || selectedPiece == 10){ 
            if (x < oldx) return false;
            if ((x - oldx) >1) return false;
            else if (y != oldy) return false;       
          }
          return true;
      }
      
      function isValidRook(){
        if (y == oldy && x!=oldx) {
          if(x>oldx){
          for(var i=oldx+1;i<=x; i++){
            if(state.activePlayer == 'w'){
              if(currentBoard[7-i][oldy]!=null) return false;
            }
            else if(currentBoard[i][oldy]!=null) return false;
          }
          return true;
          }
          else if(x<oldx){
          for(var i=oldx-1;i>=x; i--){
            if(state.activePlayer=='w'){
              if(currentBoard[7-i][oldy]!=null) return false;
            }
            else if(currentBoard[i][oldy]!=null) return false;
          }
          return true;
          }
        }
        else if (y != oldy && x==oldx) {
          if(y>oldy){
          for(var i=oldy+1;i<=y; i++){
            if (state.activePlayer=='w'){
              if (currentBoard[tmpOldx][i]!=null)  return false;
            }
            else if(currentBoard[oldx][i]!=null) return false;

          }
          return true;
          }
          else if(y<oldy){
          for(var i=oldy-1;i>=y; i--){
            if (state.activePlayer=='w') {
              if(currentBoard[tmpOldx][i]!=null)  return false;
            }
            if(currentBoard[oldx][i]!=null) return false;
          }
          return true;
          }
        }
        else return false;
      }

      function isValidKnight(){
        if((x==oldx+2 || x==oldx-2) && (y==oldy+1 || y==oldy-1)) return true;
        else if((x==oldx+1 || x==oldx-1) && (y==oldy+2 || y==oldy-2)) return true;
        return false;
      }
      
      function isValidBishop(){
        if(!(Math.abs(x-oldx) === Math.abs(y-oldy))) return false;
        var count=0;
        // check for position in middle that it is empty and piece is not jumping over other
        while(count<Math.abs(x-oldx)){
           count++;   
         if(state.activePlayer =='b'){
          if((x>oldx && y>oldy) && (currentBoard[oldx+count][oldy+count] != null)) return false; 
          else if((x>oldx && y<oldy) && (currentBoard[oldx+count][oldy-count] != null)) return false; 
          else if((x<oldx && y>oldy) && (currentBoard[oldx-count][oldy+count] != null)) return false; 
          else if((x<oldx && y<oldy) && (currentBoard[oldx-count][oldy-count] != null)) return false; 
         }
         else{
           if((tmpX>tmpOldx && y>oldy) && (currentBoard[tmpOldx+count][oldy+count] != null)) return false; 
           else if((tmpX>tmpOldx && y<oldy) && (currentBoard[tmpOldx+count][oldy-count] != null)) return false; 
           else if((tmpX<tmpOldx && y>oldy) && (currentBoard[tmpOldx-count][oldy+count] != null)) return false; 
           else if((tmpX<tmpOldx && y<oldy) && (currentBoard[tmpOldx-count][oldy-count] != null)) return false; 

         }
        }
        return true;
      }

      function isValidQueen(){
        return isValidBishop() || isValidRook();
      }
      return true;
    }

    if(!checkEdges || !checkMove()) {
       return false;
    }

    return true;
};

Chess.prototype.moveStarted = function(x,y, pieceValue) {
  var state = this.getCurrentState();
  state.selectedPiece = state.currentBoard[x][y];
  state.selectedPieceLocation = [x, y];
  var activePlayer = state.activePlayer;
  
        if(activePlayer=='b' && pieceValue <= 9817)
            state.validPieceSelected = false;
        
        else if(activePlayer=='w'&& pieceValue > 9817)
            state.validPieceSelected = false;
        

        else state.validPieceSelected = true;
};

Chess.prototype.updatedBoard = function(x,y) {
        var state = this.getCurrentState();
        var currentBoard = state.currentBoard;
        var newBoard = [];
        var oldx = state.selectedPieceLocation[0];
        var oldy = state.selectedPieceLocation[1];
        
        for (var i = 0; i < currentBoard.length; i++) {
            newBoard.push(currentBoard[i].concat());
        }
        // make old location null and uupdate new one with piece value
        newBoard[oldx][oldy]=null;
        newBoard[x][y] = state.selectedPiece;
        return newBoard;
};


Chess.prototype.takeTurn = function(x, y) {
       var state = this.getCurrentState();
       var newState = this.getCurrentState();
       var selectedPiece = state.selectedPiece;
       var valid = false;    
       if(this.isValidTurn(x, y)) {
                var newState = {
                    activePlayer: (state.activePlayer === 'b') ? 'w' : 'b'
                };
                valid = true;
                newState.currentBoard = this.updatedBoard(x, y);
                this.state.push(newState);
        }
        return {
                moveBy: state.activePlayer,
                valid: valid,
                board: newState.currentBoard,
        };
};

Chess.prototype.randomMove = function(){
  var state = this.getCurrentState();
  var activePlayer = state.activePlayer; 
  var board = state.currentBoard;
  var result= false;
  var prevX;
  var prevY;
  var newX;
  var newY;
  
  if(activePlayer == 'b'){
    while(!result){
       prevX = getRandomInt(0,2);
       prevY = getRandomInt(0,7);
       if(board[prevX][prevY] != null){
         chess.moveStarted(prevX,prevY);
         newX = getRandomInt(1,5);
         newY = getRandomInt(0,7);
         res = chess.takeTurn(newX,newY);
         result = res.valid; 
       }
    } 
  }
  else {
    while(!result){
       prevX = getRandomInt(5,7);
       prevY = getRandomInt(0,7);
       if(board[prevX][prevY] != null){
        chess.moveStarted(prevX,prevY);
        newX = getRandomInt(3,6);
        newY = getRandomInt(0,7);
        res = chess.takeTurn(newX,newY);
        result = res.valid;
       }  
    }
  }
    var oldId = "r"+prevX+"c"+prevY;
    var newId = "r"+newX+"c"+newY;
    var moveFrom = document.getElementById(oldId);
    var moveTo = document.getElementById(newId);
    moveTo.innerHTML = moveFrom.innerHTML;
    moveFrom.innerHTML = "";
    var currentMove = document.getElementById("currentTurn");
    if(res.moveBy === 'b' ) currentMove.innerHTML =" Move made by Black, now White's turn!";
    if(res.moveBy === 'w' ) currentMove.innerHTML =" Move made by White, now Black's turn!";


} 

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var chess = new Chess();

var table=document.getElementById("chessBoard");
var dragSrcEl =null;
for (var i = 0; i < table.rows.length; i++) {
     for (var j = 0; j < table.rows[i].cells.length; j++){
        var id = "r"+ i +"c"+j;
        table.rows[i].cells[j].draggable=true;
        table.rows[i].cells[j].id =id;
        table.rows[i].cells[j].ondragover= function (event) {
           event.preventDefault();
        };
        table.rows[i].cells[j].addEventListener('dragstart', handleDragStart, false);
        table.rows[i].cells[j].addEventListener('drop', handleDrop, false);
     }
}


function generateRandomMove(){
  chess.randomMove();
}

function handleDragStart(e) {
  dragSrcEl = this;
  if(this.innerHTML === "") alert("Empty place selected!!");
  else {
    //getting value code of cell
    var encodedStr = this.innerText.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
      return '&#'+i.charCodeAt(0)+';';
    });
    var loc = this.id.match(/\d+/g);
    chess.moveStarted(parseInt(loc[0]), parseInt(loc[1]), parseInt(encodedStr.replace(/\D/g, '')));
    event.dataTransfer.setData("text/html", this.innerHTML);
  }
}
    
function handleDrop(ev) {
  var loc = this.id.match(/\d+/g);
  var result = chess.takeTurn(parseInt(loc[0]), parseInt(loc[1]));
  var currentMove = document.getElementById("currentTurn");
  console.log(result);
  if (dragSrcEl != this && result.valid) {
    dragSrcEl.innerHTML = this.innerHTML;
    if(result.moveBy === 'b' ) currentMove.innerHTML =" Move made by Black, now White's turn!";
    if(result.moveBy === 'w' ) currentMove.innerHTML =" Move made by White, now Black's turn!";        
    this.innerHTML = event.dataTransfer.getData('text/html');
  }
  else{
    alert("Sorry! Invalid move");
  }
    return false;
}