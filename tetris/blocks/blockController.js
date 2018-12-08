function BlockController(globalScene, width, height, columns, rows) {
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

BlockController.prototype.generateBlock = function() {
    var newBlock = new QuadBlock(this.tileSize); 
    newBlock.generate(this.globalScene);
    this.blocks.push(newBlock);
    newBlock.setPosition(0, this.tileSize * this.rows);
}

BlockController.prototype.getTileFromPosition = function(x, y) {
    if(x <= THETA) {
        x = 0;
    }
    var widthRelation = x / this.getFieldWidth();
    var colIndex = Math.floor(this.columns * widthRelation);
    
    var heightRelation = y / this.getFieldHeight();
    var rowIndex = Math.floor(this.rows * heightRelation);

    return { colIndex: colIndex, rowIndex: rowIndex };
}

BlockController.prototype.getNearestFromColumn = function() {

}

BlockController.prototype.setTile = function(obj) {
    for(var i = 0; i < obj.cubes.length; ++i) {
        var pos =  obj.cubes[i].getPosition(this.globalScene);
        var tile = this.getTileFromPosition(pos.x, pos.y);
        this.tiles[tile.colIndex][tile.rowIndex] = obj.cubes[i];
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

BlockController.prototype.update = function(deltaTime) {
    var block = this.getActiveBlock();
    if(block.getPosition().y > THETA) {
        block.moveDown(deltaTime);
    } else {
        this.setTile(block);
    }
    /*if(!this.getActiveBlock().active) {
        this.generateBlock();
    }*/
}