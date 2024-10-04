
class SameGame {
    //To do
    // colorschema picker?
    // load seed via menu?

    constructor(w, h, n, s, m){
        this.screenwidth = screen.width;
        this.left_adj = 0;
        this.responsive = false
        this.width = w; //amount of squares per row
        this.height = h; //amount of squares per col
        this.variation = n > 8 ? 8 : n; //amount of colors, max 8
        this.square_size = s; //size of each square in px
        this.update = true
        this.score = 0;
        this.colorspick;
        this.mode = m
        this.total_extra_time = 0;
        this.error_tolerance_level = w*h*10;
        this.timer = 0;
        this.addtime = 1;
        this.stoptime = true;
        this.border_highlight = "2px solid white"; //"2px dashed #cccccc"
        this.gameisrunning = false;
        this.seedData = []
        this.colorspick = []
        this.squares = this.CreateMap()
        this.stats = {
            "group_sizes_cleared" : [],
            "highest_combo_scored" : 0,
            "squares_per_color_cleared" : [],
            "Score" : 0,
            "total_squares_cleared" :0,
            "elapsed_time" : 0,
            "difficulty" : ""
        }
        this.difficulty_level = ["", "", "Very Easy", "Beginner", "Novice", "Intermediate", "Expert", "Master", "Grand Master", "Impossible"]
    }

    CreateMap(){
        
        let game_width = this.square_size*this.width
        this.left_adj = (this.screenwidth - game_width) / 2 - ((this.square_size*this.height) / 2);

        $("#samegamefield").css('height', (this.square_size*this.height) + "px");
        $("#samegamefield").css('width', game_width + "px");
        //$("#samegamefield").css('left', this.left_adj + "px");
        //green, orange, blue, magentha, aqua, purple, red, teal
        let _board = []
        for (let r = 0; r < this.height; r++){
            _board[r]= []
            for (let c = 0; c < this.width; c++){
                let colorpicked = this.colorspick[getRandomInt(this.variation)]
                _board[r].push(colorpicked)
            }
        }
        return _board
    }

    UpdateTimer(sec){
        sec = Math.round(sec + 0)
        this.addtime+= sec
    }

    StopTimer(){
        this.timer = 0
        this.stoptime = true
    }

    SetColorScheme(colors){
        try {
            if (colors.length != 10){
                throw new Error('not enough colors avaialble.');
            }
            this.colorspick = colors
        }
        catch (error) {
            this.SetColorScheme(["2BAF10","AF8C10","2D70BC","C0269C","26B8C0","6E26C0","8F1A1A","1A8F89","FFFF00","C0FFEE"])
            //throw new Error('Invalid color set provided.');
        }
    }

    Toggle_ResponsiveMode(){
        //get height, subtract 50 (menu) from it
        this.responsive = !this.responsive
        if (this.responsive) {
            let flex_height = window.innerHeight - 85;
            let flex_width = window.innerWidth - 85;
            if (flex_height < 400) {
                throw new Error('Screen height too small.');
            }
            
            $(".ufld").css('height', flex_height + "px");
            $(".ufld").css('width', flex_width + "px");
            this.square_size = Math.round($('#BlockSize').val());

            this.width = Math.floor(flex_width / this.square_size)
            this.height = Math.floor(flex_height / this.square_size)
            console.log(this.width, this.height)
        }

    }

    StartTimer() {
        let timer = this.timer = 30
        let self = this;
        if (this.gameisrunning) {
            this.gameisrunning = false
            return false;
        }
        else {
            this.gameisrunning = true
        }
        this.stoptime = false
        let go = function tick() {
            if (self.mode != 2){
                $("#timer").html("");
                if (typeof onEnd === "function") onEnd.call(self);
                return false;
            }
            if (!self.gameisrunning){
                timer = 0
                if (typeof onEnd === "function") onEnd.call(self);
                return false;
            }
            //self.gameisrunning = true
            
            if (timer == 0 && self.gameisrunning) {
                gameover()
                if (typeof onEnd === "function") onEnd.call(self);
                self.gameisrunning = false
                self.stoptime = true
                return false;
            }

            if (self.addtime != 0) {
                timer+=self.addtime
                self.addtime = 0;
            }
            timer--;
            if (timer >= 30){
                $("#timer").html("<span style='color:white'>"+toHHMMSS(timer)+"</span>");
            }
            else{
                $("#timer").html("<span style='color:red'>"+toHHMMSS(timer)+"</span>");
            }

            if (typeof onTick === "function") onTick.call(self);
            window.setTimeout(tick, 1000);
        }

        go()
    }

