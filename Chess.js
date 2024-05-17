

function copy(x){
    return JSON.parse(JSON.stringify(x))
}

function clone(obj){

    if(null == obj || "object" != typeof obj)
        return obj

    if(obj instanceof Date){
        var cpy = new Date
        cpy.setTime(obj.setTime)
        return cpy
    }
    if(obj instanceof Array){
        var cpy = []
        for(var i = 0; i < obj.length; i++){
            cpy[i] = clone(obj[i])
        }
        return cpy
    }
    if(obj instanceof Object){
        var cpy = {}
        for(var attr in obj){
            if(obj.hasOwnProperty(attr))
                cpy[attr] = clone(obj[attr])
        }
        return cpy
    }
}

function addColor(elem, revert=false, col=""){
    if(revert){
        var x = elem.getAttribute("value");
        var a = Number(x[0]), b = Number(x[2]);
        if(a % 2){
            if(b % 2)
                col = "black";
            else
                col = "white";
        }
        else{
            if(b % 2 == 0)
                col = "black";
            else
                col = "white";
        }
    }
    elem.style.backgroundColor = col;      
}


function makeBoard(){
    var box = document.getElementsByClassName("square");
    var r = document.getElementsByClassName("row");

    for(var i = 0; i < r.length; i++){
        var val = "row" + (i+1)
        r[i].setAttribute("name", val);

        var box = document.querySelectorAll("div[name=" + val + "] > .square");

        for(var j = 0; j < box.length; j++){
            box[j].setAttribute("value", [i+1, j+1]);
            addColor(box[j], revert=true, col=""); 
        }   
    }
}

var RESET = [[1, 2, 3, 4, 5, 3, 2, 1],
             [6, 6, 6, 6, 6, 6, 6, 6],
             [0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0],
             [-6, -6, -6, -6, -6, -6, -6, -6],
             [-1, -2, -3, -5, -4, -3, -2, -1]];

var BOARD = copy(RESET);
var GAMEOVER = false
var TURN = "W"
var PIECE = ["x", "ROOK", "HORSE", "BISHOP", "KING", "QUEEN", "PAWN"]
var RECORDEDMOVES = [], BLACKFP_RECORD = [], WHITEFP_RECORD = []
RECORDEDMOVES.push(copy(RESET))
document.getElementById("turn").value = "WHITE'S TURN"


function AddImg(elem, path, setName, pos){
    var img = document.createElement('img');
    img.src = path;
    img.classList.add("piece");
    img.setAttribute("value", pos);
    img.setAttribute("name", setName);
    elem.appendChild(img);
}

function draw_board(){
    for(var i = 0; i < 8; i++){
        var val = "row" + (i+1)
        var box = document.querySelectorAll("div[name=" + val + "] > .square");

        for(var j = 0; j < 8; j++){
            if(BOARD[i][j] != 0){

                if(BOARD[i][j] > 0){
                    var side = "b"
                }
                else{
                    var side = "w"
                }

                var img_path = "256h/" + side + "_piece" + Math.abs(BOARD[i][j]) + ".png"
                var pos = [(i+1), (j+1)];
                var name = side.toUpperCase() + "_" + PIECE[Math.abs(BOARD[i][j])];
                AddImg(box[j], img_path, name, pos)
                
            }
            
        }
    }
}


function resetBoard(){
    
    for(var i = 0; i < 8; i++){
        var val = "row" + (i+1)
        var box = document.querySelectorAll("div[name=" + val + "] > .square");

        for(var j = 0; j < 8; j++){

            var temp = box[j].getElementsByClassName("piece")
            try{
                temp[0].parentNode.removeChild(temp[0])
            }
            catch{}

            if(RESET[i][j] != 0){
                if(RESET[i][j] > 0){
                    var side = "b"
                }
                else{
                    var side = "w"
                }

                var img_path = "256h/" + side + "_piece" + Math.abs(RESET[i][j]) + ".png"
                var pos = [(i+1), (j+1)];
                var name = side.toUpperCase() + "_" + PIECE[Math.abs(RESET[i][j])];
                AddImg(box[j], img_path, name, pos)
            }
            
        }
    }
    var bfp = document.getElementById("blackFP")
    while(bfp.firstChild)
        bfp.firstChild.remove()

    var wfp = document.getElementById("whiteFP")
    while(wfp.firstChild)
        wfp.firstChild.remove()

    // RECORDEDMOVES.push(copy(RESET))
    // BOARD = copy(RESET)
    // recordFallenPieces()

    BLACKFP_RECORD = [], WHITEFP_RECORD = [], RECORDEDMOVES = []
    RECORDEDMOVES.push(copy(RESET))
    BOARD = copy(RESET)

    if(TURN == "B")
        changeturn()
    else if(GAMEOVER){
        TURN = "B"
        changeturn()
    }

    GAMEOVER = false
}


