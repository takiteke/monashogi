var express = require('express');
var router = express.Router();

/* GET *//*
router.get('/', function(req, res, next) {
  var turn = 0;//0は先手
  var Board = [
        [19,20,21,24,21,20,18],
        [17,23, 0, 0, 0,22,17],
        [ 0,17,17,17,17,17, 0],
        [ 0, 0, 0, 0, 0, 0, 0],
        [ 0, 1, 1, 1, 1, 1, 0],
        [ 1, 6, 0, 0, 0, 7, 1],
        [ 2, 4, 5, 8, 5, 4, 3],];
  var Hand = [ //手駒 Hand[0]は先手
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  var aaa =[];
  aaa[0] = new Te(new Pos(0,0), new Pos(0,0), 0, false);
  data = {
    title: 'home',
    Board: Board,
    Hand: Hand,
    turn: turn,
    Eval: '',
    sashite: aaa,
  };
  res.render('index', data);
});*/

router.get('/ajax', function(req, res, next) {
  var postrange = req.query.num;
  var postSashite = [];
  for(var i=postrange; i<tesuu; i++){
    (function(i){
      postSashite[i] = sashite[i];
    })(i);
  }
  res.json(postSashite);
});

/* POST */
router.get('/', function(req, res, next) {
  
  //reqからBoardを取り出す
  //var Board = req.body.Board.split(",");
  var Board = [
    [19,20,21,24,21,20,18],
    [17,23, 0, 0, 0,22,17],
    [ 0,17,17,17,17,17, 0],
    [ 0, 0, 0, 0, 0, 0, 0],
    [ 0, 1, 1, 1, 1, 1, 0],
    [ 1, 6, 0, 0, 0, 7, 1],
    [ 2, 4, 5, 8, 5, 4, 3],];
  nBoard = new Array(9);
  for(var i=0; i<9; i++){ nBoard[i] = new Array(9); }
  /*
  for(var ny=0; ny<9; ny++){
    for(var nx=0; nx<9; nx++){
      nBoard[ny][nx] = parseInt(Board[ny*9 + nx]);//req内で文字列としてくるので、数値に変換
    }
}*/
  for(var ny=1; ny<=7; ny++){
    for(var nx=1; nx<=7; nx++){
      nBoard[ny][nx] = Board[ny-1][nx-1];//req内で文字列としてくるので、数値に変換
    }
  }
  //reqからHandを取り出す
  //var Hand = req.body.Hand.split(",");
  var Hand = [ //手駒 Hand[0]は先手
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  nHand = Hand;
  /*
  nHand = new Array(2);
  for(var i=0; i<2; i++){ nHand[i] = new Array(9); }
  for(var ny=0; ny<2; ny++){
    for(var nx=0; nx<9; nx++){
      nHand[ny][nx] = parseInt(Hand[ny*9 + nx]);//req内で文字列としてくるので、数値に変換
    }
  }*/
  //reqからturnを取り出す
  //var nturn = parseInt(req.body.turn);
  var turn = 0;
  var nturn = 0;//0は先手
  
  for(var i=0; i<5; i++){ depNum[i] = 0; }
  searchNum = 0;
  cutNum = 0;
  
  
  turn_swich = nturn;
  //var BestMove = new Te(new Pos(0,0), new Pos(0,0), 0, false);
  //var Eval = AlphaBeta(nturn, 0, 3, -1000000, 1000000, BestMove);
  //console.log('最善手: (' + postMove.from.dan + ',' + postMove.from.suji + ') → (' + postMove.to.dan + ',' + postMove.to.suji + ') cap: ' + postMove.capture + ', pro: ' + postMove.promote + ', eval: ' + Eval); 

  
  sashite = [];
  tesuu = 0;
  Eval = 0;
  /*
  while(Math.abs(Eval) < 1000){
    var search = function(){
      
    };
    setTimeout(search, 10);
  }
*/
  loopSleep(300, 200, function(){
    var BestMove = new Te(new Pos(0,0), new Pos(0,0), 0, false);
    Eval = AlphaBeta(nturn, 0, 3, -1000, 1000, BestMove);
    sashite[tesuu++] = postMove;
    nturn = nturn?0:1;
    turn_swich = nturn;
    console.log(Eval);

    if(Math.abs(Eval) > 1000) { return false; }
  });

  nsashite = [];
  ntesuu = 0;
  sashite.forEach(function(value){
    console.log('最善手: (' + value.from.dan + ',' + value.from.suji + ') → (' + value.to.dan + ',' + value.to.suji + ') cap: ' + value.capture + ', pro: ' + value.promote); 
    nsashite[ntesuu++] = new Array(value.from.dan, value.from.suji, value.to.dan, value.to.suji, value.capture, value.promote?1:0);
  });
  
  console.log(nsashite);

  //状況表示
  //console.log(nBoard);
  //console.log(nHand);
  //console.log(nturn);
  //console.log('探索局面数は' + searchNum + 'です。');
  //console.log('打ち切り局面は' + cutNum + 'です。');
  //for(var i=0; i<5; i++){ console.log('depth' + i + 'では ' + depNum[i]); }

  var sBoard = new Array(7);
  for(var i=0; i<7; i++){ sBoard[i] = new Array(7); }
  for(var i=0; i<7; i++){
    for(var j=0; j<7; j++){
      sBoard[i][j] = nBoard[i+1][j+1];
    }
  }

  data = {
    title: 'home',
    Board: Board,
    Hand: Hand,
    turn: (turn?0:1),
    Eval: Eval,
  };
  res.render('index', data);
});

function loopSleep(_loopLimit,_interval, _mainFunc){
  var loopLimit = _loopLimit;
  var interval = _interval;
  var mainFunc = _mainFunc;
  var i = 0;
  var loopFunc = function () {
    var result = mainFunc();
    console.log(i);
    if (result === false) {
      // break機能
      return;
    }
    i = i + 1;
    if (i < loopLimit) {
      setTimeout(loopFunc, interval);
    }
  }
  loopFunc();
  console.log('endd');

  return;
}

function Pos(dan, suji){
  this.dan = dan;
  this.suji = suji;
}
function Te(from, to, capture, promote){
  this.from = from;
  this.to =  to;
  this.capture = capture;
  this.promote = promote;
}
function IsEnemy(piece_id){
  return (piece_id & 16);
}
function IsSelf(piece_id){
  return (1<=piece_id && piece_id<=15);
}
function IsEnemyt(turneos, piece_id){
  if (turneos) {
    return IsSelf(piece_id);
  } else {
    return IsEnemy(piece_id);
  }
}
function IsSelft(turneos, piece_id){
  if (turneos) {
    return IsEnemy(piece_id);
  } else {
    return IsSelf(piece_id);
  }
}

var Direction = [];
  Direction[0]  = new Pos(0,1);   //→
  Direction[1]  = new Pos(1,1);   //↓→
  Direction[2]  = new Pos(1,0);   //↓
  Direction[3]  = new Pos(1,-1);  //↓←
  Direction[4]  = new Pos(0,-1);  //←
  Direction[5]  = new Pos(-1,-1); //↑←
  Direction[6]  = new Pos(-1,0);  //↑
  Direction[7]  = new Pos(-1,1);  //↑→
  Direction[8]  = new Pos(-2,1);  //先手の桂馬飛び↑↑→
  Direction[9]  = new Pos(-2,-1); //先手の桂馬飛び↑↑←
  Direction[10] = new Pos(2,1);   //後手の桂馬飛び↓↓→
  Direction[11] = new Pos(2,-1);  //後手の桂馬飛び↓↓←
const CanGo = [
  // 歩香桂銀金 角飛玉と杏 圭全金馬竜
  [0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,
   0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1],//→
  [0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,1,
   0,0,0,0,1,1,1,0,1,1,1,1,1,1,1,1],//↓→
  [0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,
   0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1],//↓
  [0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,1,
   0,0,0,0,1,1,1,0,1,1,1,1,1,1,1,1],//↓←
  [0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,
   0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1],//←
  [0,0,0,0,1,1,1,0,1,1,1,1,1,1,1,1,
   0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,1],//↑←
  [0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,
   0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1],//↑
  [0,0,0,0,1,1,1,0,1,1,1,1,1,1,1,1,
   0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,1],//↑→
  [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//↑↑→
  [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//↑↑←
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],//↓↓→
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],//↓↓←
  ];
const CanJamp = [
  // 歩香桂銀金 角飛玉と杏 圭全金馬竜
  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,
   0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],//→
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,
   0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],//↓→
  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,
   0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1],//↓
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,
   0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],//↓←
  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,
   0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],//←
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,
   0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],//↑←
  [0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,
   0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],//↑
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,
   0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],//↑→
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//↑↑→
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//↑↑←
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//↓↓→
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//↓↓←
  ];