    SetTimer(stime=30){
        this.timer = stime;
    }


    Reload(square_size) {
        let map_hold = this.CreateSeed();
        this.LoadSeed(map_hold, false, square_size)
    }

    CreateSeed(){
        let churro = ""
        let previous_color_index;
        let colorcounter= 0
        let churro_ = ""
        let finalc = this.colorspick.indexOf(this.squares[this.height-1][this.width-1])
        //
        for (let r = 0; r < this.squares.length; r++){
            for (let c = 0; c < this.squares[r].length; c++){
                let colorIndex = this.colorspick.indexOf(this.squares[r][c])

                colorcounter++
                if (colorIndex != previous_color_index) {
                    let repeatcolorcounter = Math.floor(colorcounter / 9);
                    let fstr = ""
                    let t_str = "9"+previous_color_index
                    
                    fstr += t_str.repeat(repeatcolorcounter)
                    let finalcounter = colorcounter - (repeatcolorcounter*9)
                    
                    fstr+= finalcounter+""+previous_color_index
                    if (previous_color_index !== undefined){
                        churro+=fstr
                    }
                    colorcounter = 0
                    previous_color_index = colorIndex;
                }
                
                churro_ = (colorcounter+1)+""+finalc
            }
        }
        churro = churro + "" + churro_ + "" + "" + pad(this.width, 3) + "" + pad(this.height, 3) + "" + pad(this.variation, 3) + "" + pad(this.square_size, 3) + "" + pad(this.mode, 3)
        churro = sg_compress(churro)
        return churro
    }

    LoadSeed(seed, reset = true, sq = null) {
        seed = sg_decompress(seed)
        try{
            let a, b, c, d, e, seedData, squaresize
            [a, b, c, d, e] = seed.substring(seed.length - 15).match(/.{1,3}/g)
            seedData = seed.substring(0, seed.length - 15).match(/.{1,2}/g)      
            let width = Math.round(a)
            let height = Math.round(b)
            let variation = Math.round(c)
            if (!sq){
                squaresize = Math.round(d)
            }
            else {
                squaresize = sq
            }
            let mode = Math.round(e)
            let mappedData = []
            let outputData = []
            let colct = 0
            //let cells = seed.substring(0, seed.lastIndexOf("R")).match(/.{1,4}/g)
            for (let s in seedData) { 
                let _s = seedData[s].split("")
                let colormap = _s[1]
                let colorct = _s[0]
                
                if (colormap > this.colorspick) {
                    //throw new Error('Invalid Seed data');
                }   
                colct++
                //console.log("Create "+colorct+" "+this.colorspick[colormap])
                for (let h = 0; h < colorct; h++){
                    mappedData.push(this.colorspick[colormap])
                }

            }
            
            if (mappedData.length != (width*height)){
                throw new Error('Invalid Seed data');
            }
            for (let i = 0; i < mappedData.length; i += width) {
                outputData.push(mappedData.slice(i, i + width));
            }
            
            if (reset){
            this.score = 0;
            this.UpdateScore();
            this.mode = mode
            this.variation = variation
            this.width = width
            this.height =  height
            this.stats = {
                "group_sizes_cleared" : [0,0],
                "highest_combo_scored" : 0,
                "squares_per_color_cleared" : [],
                "total_squares_cleared" : 0
            }


            }
            this.square_size = Math.round(squaresize)
            this.squares = outputData
            $("#samegamefield").css('height', (this.square_size * this.height) + "px");
            $("#samegamefield").css('width', (this.square_size * this.width) + "px");

            this.DrawMap()

            return true
        }
        catch (error) {
            throw new Error('Invalid Seed data');
        }
        
    }

