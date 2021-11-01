var canvas = document.getElementById('myCanvas');
var computer_p=document.getElementById('computer_p')
var rect_canvas = canvas.getBoundingClientRect();
var ctx = canvas.getContext('2d');
ctx.fillStyle='rgb(236,238,212)';
ctx.fillRect(0,0,300,300);
ctx.fillRect(600,0,300,300);
ctx.fillRect(300,300,300,300);
ctx.fillRect(0,600,300,300);
ctx.fillRect(600,600,300,300);
ctx.fillStyle='rgb(116,150,84)';
ctx.fillRect(300,0,300,300);
ctx.fillRect(0,300,300,300);
ctx.fillRect(600,300,300,300);
ctx.fillRect(300,600,300,300);

var feld = 
[   ['-','-','-'],
    ['-','-','-'],
    ['-','-','-']];

var img_x=new Image();
var img_o=new Image();
img_o.src="./o.png";
img_x.src="./x.png";


img_x.onload=function(){
    if(Math.floor(Math.random()*2)==1){        
        var ret=getBestMove(feld,'x');        
        feld[ret.x][ret.y]='x';
        ctx.drawImage(img_x,ret.x*300,ret.y*300);
        ret=getBestMove(feld,'o');  
        var txt="Best Move for o is: ("+ret.x+"|"+ret.y+") expected to "+((ret.winner == 'o') ? "win" : ((ret.winner == 'd') ? "draw" : "lose"));
        computer_p.textContent=txt;
    } else{
        computer_p.textContent="You to move";
    }
}

canvas.addEventListener('click', function(event) {
    var xVal = event.pageX-rect_canvas.left ,yVal = event.pageY-rect_canvas.top ;
    var x=Math.floor(xVal/300);
    var y=Math.floor(yVal/300);
    var over=isGameOver(feld);
    if(feld[x][y]=='-' && over=='-'){
        feld[x][y]='o';
        ctx.drawImage(img_o,x*300,y*300);
        over=isGameOver(feld);
        if(over=='-'){
            var ret=getBestMove(feld,'x');       
            //console.log(ret); 
            feld[ret.x][ret.y]='x';
            ctx.drawImage(img_x,ret.x*300,ret.y*300);                        
            over=isGameOver(feld);
            if(over=='-'){
                ret=getBestMove(feld,'o');  
                var txt="Best Move for o is: ("+ret.x+"|"+ret.y+") expected to "+((ret.winner == 'ox') ? "win" : ((ret.winner == 'd') ? "draw" : "lose"));
                computer_p.textContent=txt;            
            }
        }
        if(over!='-'){
            computer_p.textContent=((over=='o')?"You WIN!":((over=='x')?"You Lose!":"Draw."))+" \tclick Canvas to play again";
        }
    }else{
        if(over!='-'){
            setTimeout(()=>{
                location.reload();},1000); 
        }
    }
    
},false);


function isGameOver(pos) {
    var player;
    for (var i = 0; i < 3; i++) {
        player = pos[i][0];
        if (player == '-')
            continue;
        if (pos[i][1] != player || pos[i][2] != player)
            continue;
        return player;
    }
    for (var i = 0;  i < 3; i++) {
        player = pos[0][i];
        if (player == '-')
            continue;
        if (pos[1][i] != player || pos[2][i] != player)
            continue;
        return player;
    }
    player = pos[1][1];
    if((pos[0][0]==player && pos[2][2] == player)||(pos[2][0] == player && pos[0][2] == player)){
        return player;
    }
    //check for full field
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (pos[i][j] == '-') {
                return '-';
            }
        }
    }
    return 'd';
}


function getBestMove( pos, player) {            
    var ret={};
    var retZustand = 'u';//u undifined l lose w win d draw
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (pos[i][j] != '-' )
                continue;
            pos[i][j] = player;
            //printPos(pos);
            var status = isGameOver(pos);
            if (status == '-') {
                var z = getBestMove(pos, ((player == 'x') ? 'o' : 'x'));
                pos[i][j] = '-';
                if (z.winner == player) {                    
                    ret.x=i;
                    ret.y=j;
                    ret.winner=player;
                    return ret;
                }
                if (z.winner == 'd') {
                    if (retZustand == 'u' || retZustand == 'l') {
                        retZustand = 'd';
                        ret.x=i;
                ret.y=j;
                        ret.winner= 'd';
                    }
                }
                if (retZustand == 'u' ) {
                    retZustand = 'l';
                    ret.x=i;
                    ret.y=j;
                    ret.winner= ((player == 'x') ? 'o' : 'x');
                }
                continue;
            }
            pos[i][j] = '-';
            if (status == player) {                
                ret.x=i;
                ret.y=j;
                ret.winner= player;
                return ret;
            }
            if (status == 'd') {
                if (retZustand == 'u' || retZustand == 'l') {
                    retZustand = 'd';
                    ret.x=i;
                    ret.y=j;
                    ret.winner= 'd';
                }
                continue;
            }
            if (retZustand == 'u') {
                retZustand = 'l';
                ret.x=i;
                ret.y=j;
                ret.winner= ((player == 'x') ? 'o' : 'x');
            }

        }
    }
    return ret;
}


