function BlockFactory(globalScene, width, height, columns, rows) {
    this.globalScene = globalScene;
    this.width = width;
    this.height = height;
    this.columns = columns;
    this.rows = rows;
    this.tiles = [];
    for(var i = 0; i < columns; ++i) {
        this.tiles[i] = [];
        for(var j = 0; j < rows; ++j) {
            this.tiles[i][j] = false;
        }
    }
    this.blocks = [];
    this.resize(this.width, this.height);
    console.log('blockSize', this.tileSize);
}

BlockFactory.prototype.generateBlock = function() {
    var newBlock = new QuadBlock(this.tileSize); 
    newBlock.generate(this.globalScene);
    this.blocks.push(newBlock);
    newBlock.setPosition(0, 0);
}

BlockFactory.prototype.getTileFromPosition = function(x, y) {
    var widthRelation = this.width / x;
    var colIndex = Math.floor(this.columns / widthRelation);
    if(colIndex >= this.columns) {
        return null;
    }
    var heightRelation = this.height / y;
    var rowIndex = Math.floor(this.rows / heightRelation);
    if(rowIndex >= this.rows) {
        return null;
    }

    return this.tiles[colIndex][rowIndex];
}

BlockFactory.prototype.resize = function(width, height) {
    this.tileSize = height / this.rows;
    if(this.tileSize * this.columns > width) {
        this.tileSize = width / this.columns;
    }
}

BlockFactory.prototype.getFieldWidth = function() {
    return this.tileSize * this.columns;
}

BlockFactory.prototype.getFieldHeight = function() {
    return this.tileSize * this.rows;
}

BlockFactory.prototype.getActiveBlock = function() {
    return this.blocks[this.blocks.length - 1];
}

BlockFactory.prototype.moveLeft = function() {
    this.getActiveBlock().moveLeft();
}

BlockFactory.prototype.moveRight = function() {
    this.getActiveBlock().moveRight();
}

BlockFactory.prototype.rotate = function() {
    this.getActiveBlock().rotate();
}

BlockFactory.prototype.update = function(deltaTime) {
    this.getActiveBlock().update(deltaTime);
    /*if(!this.getActiveBlock().active) {
        this.generateBlock();
    }*/
}