function prevMove(){
    
    if(RECORDEDMOVES.length > 1){
        BOARD = RECORDEDMOVES.pop()

    
        for(var i = 0; i < 8; i++){
            var val = "row" + (i+1)
            var box = document.querySelectorAll("div[name=" + val + "] > .square");

            for(var j = 0; j < 8; j++){

                var temp = box[j].getElementsByClassName("piece")
                try{
                    temp[0].parentNode.removeChild(temp[0])
                }
                catch{}

                if(BOARD[i][j] != 0){

                    if(BOARD[i][j] > 0){
                        var side = "b"
                    }
                    else{
                        var side = "w"
                    }

                    var img_path = "256h/" + side + "_piece" + Math.abs(BOARD[i][j]) + ".png"
                    var pos = [(i+1), (j+1)];
                    var name = side.toUpperCase() + "_" + PIECE[Math.abs(BOARD[i][j])];
                    AddImg(box[j], img_path, name, pos)
                    
                }
                
            }
        }
        update_fallenPieces()
        changeturn()
        GAMEOVER = false
    }
}


function gameover(){
    console.log(GAMEOVER)
    if(GAMEOVER)
        return true

    return false
}


makeBoard()
draw_board()

var SQ = document.getElementsByClassName("square");


function update_board(new_x, new_y, old_x, old_y, side){

    var box = document.querySelectorAll("div[name=row" + old_x + "] > .square");
    var temp = box[old_y-1].getElementsByClassName("piece")
    temp[0].parentNode.removeChild(temp[0])
   
    box = document.querySelectorAll("div[name=row" + new_x + "] > .square")
    var img_path = "256h/" + side + "_piece" + Math.abs(BOARD[new_x-1][new_y-1]) + ".png"
    var pos = [new_x, new_y]
    var name = side.toUpperCase() + "_" + PIECE[Math.abs(BOARD[new_x-1][new_y-1])];
    AddImg(box[new_y-1], img_path, name, pos)
    return pieceremoved
}

var cl = document.getElementsByClassName("piece")


var selectPiece = function(){

    if(!GAMEOVER){
        
        var name = this.getAttribute("name");
        var col = name[0];
        
        if(col == TURN){
            var pos = this.getAttribute("value"); 
            var x = Number(pos[0]);
            var y = Number(pos[2]);
            
            var m = []

            if(name.endsWith("PAWN"))
                m = movePawn(x, y, col);

            else if(name.endsWith("ROOK"))
                m = moveRook(x, y, col);
                
            else if(name.endsWith("HORSE"))
                m = moveHorse(x, y, col);

            else if(name.endsWith("BISHOP"))
                m = moveBishop(x, y, col);
            
            else if(name.endsWith("QUEEN"))
                m = moveQueen(x, y, col);
                
            else if(name.endsWith("KING"))
                m = moveKing(x, y, col);
                
            highlightCell(m)
            selectedCell(x, y)
            setPiece()
            //changeturn()
            
        }
    }
    
} 


for(var i = 0; i < cl.length; i++){
    cl[i].addEventListener('click', selectPiece, false)
}


var setPiece = function(){
    
    if(GAMEOVER == false){
        var movable = document.getElementsByClassName("highlight")
        //console.log(movable)
        for(var i = 0; i < movable.length; i++){

            movable.item(i).onmousedown = function(){
                var sel = document.getElementsByClassName("selected")
                sel = sel[0].getElementsByClassName("piece")[0]
                var type = sel.getAttribute("name")[0]
                var temp = sel.getAttribute("value")
                var old_x = temp[0], old_y = temp[2]
                var pos = this.getAttribute("value"); 
                var new_x = pos[0], new_y = pos[2];
                movePiece(new_x, new_y, old_x, old_y, type)
            }
        }
    }

    return true
}



function highlightCell(cells){
    
    for(var i = 0; i < cells.length; i++){
        var val = (cells[i][0]-1)*8 + (cells[i][1]-1);
        SQ[val].style.backgroundColor = "";
        SQ[val].classList.add("highlight");    
        //console.log(sq[val]);
    }
    
}


function selectedCell(x, y){
    var val = (x-1)*8 + (y-1);
    SQ[val].style.backgroundColor = "";
    SQ[val].classList.add("selected");
}