    DrawMap() { 
        $("#samegamefield").empty()
        if (this.update){
            $("#samegamefield").css('height', (this.square_size*this.height) + "px");
            $("#samegamefield").css('width', (this.square_size*this.width) + "px");
            $(".ufld").css('height', (this.square_size * this.height) + "px");
            $(".ufld").css('width', (this.square_size * this.width) + "px");
            this.update = false
        }
        let _x_pos = 0
        let _y_pos = 0
        
        for (var r = 0; r <= this.squares.length - 1; r++){
            for (let c = 0; c <= this.squares[r].length-1; c++){
                let e = ""
                let _left = Math.round(_x_pos)
                if (this.squares[r][c] != null) {
                    
                    //let _left = Math.round(_x_pos) + 12 + this.left_adj
                    e = $('<div id="' + _x_pos + '_' + _y_pos + '" class="box" style="width:' + (this.square_size - 4) + 'px; height:' + (this.square_size - 4) + 'px; top:' + (_y_pos) + 'px;float:left;left:' + _left + 'px;background-color:#' + this.squares[r][c] + ';border-top: 2px solid #' + this.squares[r][c] + '; border-right: 2px solid #' + this.squares[r][c] + '; border-bottom: 2px solid #' + this.squares[r][c] + '; border-left: 2px solid #' + this.squares[r][c] + ';border-radius: 20%;"></div>');
                    $("#samegamefield").append(e)
                }
                else {
                    //let _left = Math.round(_x_pos) + 12 + this.left_adj
                    e = $('<div id="' + _x_pos + '_' + _y_pos + '" class="ebox" style="width:' + (this.square_size - 4) + 'px; height:' + (this.square_size - 4) + 'px; top:' + (_y_pos) + 'px;float:left;left:' + _left + 'px;background-color:#000000; border: 2px solid gray;"></div>');
                    $("#samegamefield").append(e)
                }
                
                _x_pos += this.square_size
            }
            _x_pos = 0
            _y_pos +=  this.square_size
        }
        try {
            this.CheckMovesLeft()
        }
        catch (error) {
            throw new Error('Unable to draw map!');
        }
    }

    NewGame(){
        $("#timer").hide()
        this.StopTimer()
        this.timer = 0
        this.score = 0;
        this.UpdateScore();
        this.mode = $('input[name="gamemode"]:checked').val();
        this.variation = Math.round($('#variation').val());
        if (!this.responsive) {
            this.width = Math.round($('#Width').val());
            this.height = Math.round($('#Height').val());
        }
        if (this.mode == 2) {
            console.log("boo")
            this.total_extra_time = 0;
            this.variation = 4;
            $("#timer").show()
            this.StartTimer();
            //this.StartTimer()
        }

        this.stats = {
            "group_sizes_cleared" : [0,0],
            "highest_combo_scored" : 0,
            "squares_per_color_cleared" : [],
            "total_squares_cleared" : 0
        }
        this.square_size = Math.round($('#BlockSize').val());
        this.squares = this.CreateMap()
        this.DrawMap()

        $("#current_seed").html(this.CreateSeed())

    }


    GetSquare_(cell){
        let pos;
        try {
            pos = cell.split("_")
            console.log(pos[1] /this.square_size +","+ pos[0]/this.square_size)
            console.log(this.squares[(pos[1]/this.square_size)][(pos[0] /this.square_size)])
            this.squares[pos[1] /this.square_size][pos[0]/this.square_size] = null
            this.squares = this.ReOrderSquares();
            this.squares = this.ReOrderSquares();
            if (this.squares != null) {
                
                this.DrawMap();
            }
            else {
                this.update = true
                $("#samegamefield").empty()
                console.log("2x BONUS FOR CLEARING map!")
            }

        }
        catch (error) {
            console.log(error)
        }
    }

    CheckMovesLeft() {
        //loop through  this.squares
        //loop through this.squares[]
        if (!this.squares){
            return false
        }
        let squarecounter = 0
        
        for (var row = 0; row <= this.squares.length-1; row++){
            for (let col = 0; col <= this.squares[row].length-1; col++){
        // check for each square if anything is attached, first time this is true, return true.
                let pos;
                let collector = []
                collector.push(col*this.square_size+"_"+row*this.square_size) 

                let colorsearch= this.squares[row][col]

                if (!colorsearch || colorsearch == null){
                    continue
                }
                squarecounter++
                try {
                    

                    for (let c = 0; c < collector.length; c++){
                        if (collector.length > this.error_tolerance_level){
                            console.log(collector)
                            throw new Error('Something is broken!');
                        }
                        pos = collector[c].split("_")
                        let current_x = (pos[0]/this.square_size)
                        let current_y = (pos[1]/this.square_size)
                        //check Left: _x -1
                        if ((current_x - 1) >= 0){
                            if (this.squares[current_y][(current_x - 1)] == colorsearch){
                                let t_val = (current_x-1)*this.square_size+"_"+(current_y)*this.square_size
                                if (!collector.includes(t_val)){
                                    //modify border to add top.
                                    collector.push(t_val)
                                }
                            }
                        }
                        //end check Left

                        //check Right: _x + 1
                        if ((current_x + 1) <= this.squares[current_y].length){
                            if (this.squares[current_y][(current_x + 1)] == colorsearch){
                                let t_val = (current_x+1)*this.square_size+"_"+(current_y)*this.square_size
                                if (!collector.includes(t_val)){
                                    collector.push(t_val)
                                }
                            }
                        }
                        //end check right

                        //check Above: _y - 1
                        if ((current_y - 1) >= 0){
                            if (this.squares[current_y-1][(current_x)] == colorsearch){
                                let t_val = (current_x)*this.square_size+"_"+(current_y-1)*this.square_size
                                if (!collector.includes(t_val)){
                                    collector.push(t_val)
                                }

                            }
                        }
                        //end check above

                        //check Below: _y + 1
                        if ((current_y+1) < this.squares.length){
                            if (this.squares[current_y+1][(current_x)] == colorsearch){
                                let t_val = (current_x)*this.square_size+"_"+(current_y+1)*this.square_size
                                if (!collector.includes(t_val)){
                                    collector.push(t_val)
                                }
                            }
                        }
                        //end check below

                            
                    }
                }
                catch (error) {
                    throw new Error('Invalid Map data!');
                }
                if (collector.length > 1){
                    return true
                }                           
            }

        }
        
        return false
       
    }