var HandValue = [
	// , 歩,香, 桂,銀,金,角, 飛,玉
		 0,10,30,40,50,60,80,100,999
  ];
var PieceValue = [
	// , 歩,香, 桂,銀,金,角, 飛, 玉,  と, 杏,圭,全, 金,馬, 竜,
		 0,10,30,40,50,60,80,100,9999,100,90,90,80, 0,120,140,
	// , v歩, v香,v桂,v銀,v金,v角, v飛, v王,  vと, v杏,v圭, v全,v金,v馬,v竜
		 0,-10,-30,-40,-50,-60,-80,-100,-9999,-100,-90,-90,-80, 0,-120,-140,
  ];


var nBoard;
var nHand;
var searchNum;
var cutNum;
var depNum = new Array(5);
var postMove = new Te(new Pos(0,0), new Pos(0,0), 0, false);
var turn_swich;
var sashite;
var tesuu;

//合法手生成
function MakeMoves(turneos, teNum, teBuf){//teNumいる???
  //王手がかかっているとき
  
  //王手がかかっていないとき
  for(var i=1; i<=7; i++){
    for(var j=1; j<=7; j++){
      (function(i, j){
        var pos = new Pos(i, j);
        if(IsSelft(turneos, nBoard[pos.dan][pos.suji])){
          var koma = nBoard[pos.dan][pos.suji];
          
          for(var dir=0; dir<12; dir++){
            var newpos = new Pos(pos.dan+Direction[dir].dan, pos.suji+Direction[dir].suji);
            if(CanGo[dir][koma] && (IsEnemyt(turneos, nBoard[newpos.dan][newpos.suji]) || nBoard[newpos.dan][newpos.suji] == 0)){
              var pieceOfMoveto = nBoard[newpos.dan][newpos.suji];
              
              if(CanJamp[dir][koma]){
                var captured = false;
                var far = 0;
                while(!captured){
                  var jampto = new Pos(newpos.dan+far*Direction[dir].dan, newpos.suji+far*Direction[dir].suji);
                  
                  if(IsEnemyt(turneos, nBoard[jampto.dan][jampto.suji]) || nBoard[jampto.dan][jampto.suji] == 0){
                    pieceOfMoveto = nBoard[jampto.dan][jampto.suji];
                    if(((koma==6 || koma==7) && jampto.dan<=2) || ((koma==22 || koma==23) && jampto.dan>=6)){//飛車or角が敵陣に入ったら必ず成る
                      teBuf[teNum++] = new Te(pos, jampto, pieceOfMoveto, true);
                    }
                    else if((koma==2 && jampto.dan<=2) || (koma==18 && jampto.dan>=6)){//香車は2段目で必ず成る
                      teBuf[teNum++] = new Te(pos, jampto, pieceOfMoveto, true);
                    }
                    else{
                      if((turneos===0 && jampto.dan<=2) || (turneos!==0 && jampto.dan>=6)){
                        if(!(koma==5 || (koma>=8 && koma<=16) || koma==21 || koma>=24)){//成り駒は成れない。
                          teBuf[teNum++] = new Te(pos, jampto, pieceOfMoveto, true);
                        }
                      }
                      else if((turneos===0 && pos.dan<=2) || (turneos!==0 && pos.dan>=6)){//成り返り
                        if(!(koma==5 || (koma>=8 && koma<=16) || koma==21 || koma>=24)){//成り駒は成れない。
                          teBuf[teNum++] = new Te(pos, jampto, pieceOfMoveto, true);
                        }
                      }
                      teBuf[teNum++] = new Te(pos, jampto, pieceOfMoveto, false);
                    }  
                  }
                  else{//行けないなら終わり
                    captured = true;
                  }
                  
                  if(IsEnemyt(turneos, nBoard[jampto.dan][jampto.suji])){//敵駒の向こう側には行けない
                    captured = true;
                  }

                  far++;
                }

                continue;
              }
              else if((koma==1 && newpos.dan<=2) || (koma==17 && newpos.dan>=6)){//歩は敵陣で必ずなる
                teBuf[teNum++] = new Te(pos, newpos, pieceOfMoveto, true);
                continue;
              }
              else if((koma==3 && newpos.dan<=2) || (koma==19 && newpos.dan>=6)){//先手の桂馬なら1,2段目で必ず成る。後手の桂馬なら8,9段目で必ず成る。
                teBuf[teNum++] = new Te(pos, newpos, pieceOfMoveto, true);
                continue;
              }

              if((turneos===0 && newpos.dan<=2) || (turneos!==0 && newpos.dan>=6)){
                if(!(koma==5 || (koma>=8 && koma<=16) || koma==21 || koma>=24)){//金、王や成り駒は成れない。
                  teBuf[teNum++] = new Te(pos, newpos, pieceOfMoveto, true);
                }
              }
              else if((turneos===0 && pos.dan<=2) || (turneos!==0 && pos.dan>=6)){//成り返り
                if(!(koma==5 || (koma>=8 && koma<=16) || koma==21 || koma>=24)){//金、王や成り駒は成れない。
                  teBuf[teNum++] = new Te(pos, newpos, pieceOfMoveto, true);
                }
              }
              teBuf[teNum++] = new Te(pos, newpos, pieceOfMoveto, false);
            }
          }
        }
      })(i, j);
    }
  }

  //歩のある筋を記録
  var nihuSuji = new Array(8);
  for(var i=1; i<=7; i++) { nihuSuji[i] = false; }
  for(var i=1; i<=7; i++){
    for(var j=1; j<=7; j++){
      if(nBoard[j][i] == (turneos?17:1)){
        nihuSuji[i] = true;
      }
    }
  }

  //持ち駒を打つ手
  for(var id=0; id<8; id++){
    (function(id){
      if(nHand[turneos][id]){
        var pos = new Pos((turneos?0:10), id);
        for(var i=1; i<=7; i++){
          if(id==1 || id==2){//歩、香は1段目に打てない
            if(turneos===0 && i==1){ continue; }
            if(turneos!==0 && i==7){ continue; }
          }
          else if(id==3){//桂は1,2段目に打てない
            if(turneos===0 && i<=2){ continue; }
            if(turneos!==0 && i>=6){ continue; }
          }
          (function(i){
            for(var j=1; j<=7; j++){
              (function(j){
                if(id==1){
                  if(!nihuSuji[j]){
                    if(nBoard[i][j] == 0){ 
                      teBuf[teNum++] = new Te(pos, new Pos(i, j), 0, false);
                    }
                  }
                }
                else if(nBoard[i][j] == 0){ 
                  teBuf[teNum++] = new Te(pos, new Pos(i, j), 0, false);
                }
              })(j);
            }
          })(i);
        }
      }
    })(id);
  }

  return teNum;
}