function removeHighlight(){
    var sq = document.getElementsByClassName("highlight");
    var cl = document.getElementsByClassName("piece")

    for(var i = 0; i < SQ.length; i++){
        SQ.item(i).onmousedown = undefined
    }
    for(var i = 0; i < cl.length; i++){
        cl[i].addEventListener('click', selectPiece, false)
    }

    while(sq.length){
        addColor(sq[0], true, "");
        sq[0].classList.remove("highlight");
    }

    var sel = document.getElementsByClassName("selected");
    while(sel.length){
        addColor(sel[0], true, "");
        sel[0].classList.remove("selected");
    }
}

function checkMove(x, y, col){
    
    if(x < 1 || x > 8 || y < 1 || y > 8)
        return false;

    if(BOARD[x-1][y-1] != 0){
        if(col == "W"){
            if(BOARD[x-1][y-1] < 0)
                return false;
        }
        else{
            if(BOARD[x-1][y-1] > 0)
                return false;
        }
    }
    return true;
}


function checkEnemy(x, y, col){
    //console.log(BOARD[x-1][y-1]);
    if(BOARD[x-1][y-1] == 0)
        return false;

    if(col == "W" && BOARD[x-1][y-1] > 0)
        return BOARD[x-1][y-1];
    
    else if(col == "B" && BOARD[x-1][y-1] < 0)
        return Math.abs(BOARD[x-1][y-1]);

    return false;
}


function checkSame(x, y, col){
    
    if(BOARD[x-1][y-1] == 0)
        return false;

    if(col == "W" && BOARD[x-1][y-1] < 0)
        return true;
    
    else if(col == "B" && BOARD[x-1][y-1] > 0)
        return true;

    return false;
}


function movePiece(new_x, new_y, old_x, old_y, side){
    
    RECORDEDMOVES.push(copy(BOARD))
    recordFallenPieces()
    pieceremoved = false
    var enemypiece = checkEnemy(new_x, new_y, side)
    if(enemypiece){
        box = document.querySelectorAll("div[name=row" + new_x + "] > .square")
        var temp = box[new_y-1].getElementsByClassName("piece")
        pieceremoved = temp[0]
        temp[0].parentNode.removeChild(temp[0])
    }
    
    var piece = BOARD[old_x-1][old_y-1];
    BOARD[old_x-1][old_y-1] = 0;
    BOARD[new_x-1][new_y-1] = piece;

    update_board(new_x, new_y, old_x, old_y, side)
    
    if(pieceremoved)
        setFallenPiece(pieceremoved)
    changeturn()
    if(checkmate(enemypiece)){
        if(side == "B"){
            alert("BLACK WINS")
            document.getElementById("turn").value = "BLACK WINS"
        }
        else{
            alert("WHITE WINS")
            document.getElementById("turn").value = "WHITE WINS"
        }
        GAMEOVER = true
    }
    
    
}


function setFallenPiece(piece){
    var col = piece.getAttribute("name")[0]
    
    var fallen = document.createElement('img')
    fallen.src = piece.src
    fallen.classList.add("fallenPiece")


    if(col == "B"){
        var placeholder = document.getElementById("blackFP")
        var newdiv = document.createElement('div')
        newdiv.classList.add("black_fallenPiece")
        newdiv.appendChild(fallen)
        placeholder.appendChild(newdiv)
    }

    else{
        var placeholder = document.getElementById("whiteFP")
        var newdiv = document.createElement('div')
        newdiv.classList.add("white_fallenPiece")
        newdiv.appendChild(fallen)
        placeholder.appendChild(newdiv)
    }
}


function movePawn(pos_x, pos_y, col){

    var move_list = [];
    var move;

    if(col == 'B'){
        move = [pos_x + 1, pos_y];

        if(checkMove(move[0], move[1], col) && !checkEnemy(move[0], move[1], col)){

            move_list.push(move);

            if(pos_x == 2){

                move = [pos_x + 2, pos_y];
                if(checkMove(move[0], move[1], col))
                    move_list.push(move);
            }
        }
        move = [pos_x + 1, pos_y + 1];
        if(checkMove(move[0], move[1], col) && checkEnemy(move[0], move[1], col))
            move_list.push(move);
        move = [pos_x + 1, pos_y - 1];
        if(checkMove(move[0], move[1], col) && checkEnemy(move[0], move[1], col))
            move_list.push(move);

        return move_list;
    }

    else{
        move = [pos_x - 1, pos_y];
        if(checkMove(move[0], move[1], col) && !checkEnemy(move[0], move[1], col)){
            move_list.push(move);

            if(pos_x == 7){

                move = [pos_x - 2, pos_y];
                if(checkMove(move[0], move[1], col))
                    move_list.push(move);
            }
        }
        move = [pos_x - 1, pos_y - 1];
        if(checkMove(move[0], move[1], col) && checkEnemy(move[0], move[1], col))
            move_list.push(move);
        move = [pos_x - 1, pos_y + 1];
        if(checkMove(move[0], move[1], col) && checkEnemy(move[0], move[1], col))
            move_list.push(move);

        return move_list;
    }
}