    UpdateScore(){
        $("#score").html(this.score)
    }

    GetSquare(cell){
        let cells = this.HighLight(cell)
        let pop_pos = cell.split("_")
        let selectedColor = ""
        try {
            if (cells.length > 1) {
                //Math.pow(7, 3)  -> 7*7*7
                for (let c in cells){
                    let pos = cells[c].split("_")
                    selectedColor = this.squares[pos[1] /this.square_size][pos[0]/this.square_size]
                    this.squares[pos[1] /this.square_size][pos[0]/this.square_size] = null
                }
                this.squares = this.ReOrderSquares();
                this.squares = this.ReOrderSquares();
                
                //cells.length
                let points = Math.pow(cells.length, 2)
                this.score+= points
                let _left = Math.round(pop_pos[0])+ this.left_adj
                if (this.mode == 2){
                    //need to figure out time to add here..
                    let extratime = Math.floor(2.5529* Math.exp(0.1711 * Math.floor(cells.length / 4))) - 1 //too much
                    this.total_extra_time+= extratime;
                    //every 3 minutes of extra time?
                    let current_difficulty = this.variation 
                    switch(Math.floor(this.total_extra_time / 180)) {
                        case 0:
                            //up to 3 mins:
                            this.variation = 4
                            break;
                        case 1:
                            //3-6 mins:
                            this.variation = 5
                            break;
                        case 2:
                            //6-9 mins:
                            this.variation = 6
                            break;
                        case 3:
                            //9-12 mins:
                            this.variation = 7
                            break;
                            break;
                        case 4:
                            //12-15 mins:
                            this.variation = 8
                            break;
                        default:
                            //15+ mins:
                            this.variation = 9
                            break;
                          // code block
                      }

                      if (this.variation > current_difficulty){
                        var xdeleteMe = $("<div class='scorepop' style='position:fixed;width:350px;top:20px;color:white;'>Difficulty Increased!</div>").appendTo("#timer");
                        xdeleteMe.animate({'marginLeft' : "+=150px"}).fadeTo(10000, 0.01, function(){ 
                            
                                $(this).remove(); 
                            
                        });
                      }
                    //let extratime = Math.floor(cells.length / 4) //points for every 4 blocks
                    
                    if (extratime > 0 && cells.length > 2){
                        this.UpdateTimer(extratime)

                        var tdeleteMe = $("<div class='scorepop' style='position:fixed;top:20px'>+"+extratime+"s</div>").appendTo("#timer");
                        tdeleteMe.animate({'marginLeft' : "+=50px"}).fadeTo(250, 0.01, function(){ 
                            $(this).slideUp(150, function() {
                                $(this).remove(); 
                            }); 
                        });
                    }

                }

                
                var deleteMe = $("<div class='scorepop' style='position:fixed;left: "+_left+"px;top: "+pop_pos[1]+"px;'>+"+points+"</div>").appendTo("#message_box");
                deleteMe.animate({'marginTop' : "-=50px"}).fadeTo(1000, 0.01, function(){ 
                    $(this).slideUp(150, function() {
                        $(this).remove(); 
                    }); 
                });


                this.stats.total_squares_cleared+= cells.length
                
                if  (!this.stats.group_sizes_cleared[cells.length]){
                    this.stats.group_sizes_cleared[cells.length] = 1
                }
                else {
                    this.stats.group_sizes_cleared[cells.length]++
                }

                if  (!this.stats.squares_per_color_cleared[selectedColor]){
                    this.stats.squares_per_color_cleared[selectedColor] = cells.length
                }
                else {
                    this.stats.squares_per_color_cleared[selectedColor]+= cells.length
                }
                this.stats.score = this.score
                this.stats.elapsed_time = Math.round(this.total_extra_time) + 30;
                this.stats.difficulty = this.difficulty_level[this.variation - 1];

                this.stats.highest_combo_scored = (points > this.stats.highest_combo_scored) ? points : this.stats.highest_combo_scored;
                    
            }
            let movesLeft = this.CheckMovesLeft()
            if (this.squares != null) {
                if(movesLeft){
                    this.DrawMap();
                }
                else{
                    console.log("GAME OVER!")
                    this.update = true
                    this.DrawMap();
                    gameover()
                }
            }
            else {
                this.update = true
                $("#samegamefield").empty()
                this.score*= 2
                this.stats.score = this.score
                this.UpdateScore()
                gameover()
                var deleteMe = $("<div class='scorepop' style='position:relative;width:500px;top:250px;margin-left:auto;margin-right:auto'>GAME OVER! 2x BONUS FOR CLEARING map!</div>").appendTo("#message_box");
                deleteMe.animate({'marginTop' : "-=50px"}).fadeTo(5000, 0.01, function(){ 
                    $(this).slideUp(150, function() {
                        $(this).remove(); 
                    }); 
                });
               
            }
            this.UpdateScore()
        }
        catch (error) {
            console.log(this.squares)
            console.log(error)
        }

    }
    
    
    ReOrderSquares() {   
        let _apex = []
        let _dpex = []
        if (this.squares.length == 0){
            return null
        }
        //pivot rows to cols to move all null values up
        _apex = transpose(this.squares) 
        
        let fldsize = _apex.length
        
        for (let _q in _apex){
            _dpex[_q] = []
            for (let _c in _apex[_q]){
                if (_apex[_q][_c] != null){
                    _dpex[_q].push(_apex[_q][_c])
                }
                else {
                    _dpex[_q].unshift(null)
                }
            }
            
        }

        if (this.mode == 0) {
            for (let u = _dpex.length-1; u > 0; u--) {
                if (_dpex[u].every(element => element === null) && u < this.width) {
                    _dpex.push(_dpex.splice(u, 1)[0])
                }
            }
        }
        
        let tsize = _dpex.length
        if (tsize > this.width) {
            throw new Error('Array size is incorrect');
            console.log(_dpex)
        }

        if (this.mode == 1 || this.mode == 2){
            for (let c = 0; c < _dpex.length; c++){
                for (let t = 0; t < _dpex[c].length; t++){
                    if (!_dpex[c][t]){
                        _dpex[c][t] = this.colorspick[getRandomInt(this.variation)]
                    }
                }

            }

        }

        //before pivotting back, need to check that ALL remaining arrays have at least one non-null value.
        _dpex = _dpex.filter(function (el) {
            return el != null;
        });
                //pivot back
        if (_dpex.length) {
            
            return transpose(_dpex)
        }
        else {
            return []
        }
    }