function domove(turneos, move){//手を進める
  if(move.from.dan >=1 && move.from.dan <= 7){//手駒を打たないmove
    //駒をとる処理
    var pieceof_movetoPos = nBoard[move.to.dan][move.to.suji];
    if(IsEnemyt(turneos, pieceof_movetoPos)){//この判定いる??
      if(!turneos){ pieceof_movetoPos -= 16; }//後手番(nturn=1)なら取ったコマは先手のコマなのでそのまま。先手番ならコマidから16(=ENEMY)を引く
      if(pieceof_movetoPos>=9 && pieceof_movetoPos<=15){//成り駒なら退化させる
        pieceof_movetoPos -= 8; //8=PROMOTED
      }
      nHand[turneos][pieceof_movetoPos]++;
    }
    //駒の移動
    nBoard[move.to.dan][move.to.suji] = nBoard[move.from.dan][move.from.suji];
    nBoard[move.from.dan][move.from.suji] = 0;
    //成り
    if(move.promote){
      nBoard[move.to.dan][move.to.suji] += 8; //8:=PROMOTED
    }
  }
  else{//手駒を打つmove
    //駒の移動
    nBoard[move.to.dan][move.to.suji] = move.from.suji + (turneos?16:0);//16=ENEMY,手駒を打つmoveではsujiにコマのidが入っている
    nHand[turneos][move.from.suji]--;
  }
  
}

