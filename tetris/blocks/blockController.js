function BlockController(globalScene, width, height, columns, rows) {
    this.globalScene = globalScene;
    this.width = width;
    this.height = height;
    this.columns = columns;
    this.gameOver = false;
    this.rows = rows;
    this.tiles = [];
    this.blocks = [];
    this.init();
    this.resize(this.width, this.height);
    console.log('blockSize', this.tileSize);
}

BlockController.prototype.init = function() {
    for(var i = 0; i < this.rows; ++i) {
        this.tiles[i] = [];
        for(var j = 0; j < this.columns; ++j) {
            this.tiles[i][j] = i + "," + j;
        }
    }
    this.heights = [];
    for(var i = 0; i < this.columns; ++i) {
        this.heights[i] = { x: 0, y:0 };
    }
    this.heighestValue = 0;
}

BlockController.prototype.generateBlock = function() {
    var newBlock = new QuadBlock(this.tileSize); 
    newBlock.generate(this.globalScene);
    this.blocks.push(newBlock);
    newBlock.setPosition(0, this.tileSize * this.rows);
}

BlockController.prototype.getTileFromPosition = function(x, y) {
    var colIndex = this.getColumnTileFromPosition(x);
    var rowIndex = this.getRowTileFromPosition(y);

    return { colIndex: colIndex, rowIndex: rowIndex };
}

BlockController.prototype.getColumnTileFromPosition = function(x) {
    if(x <= THETA) {
        x = 0;
    }
    var widthRelation = x / this.getFieldWidth();
    return Math.floor(this.columns * widthRelation);
}

BlockController.prototype.getRowTileFromPosition = function(y) {
    if(y <= THETA) {
        x = 0;
    }
    var heightRelation = y / this.getFieldHeight();
    return Math.floor(this.rows * heightRelation);
}

BlockController.prototype.getNearestFromColumn = function() {
    var block = this.getActiveBlock().getPosition();
    block.x += this.tileSize / 2;
    block.y += this.tileSize / 2;
}

BlockController.prototype.setTile = function(obj) {
    for(var i = 0; i < obj.cubes.length; ++i) {
        var pos =  obj.cubes[i].getPosition(this.globalScene);
        var tile = this.getTileFromPosition(pos.x, pos.y);
        if(tile.rowIndex >= this.rows) {
            //gameover
            this.gameOver();
            return;
        }
        this.tiles[tile.rowIndex][tile.colIndex] = obj.cubes[i];
        if(this.heights[tile.colIndex].y < pos.topY) {
            this.heights[tile.colIndex] = { x: tile.colIndex * this.tileSize, y: (tile.rowIndex + 1) * this.tileSize };
        }
    } 
}

BlockController.prototype.resize = function(width, height) {
    this.tileSize = height / this.rows;
    if(this.tileSize * this.columns > width) {
        this.tileSize = width / this.columns;
    }
    this.height = this.getFieldHeight();
    this.width = this.getFieldWidth();
}

BlockController.prototype.getFieldWidth = function() {
    return this.tileSize * this.columns;
}

BlockController.prototype.getFieldHeight = function() {
    return this.tileSize * this.rows;
}

BlockController.prototype.getActiveBlock = function() {
    return this.blocks[this.blocks.length - 1];
}

BlockController.prototype.moveLeft = function() {
    var block = this.getActiveBlock();
    if(block.getLeftBlock().getPosition(this.globalScene).leftX > THETA) {
        this.getActiveBlock().moveLeft();
    }
}

BlockController.prototype.moveRight = function() {
    var block = this.getActiveBlock();
    if(block.getRightBlock().getPosition(this.globalScene).rightX - this.width + this.tileSize < THETA) {
        this.getActiveBlock().moveRight();
    }
}

BlockController.prototype.rotate = function() {
    this.getActiveBlock().rotate();
}

BlockController.prototype.currentObstaclesY = function(block) {
    var pos = block.getPosition();
    return possibleObstaces = this.heights.filter(function(obj) {
        return obj.x + THETA >= pos.x && obj.x - THETA <= pos.x + block.length;
    });
}

BlockController.prototype.coarseDetectionY = function(block) {
    var obstacles = this.currentObstaclesY(block);
    this.heighestValue = getMaxOfArray(obstacles, function(o)  {
        return o.y;
    });
}

BlockController.prototype.update = function(deltaTime) {
    var block = this.getActiveBlock();
    //coarse detection
    if(block.getPosition().y > this.heighestValue + THETA) {
        block.moveDown(deltaTime);
    } else {
        //block.setPosition(block.getPosition().x, this.heighestValue, 0);
        //this.setTile(block);
        //var obstacles = this.currentObstaclesY(this.getActiveBlock());
        //this.coarseDetectionY(block);
        //this.generateBlock();
        //this.coarseDetectionY(this.getActiveBlock());
    }
    /*if(!this.getActiveBlock().active) {
        this.generateBlock();
    }*/
}

BlockController.prototype.gameOver = function() {
    this.gameOver = true;
    while(this.blocks) {
        var block = this.blocks.pop();
        block.remove();
    }
    this.init();
}