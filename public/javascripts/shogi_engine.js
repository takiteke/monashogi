var sashite = [];
var tesuu = 0;
var msg = '';

var Board = [
    [64,64,64,64,64,64,64,64,64],
    [64,19,20,21,24,21,20,18,64],
    [64,17,23, 0, 0, 0,22,17,64],
    [64, 0,17,17,17,17,17, 0,64],
    [64, 0, 0, 0, 0, 0, 0, 0,64],
    [64, 0, 1, 1, 1, 1, 1, 0,64],
    [64, 1, 6, 0, 0, 0, 7, 1,64],
    [64, 2, 4, 5, 8, 5, 4, 3,64],
    [64,64,64,64,64,64,64,64,64],];
var Hand = [ //手駒 Hand[0]は先手
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],];
var turn = 0;//0は先手

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
  var ans = true;
  if (turneos==0) {
    ans = IsEnemy(piece_id);
  } else {
    ans = IsSelf(piece_id);
  }
  return ans;
}
function IsSelft(turneos, piece_id){
  var ans = true;
  if (turneos==0) {
    ans = IsSelf(piece_id);
  } else {
    ans = IsEnemy(piece_id);
  }
  return ans;
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
var CanGo = [
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
var CanJamp = [
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

//合法手生成
function CanMoves(turneos, ppos, teNum, teBuf){
  //王手がかかっているとき
  
  //王手がかかっていないとき
  console.log(ppos);
  var pos = ppos;
  if(pos.dan>=1 && pos.dan<=7){
    if(IsSelft(turneos, Board[pos.dan][pos.suji])){
      var koma = Board[pos.dan][pos.suji];
      
      for(var dir=0; dir<12; dir++){
        var newpos = new Pos(pos.dan+Direction[dir].dan, pos.suji+Direction[dir].suji);
        if(CanGo[dir][koma] && (IsEnemyt(turneos, Board[newpos.dan][newpos.suji]) || Board[newpos.dan][newpos.suji] == 0)){
          var pieceOfMoveto = Board[newpos.dan][newpos.suji];
            
          if(CanJamp[dir][koma]){
            var captured = false;
            var far = 0;
            while(!captured){
              var jampto = new Pos(newpos.dan+far*Direction[dir].dan, newpos.suji+far*Direction[dir].suji);
              
              if(IsEnemyt(turneos, Board[jampto.dan][jampto.suji]) || Board[jampto.dan][jampto.suji] == 0){
                pieceOfMoveto = Board[jampto.dan][jampto.suji];
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
                
              if(IsEnemyt(turneos, Board[jampto.dan][jampto.suji])){//敵駒の向こう側には行けない
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
  }
  else{
    //歩のある筋を記録
    var nihuSuji = new Array(8);
    for(var i=1; i<=7; i++) { nihuSuji[i] = false; }
    for(var i=1; i<=7; i++){
      for(var j=1; j<=7; j++){
        if(Board[j][i] == (turneos?17:1)){
          nihuSuji[i] = true;
        }
      }
    }

    //持ち駒を打つ手
    var id = ppos.suji;
    if(Hand[turneos][id]){
      var pos = new Pos((turneos===0?10:0), id);
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
                  if(Board[i][j] == 0){ 
                    teBuf[teNum++] = new Te(pos, new Pos(i, j), 0, false);
                  }
                }
              }
              else if(Board[i][j] == 0){ 
                teBuf[teNum++] = new Te(pos, new Pos(i, j), 0, false);
              }
            })(j);
          }
        })(i);
      }
    }
  }
  

  return teNum;
}

function realize(turneos, move){//htmlに反映させる
  var fromID = move.from.dan.toString() + move.from.suji.toString();
  var toID = move.to.dan.toString() + move.to.suji.toString();

  if(move.from.dan >=1 && move.from.dan <= 7){//手駒を打たないmove
    //駒をとる処理
    var pieceof_movetoPos = Board[move.to.dan][move.to.suji];
    if(IsEnemyt(turneos, pieceof_movetoPos)){//この判定いる??
      if(!turneos){ pieceof_movetoPos -= 16; }//後手番(nturn=1)なら取ったコマは先手のコマなのでそのまま。先手番ならコマidから16(=ENEMY)を引く
      if(pieceof_movetoPos>=9 && pieceof_movetoPos<=15){//成り駒なら退化させる
        pieceof_movetoPos -= 8; //8=PROMOTED
      }
      if(Hand[turneos][pieceof_movetoPos] == 0){
        var capID = ((turneos?0:100) + pieceof_movetoPos).toString();
        document.getElementById(capID).src = "/images/piece" + (pieceof_movetoPos + (turneos?16:0)) + ".png";
      }
      Hand[turneos][pieceof_movetoPos]++;
    }
    //駒の移動
    document.getElementById(toID).src = "/images/piece" + (Board[move.from.dan][move.from.suji] + (move.promote?8:0)) + ".png";
    document.getElementById(fromID).src = "/images/piece0.png";
    Board[move.to.dan][move.to.suji] = Board[move.from.dan][move.from.suji] + (move.promote?8:0);
    Board[move.from.dan][move.from.suji] = 0;
  }
  else{//手駒を打つmove
    //駒の移動
    var dropID = ((turneos?0:100) + move.from.suji).toString();
    document.getElementById(toID).src = "/images/piece" + (move.from.suji + (turneos?16:0)) + ".png";
    document.getElementById(dropID).src = "/images/piece0.png";
    Board[move.to.dan][move.to.suji] = move.from.suji + (turneos?16:0);//16=ENEMY,手駒を打つmoveではsujiにコマのidが入っている
    Hand[turneos][move.from.suji]--;
  }
}
function back_realize(turneos, move){//手を戻す
  var fromID = move.from.dan.toString() + move.from.suji.toString();
  var toID = move.to.dan.toString() + move.to.suji.toString();
  var capturedPiece = move.capture;
  if(move.from.dan >=1 && move.from.dan <= 7){//手駒を打たないmove
    if(move.promote){
      Board[move.to.dan][move.to.suji] -= 8; //8:=PROMOTED
    }
    document.getElementById(fromID).src = "/images/piece" + (Board[move.to.dan][move.to.suji]) + ".png";
    document.getElementById(toID).src = "/images/piece" + move.capture + ".png";
    Board[move.from.dan][move.from.suji] = Board[move.to.dan][move.to.suji];
    Board[move.to.dan][move.to.suji] = capturedPiece;
    //取っていたコマをHandから削除
    if(capturedPiece===0) { return; }
    if(!turneos){ capturedPiece -= 16; }//先手番なら取ってたコマは後手のものなのでidに16(=ENEMY)を引く
    if(capturedPiece>=9 && capturedPiece<=15){//成り駒なら退化させる
      capturedPiece -= 8; //8=PROMOTED
    }
    var capID = ((turneos?0:100) + capturedPiece).toString();
    Hand[turneos][capturedPiece]--;
    if(Hand[turneos][capturedPiece] == 0){
      document.getElementById(capID).src = "/images/piece0.png";
    }
  }
  else{//手駒を打つmove
    var dropID = ((turneos?0:100) + move.from.suji).toString();
    Hand[turneos][move.from.suji]++;
    if(Hand[turneos][move.from.suji] != 0){
      document.getElementById(dropID).src = "/images/piece" + (move.from.suji + (turneos?16:0)) + ".png";
    }
    Board[move.to.dan][move.to.suji] = 0;
    document.getElementById(toID).src = "/images/piece0.png";
  }
}

/*
function loadBoard(b11,b12,b13,b14,b15,b16,b17,b21,b22,b23,b24,b25,b26,b27,b31,b32,b33,b34,b35,b36,b37,b41,b42,b43,b44,b45,b46,b47,b51,b52,b53,b54,b55,b56,b57,b61,b62,b63,b64,b65,b66,b67,b71,b72,b73,b74,b75,b76,b77){
  var nBoard = [b11,b12,b13,b14,b15,b16,b17,b21,b22,b23,b24,b25,b26,b27,b31,b32,b33,b34,b35,b36,b37,b41,b42,b43,b44,b45,b46,b47,b51,b52,b53,b54,b55,b56,b57,b61,b62,b63,b64,b65,b66,b67,b71,b72,b73,b74,b75,b76,b77];
  for(var i=1; i<=7; i++){
    for(var j=1; j<=7; j++){
      Board[i][j] = parseInt(nBoard[(i-1)*7+j-1]);
    }
  }
}

function loadHand(h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12,h13,h14,h15,h16,h17,h18){
  var nHand = [h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12,h13,h14,h15,h16,h17,h18];
  for(var i=0; i<2; i++){
    for(var j=0; j<9; j++){
      Hand[i][j] = parseInt(nHand[i*9+j]);
    }
  }
  //相手が自玉をとっていたら負け
  if(Hand[turn?0:1][8]){ alert('cpuの勝ち!!'); }
}*/

var nowtesuu = 0;
var teban = 0;
var playing = 0;
function play(){
  console.log(nowtesuu + '～' + tesuu);
  for(var i=nowtesuu; i<tesuu; i++){
    (function(i){
      realize(teban, sashite[i]);
      teban = teban?0:1;
    })(i);
  }
  nowtesuu = tesuu;
  playing = nowtesuu;
  //sashite.forEach(function(value){
  //  realize(teban, value);
  //  teban = teban?0:1;
  //});
}

//グローバル変数
var LegalMoveList = [];
var LegalMoveNum = 0;

function mdevent(num){
  var imgElement = document.getElementById(""+num);
  var pickPosX;
  var pickPosY;

  imgElement.onclick = function(ec){
    //clickしたマスを取得する
    var clPosX = parseInt(ec.pageX) - 84;
    var clPosY = parseInt(ec.pageY) - 194;
    console.log('clPos: (' + clPosX + ',' + clPosY + ')');
    pickPosX = Math.floor(clPosX/70 + 1);
    pickPosY = Math.floor(clPosY/70 + 1);
    console.log('pickPos: (' + pickPosX + ',' + pickPosY + ')');
    //console.log('pick駒: ' + Board[pickPosY][pickPosX]);

    //既にpickしてたら2回目は移動判定
    for(var i=0; i<LegalMoveNum; i++){
      if(LegalMoveList[i].to.dan == pickPosY && LegalMoveList[i].to.suji == pickPosX){
        if(LegalMoveList[i].capture == (turn?8:24)){ alert('プレイヤーの勝利!!'); }//相手の玉をとったら勝利
        realize(turn, LegalMoveList[i]);

        //サーバーに状況をPOST
        var form = document.createElement('form');
        form.method = 'post';
        form.action = '/';
        var inputB = document.createElement('input');
        var inputH = document.createElement('input');
        var inputT = document.createElement('input');
        inputB.type = 'hidden'; inputB.name = 'Board'; inputB.value = Board;
        inputH.type = 'hidden'; inputH.name = 'Hand'; inputH.value = Hand;
        inputT.type = 'hidden'; inputT.name = 'turn'; inputT.value = (turn?0:1);
        form.appendChild(inputB);
        form.appendChild(inputH);
        form.appendChild(inputT);
        document.body.appendChild(form);
        form.submit();

        break;
      }
    }
    LegalMoveNum = 0;
    LegalMoveList = [];

    //移動可能マスを表示
    var pickPos = new Pos(pickPosY, pickPosX);
    LegalMoveNum = CanMoves(turn, pickPos, LegalMoveNum, LegalMoveList);
    console.log('合法手の数: ' + LegalMoveNum);
    for(var i=0; i<LegalMoveNum; i++){
      console.log('(' + LegalMoveList[i].from.dan + ',' + LegalMoveList[i].from.suji + ') → (' + LegalMoveList[i].to.dan + ',' + LegalMoveList[i].to.suji + ') cap: ' + LegalMoveList[i].capture + ', pro: ' + LegalMoveList[i].promote);
    }
  }
}