function undomove(turneos, move){//手を戻す
  var capturedPiece = move.capture;
  if(move.from.dan >=1 && move.from.dan <= 7){//手駒を打たないmove
    if(move.promote){
      nBoard[move.to.dan][move.to.suji] -= 8; //8:=PROMOTED
    }
    nBoard[move.from.dan][move.from.suji] = nBoard[move.to.dan][move.to.suji];
    nBoard[move.to.dan][move.to.suji] = capturedPiece;
    //取っていたコマをHandから削除
    if(capturedPiece===0) { return; }
    if(!turneos){ capturedPiece -= 16; }//先手番なら取ってたコマは後手のものなのでidに16(=ENEMY)を引く
    if(capturedPiece>=9 && capturedPiece<=15){//成り駒なら退化させる
      capturedPiece -= 8; //8=PROMOTED
    }
    nHand[turneos][capturedPiece]--;
  }
  else{//手駒を打つmove
    nHand[turneos][move.from.suji]++;
    nBoard[move.to.dan][move.to.suji] = 0;
  }
}

function Evaluation(turneos){//評価値を計算
  var Eval = 0;
  for(var y=1; y<=7; y++){
     for(var x=1; x<=7; x++){ 
       Eval += PieceValue[nBoard[y][x]]; 
    } 
  }
  
  for(var id=1; id<=7; id++){
    Eval += HandValue[id]*nHand[0][id];
    Eval -= HandValue[id]*nHand[1][id];
  }
  if(turneos) Eval *= -1;
  return Eval;
}

