var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    data = {
        title: 'battle',
        vslog: [],
    };
    res.render('battle', data);
});

router.post('/', function(req, res, next) {
    var temp = req.body.para;
    var tempv = 2;

    var Board = new Array(3);
    for(var i=0; i < Board.length; i++){
        Board[i] = new Array(-1, -1, -1);
    }
    var finished = false;
    var wfcheck = -1;
    var looked = false;
    var vslog = [];
    var turn = 1;

    for(var it=0; it<1000; it++) {
        //console.log(turn);
        looked = false;
        for(var i=0; i<3; i++){
            for(var j=0; j<3; j++){
                if(Board[i][j] !== -1) {continue;}
                Board[i][j] = turn;
                turn = 1 - turn;
                looked = true;
                vslog.push(turn + 'の人: ' + i + ',' + j);
                break;
            }
            if(looked) {break;}
        }

        for(var y=0; y<3; y++){
            if(Board[y][0] === 1 && Board[y][1] === 1 && Board[y][2] === 1){
                finished = true;
                wfcheck = 1;
            }
            if(Board[y][0] === 0 && Board[y][1] === 0 && Board[y][2] === 0){
                finished = true;
                wfcheck = 0;
            }
        }

        for(var x=0; x<3; x++){
            if(Board[0][x] === 1 && Board[1][x] === 1 && Board[2][x] === 1){
                finished = true;
                wfcheck = 1;
            }
            if(Board[0][x] === 0 && Board[1][x] === 0 && Board[2][x] === 0){
                finished = true;
                wfcheck = 0;
            }
        }
        
        //console.log('判定は' + wfcheck);

        if(Board[0][0] === 1 && Board[1][1] === 1 && Board[2][2] === 1){
            finished = true;
            wfcheck = 1;
        }
        if(Board[0][0] === 0 && Board[1][1] === 0 && Board[2][2] === 0){
            finished = true;
            wfcheck = 0;
        }

        if(Board[0][2] === 1 && Board[1][1] === 1 && Board[2][0] === 1){
            finished = true;
            wfcheck = 1;
        }
        if(Board[0][2] === 0 && Board[1][1] === 0 && Board[2][0] === 0){
            finished = true;
            wfcheck = 0;
        }

        if(finished){
            break;
        }
    }

    data = {
        title: wfcheck,
        vslog: vslog,
    };
    res.render('battle', data);
  })

module.exports = router;
