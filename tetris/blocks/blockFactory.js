function BlockFactory(globalScene, height, width, columns, rows) {
    this.globalScene = globalScene;
    this.width = width;
    this.height = height;
    this.columns = columns;
    this.rows = rows;
    this.tileSize = height / rows;
    if(this.tileSize * columns > width) {
        this.tileSize = width / columns;
    }
    this.tiles = [];
    for(var i = 0; i < columns; ++i) {
        this.tiles[i] = [];
    }
    console.log('blockSize', this.tileSize);
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