function Evaluation_s(turneos){//評価値を計算
  var Eval = 0;
  for(var y=1; y<=7; y++){
     for(var x=1; x<=7; x++){ 
       Eval += PieceValue[nBoard[y][x]]; 
       if(nBoard[y][x] == 8) { Eval += Math.abs(1 - x) * 10; }//玉pos X
       if(nBoard[y][x] == 24) { Eval -= Math.abs(7 - x) * 10; }//玉pos X
       if(nBoard[y][x] == 8) { Eval += Math.abs(7 - y) * 10; }//玉pos Y
       if(nBoard[y][x] == 24) { Eval -= Math.abs(1 - y) * 10; }//玉pos Y
       if(nBoard[y][x] == 1) { Eval += Math.abs(7 - y) * 10; }//歩の段
       if(nBoard[y][x] == 17) { Eval -= Math.abs(1 - y) * 10; }//歩の段
    } 
  }
  
  for(var id=1; id<=7; id++){
    Eval += HandValue[id]*nHand[0][id];
    Eval -= HandValue[id]*nHand[1][id];
  }
  if(turneos) Eval *= -1;
  return Eval;
}

function Evaluation_e(turneos){//評価値を計算
  var Eval = 0;
  for(var y=1; y<=7; y++){
     for(var x=1; x<=7; x++){ 
       Eval += PieceValue[nBoard[y][x]]; 
       if(nBoard[y][x] == 8) { Eval += Math.abs(7 - x) * 10; }//玉pos X
       if(nBoard[y][x] == 24) { Eval -= Math.abs(1 - x) * 10; }//玉pos X
       if(nBoard[y][x] == 8) { Eval += Math.abs(1 - y) * 10; }//玉pos Y
       if(nBoard[y][x] == 24) { Eval -= Math.abs(7 - y) * 10; }//玉pos Y
       if(nBoard[y][x] == 1) { Eval += Math.abs(1 - y) * 10; }//歩の段
       if(nBoard[y][x] == 17) { Eval -= Math.abs(7 - y) * 10; }//歩の段
    } 
  }
  
  for(var id=1; id<=7; id++){
    Eval += HandValue[id]*nHand[0][id];
    Eval -= HandValue[id]*nHand[1][id];
  }
  if(turneos) Eval *= -1;
  return Eval;
}