    HighLight(cell){
        let pos;
        let collector = []
        collector.push(cell) //x_y
        let colorsearch = cell.split("_")
        let _x = colorsearch[0]/this.square_size
        let _y = colorsearch[1]/this.square_size
        //colorsearch = this.squares[colorsearch[0]/this.square_size][[1]/this.square_size]
        colorsearch= this.squares[_y][_x]
       
        //colorsearch = 
        try {

            for (let c = 0; c < collector.length; c++){

                if (collector.length > this.error_tolerance_level){
                    console.log(collector)
                    throw new Error('Something is broken!');
                }


                pos = collector[c].split("_")
                let current_x  = (pos[0]/this.square_size)
                let current_y  = (pos[1]/this.square_size)



                //check Left: _x -1
                if ((current_x - 1) >= 0){
                    if (this.squares[current_y][(current_x - 1)] == colorsearch){
                        let t_val = (current_x-1)*this.square_size+"_"+(current_y)*this.square_size
                        if (!collector.includes(t_val)){
                            //modify border to add top.
                            collector.push(t_val)
                        }
                    }
                    else {
                        //add left border?
                        let mcell = current_x*this.square_size+"_"+current_y*this.square_size
                        $("#"+mcell).css('border-left', this.border_highlight);
                    }
                }
                else {
                    //add left border?
                    let mcell = current_x*this.square_size+"_"+current_y*this.square_size
                    $("#"+mcell).css('border-left', this.border_highlight);
                }
                //end check Left

                //check Right: _x + 1
                if ((current_x + 1) <= this.squares[current_y].length){
                    if (this.squares[current_y][(current_x + 1)] == colorsearch){
                        let t_val = (current_x+1)*this.square_size+"_"+(current_y)*this.square_size
                        if (!collector.includes(t_val)){
                            collector.push(t_val)
                        }
                    }
                    else {
                        //add right border?
                        let mcell = current_x*this.square_size+"_"+current_y*this.square_size
                        $("#"+mcell).css('border-right', this.border_highlight);
                    }
                }
                else {
                    //add top border?
                    let mcell = current_x*this.square_size+"_"+current_y*this.square_size
                    $("#"+mcell).css('border-right', this.border_highlight);
                }
                //end check right

                //check Above: _y - 1
                if ((current_y - 1) >= 0){
                    if (this.squares[current_y-1][(current_x)] == colorsearch){
                        let t_val = (current_x)*this.square_size+"_"+(current_y-1)*this.square_size
                        if (!collector.includes(t_val)){
                            collector.push(t_val)
                        }

                    }
                    else {
                        //add right border?
                        let mcell = current_x*this.square_size+"_"+current_y*this.square_size
                        $("#"+mcell).css('border-top', this.border_highlight);
                    }
                }
                else {
                    //add right border?
                    let mcell = current_x*this.square_size+"_"+current_y*this.square_size
                    $("#"+mcell).css('border-top', this.border_highlight);
                }
                //end check above

                //check Below: _y + 1
                if ((current_y+1) < this.squares.length){
                    if (this.squares[current_y+1][(current_x)] == colorsearch){
                        let t_val = (current_x)*this.square_size+"_"+(current_y+1)*this.square_size
                        if (!collector.includes(t_val)){
                            collector.push(t_val)
                        }
                    }
                    else {
                        //add top border?
                        let mcell = current_x*this.square_size+"_"+current_y*this.square_size
                        $("#"+mcell).css('border-bottom', this.border_highlight);
                    }
                }
                else {
                    //add top border?
                    let mcell = current_x*this.square_size+"_"+current_y*this.square_size
                    $("#"+mcell).css('border-bottom', this.border_highlight);
                }
                //end check below

                    
            }
            return collector
        }
        catch (error) {
            console.log(error)
        }
    }