function moveRook(pos_x, pos_y, col){
    var dir_x = [1, -1, 0, 0], dir_y = [0, 0, 1, -1], move, move_list = []

    for(var i = 0; i < dir_x.length; i++){
        for(var j = 1; j < 8; j++){
            move = [pos_x + (j * dir_x[i]), pos_y + (j * dir_y[i])]

            if(checkMove(move[0], move[1], col)){
                move_list.push(move)
                if(checkEnemy(move[0], move[1], col))
                   break
            }
            else
                break
        }
    }
    return move_list
}


function moveHorse(pos_x, pos_y, col){
    var dir_x = [1, 1, -1, -1, 2, 2, -2, -2]
    var dir_y = [2, -2, 2, -2, 1, -1, 1, -1]
    var move, move_list = []

    for(var i = 0; i < dir_x.length; i++){
        move = [pos_x + dir_x[i], pos_y + dir_y[i]]

        if(checkMove(move[0], move[1], col))
            move_list.push(move)
    }
    return move_list
}


function moveBishop(pos_x, pos_y, col){
    var dir_x = [1, -1, 1, -1], dir_y = [1, 1, -1, -1], move, move_list = []

    for(var i = 0; i < dir_x.length; i++){
        for(var j = 1; j < 8; j++){
            move = [pos_x + (j * dir_x[i]), pos_y + (j * dir_y[i])]

            if(checkMove(move[0], move[1], col)){
                move_list.push(move)
                if(checkEnemy(move[0], move[1], col))
                   break
            }
            else
                break
        }
    }
    return move_list
    
}


function moveQueen(pos_x, pos_y, col){
    var dir_x = [1, 1, 1, 0, 0, -1, -1, -1]
    var dir_y = [1, -1, 0, 1, -1, 1, -1, 0]
    var move, move_list = []

    for(var i = 0; i < dir_x.length; i++){
        for(var j = 1; j < 8; j++){
            move = [pos_x + (j * dir_x[i]), pos_y + (j * dir_y[i])]

            if(checkMove(move[0], move[1], col)){
                move_list.push(move)
                if(checkEnemy(move[0], move[1], col))
                   break
            }
            else
                break
        }
    }
    return move_list
}


function moveKing(pos_x, pos_y, col){
    var dir_x = [1, 1, 1, 0, 0, -1, -1, -1]
    var dir_y = [1, -1, 0, 1, -1, 1, -1, 0]
    var move, move_list = []

    for(var i = 0; i < dir_x.length; i++){
        move = [pos_x + dir_x[i], pos_y + dir_y[i]]

        if(checkMove(move[0], move[1], col))
            move_list.push(move)
    }
    return move_list
}


function changeturn(){
    if(TURN == "B")
        TURN = "W"
    else
        TURN = "B"

    if(TURN == "B")
        document.getElementById("turn").value = "BLACK'S TURN"
    else
        document.getElementById("turn").value = "WHITE'S TURN"
}


function recordFallenPieces(){

    var bfp = document.getElementById("blackFP")
    //console.log(bfp.childNodes)
    BLACKFP_RECORD.push(bfp.cloneNode(true))
    //console.log(BLACKFP_RECORD)
    
    var wfp = document.getElementById("whiteFP")
    WHITEFP_RECORD.push(wfp.cloneNode(true))
}

function update_fallenPieces(){
    var bfp = BLACKFP_RECORD.pop().childNodes
    var curr = document.getElementById("blackFP")
    
    if(bfp.length != curr.childNodes.length){
        while(curr.firstChild){
            curr.firstChild.remove()
        }
        for(var i = 0; i < bfp.length; i++){
            curr.appendChild(bfp[i])
        }
    }

    var wfp = WHITEFP_RECORD.pop().childNodes
    curr = document.getElementById("whiteFP")
    
    if(wfp.length != curr.childNodes.length){
        while(curr.firstChild){
            curr.firstChild.remove()
        }
        for(var i = 0; i < wfp.length; i++){
            curr.appendChild(wfp[i])
        }
    }
}


function checkmate(val){
    if(PIECE[val] == "KING")
        return true

    return false
}