function qsearch(turneos, alpha, beta, BestMove){
  if(!turn_swich){ var retVal = Evaluation_s(turneos); }
  else{ var retVal = Evaluation_e(turneos); }
  
  if(retVal > beta) { return retVal; }

  var LegalMove = [];
  var teNum = 0;
  teNum = MakeMoves(turneos, teNum, LegalMove);
  if(teNum===0){//合法手0は負け
    return -571000;
  }
  if(nHand[turneos?0:1][8]){//玉がとられた局面より先は読まない
    return -108888;
  }
  if(nHand[turneos][8]){//玉をとった局面は勝ち
    return 108888;
  }
  
  var value = new Array(600);
  for(var i=0; i<teNum; i++) { value[i] = -1000000; }
  var capMoveNum = 0;
  for(var i=0; i<teNum; i++){
    if(LegalMove[i].capture === 0) { continue; }
    (function(i){
      capMoveNum++;
      //value[i] = (LegalMove[i].capture - (turneos?16:0)) << ((turneos?24:8) - nBoard[LegalMove[i].from.dan][LegalMove[i].from.suji]);
      value[i] = Math.abs(PieceValue[LegalMove[i].capture]) - Math.abs(PieceValue[nBoard[LegalMove[i].from.dan][LegalMove[i].from.suji]]);
      //console.log(LegalMove[i].capture+' '+nBoard[LegalMove[i].from.dan][LegalMove[i].from.suji]);
      //console.log(value[i]);
    })(i);
  }
  
  for(var i=0; i<capMoveNum; i++){
    (function(i){
      var maxv = value[i];
      var maxid = i;
      for(var j=i+1; j<teNum; j++){
        if(LegalMove[j].capture === 0) { continue; }
        (function(j){
          if(value[j] > maxv){
            maxv = value[j];
            maxid = j;
          }
        })(j);
      }
      value[maxid] = [value[i], value[i] = value[maxid]][0];
      LegalMove[maxid] = [LegalMove[i], LegalMove[i] = LegalMove[maxid]][0];
    })(i);
  }
  
  var childBestMove = new Te(new Pos(0,0), new Pos(0,0), 0, false);

  var cutted = false;//αβで打ち切られたらtrue
  for(var i=0; i<teNum; i++){
    if(!LegalMove[i].capture) { continue; }
    (function(i){
      var move = LegalMove[i];
      searchNum++;
      domove(turneos, move);
      var tempVal = -qsearch(turneos?0:1, -beta, -Math.max(retVal, alpha), childBestMove);
      undomove(turneos, move);
      if(tempVal > retVal){
        BestMove = move;
        retVal = tempVal;
      }
      cutted = false;
      if(retVal >= beta){
        cutNum++;
        cutted = true;
      }
    })(i);
    if(cutted){ break; }
  }

  return retVal;
}

function AlphaBeta(turneos, depth, depthMax, alpha, beta, BestMove){
  if(depth === depthMax){
    //return Evaluation(turneos);
    return qsearch(turneos, alpha, beta, BestMove);
  }

  var LegalMove = [];
  var teNum = 0;
  teNum = MakeMoves(turneos, teNum, LegalMove);
  if(teNum === 0){//合法手0は負け
    return -571000;
  }
  if(nHand[turneos?0:1][8]){//玉がとられた局面より先は読まない
    return -108888;
  }
  if(nHand[turneos][8]){//玉をとった局面は勝ち
    return 108888;
  }

  var childBestMove = new Te(new Pos(0,0), new Pos(0,0), 0, false);
  var retVal = -888888;

  var cutted = false;//αβで打ち切られたらtrue
  for(var i=0; i<teNum; i++){
    (function(i){
      var move = LegalMove[i];
      searchNum++;
      depNum[depth]++;
      domove(turneos, move);
      var tempVal = -AlphaBeta(turneos?0:1, depth+1, depthMax, -beta, -Math.max(retVal, alpha), childBestMove);
      undomove(turneos, move);
      if(tempVal > retVal){
        BestMove = move;
        retVal = tempVal;
      }
      cutted = false;
      if(retVal >= beta){
        cutNum++;
        cutted = true;
      }
    })(i);
    if(cutted){ break; }
  }

  if(depth===0){
    domove(turneos, BestMove);
    postMove = BestMove;
    console.log('最善手: (' + BestMove.from.dan + ',' + BestMove.from.suji + ') → (' + BestMove.to.dan + ',' + BestMove.to.suji + ') cap: ' + BestMove.capture + ', pro: ' + BestMove.promote + ', eval: ' + retVal);    
  }
  return retVal;
}


module.exports = router;