    DisplayStatistics(){
            let result = "<table class='statstable'><tr><td></td><td></td></tr>"
            let group_size_str = "<tr><td>Group Size (size) cleared (count):</td><td>"
            for (let group in this.stats.group_sizes_cleared){
                if (this.stats.group_sizes_cleared[group] > 0){
                    group_size_str+= group+" x "+this.stats.group_sizes_cleared[group]+" <br />"
                }
            }
            group_size_str+= "</td></tr>"
            result+= group_size_str

            let colors_cleared_str = "<tr><td>Colors cleared:</td><td>"
            for (let colorgrps in this.stats.squares_per_color_cleared){
                colors_cleared_str+= "<span style='display:block;border:1px solid #666666; height:10px;width:10px;background-color:#"+colorgrps+";float:left;'></span> x "+this.stats.squares_per_color_cleared[colorgrps]+" ("+Math.round((this.stats.squares_per_color_cleared[colorgrps]/this.stats.total_squares_cleared)*100 * 100)/100+"%) <br />"
            }
            colors_cleared_str+= "</td></tr>"
            result+= colors_cleared_str
            result+= "<tr><td>Total Squares cleared</td><td>"+this.stats.total_squares_cleared+"</td></tr>"
            result+= "<tr><td>Highest Combo scored (pts)</td><td>"+this.stats.highest_combo_scored+"</td></tr>"
            if (this.mode == 2) {
                result+= "<tr><td>Elapsed time (S)</td><td>"+this.stats.elapsed_time+"</td></tr>"
            }
            result+= "<tr><td>Final difficulty</td><td>"+this.stats.difficulty+"</td></tr>"
            result+= "<tr><td>Total Score (pts)</td><td>"+this.stats.score+"</td></tr>"
            result+= "</table>"
            return result;
    }
}

