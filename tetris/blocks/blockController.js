function BlockController(globalScene, width, height, columns, rows) {
    this.globalScene = globalScene;
    this.width = width;
    this.height = height;
    this.columns = columns;
    this.rows = rows;
    this.tiles = [];
    this.blocks = [];
    this.isGameOver = false;
    this.init();
    this.resize(this.width, this.height);
}

BlockController.prototype.init = function() {
    for(var i = 0; i < this.rows + 1; ++i) {
        this.tiles[i] = [];
        for(var j = 0; j < this.columns; ++j) {
            //one more - so no fill array needed if rows are removed
            this.tiles[i][j] = false;
        }
    }
    this.heights = [];
    for(var i = 0; i < this.columns; ++i) {
        this.heights[i] = { x: 0, y:0 };
    }
    this.heighestValue = 0;
    this.thresholdTime = 0;
    this.moveFastPressed = false;
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
        if(this.tiles[tile.rowIndex].filter(function(obj) {
            return obj != false;
        }).length == this.columns) {
            this.removeRows(tile.rowIndex);
            i = -1;
        }
    }
}

BlockController.prototype.removeRows = function(rowIndex) {
    var self = this;
    this.tiles[rowIndex].map(function(cube) {
        cube.remove();
    });
    this.heights.map(function(h) {
        if(h.y > 0) {
            h.y -= self.tileSize;
            if(h.y < self.tileSize / 2 + THETA) {
                h.y = 0;
            }
        }
    });
    for(var i = rowIndex; i < this.rows; ++i) {
        this.tiles[i] = this.tiles[i + 1];
    }
    for(var i = 0; i < this.blocks.length; ++i) {
        var block = this.blocks[i];
        if(block.isEmpty()) {
            this.blocks.splice(i, 1);
            --i;
        } else {
            var blockPosition = block.getPosition();
            block.setPosition(blockPosition.x, blockPosition.y - this.tileSize);
        }
    }
    console.log('heights', this.heights);
    console.log('blocks', this.blocks);
}

BlockController.prototype.resize = function(width, height) {
    this.tileSize = height / this.rows;
    if(this.tileSize * this.columns > width) {
        this.tileSize = width / this.columns;
    }
    this.height = this.getFieldHeight();
    this.width = this.getFieldWidth();
    console.log('tilesize', this.tileSize);
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
    var position = block.getPosition();
    //coarse
    if(position.x > 0) {
        if(this.checkLeftCollision(block)) {
            this.getActiveBlock().moveLeft();
            this.coarseDetectionY(this.getActiveBlock());
        }
    }
}

BlockController.prototype.checkLeftCollision = function(block) {
    var self = this;
    var position = block.getPosition();
    var heightLeft = this.heights.filter(function(obj) {
        return obj.x + THETA > position.x - self.tileSize && obj.y > THETA
    });
    if(heightLeft.length == 0) {
        return true
    } else if(heightLeft[0].y + THETA >= position.y) {
        var cubes = block.getLeftBlocks();
        for(var i = 0; i < cubes.length; ++i) {
            position = cubes[i].getPosition(this.globalScene);
            var tile = this.getTileFromPosition(position.x, position.y);
            if(this.tiles[tile.rowIndex][tile.colIndex] == false) {
                return false;
            }
        }
    }
    return true;
}

BlockController.prototype.moveRight = function() {
    var block = this.getActiveBlock();
    if(block.getRightBlock().getPosition(this.globalScene).rightX - this.width + this.tileSize < THETA) {
        this.getActiveBlock().moveRight();
        this.coarseDetectionY(this.getActiveBlock());
    }
}

BlockController.prototype.moveFast = function() {
    var block = this.getActiveBlock().moveFast();
    if(!this.moveFastPressed) {
        this.thresholdTime += BLOCK_THRESHOLDTIME / 2;
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
    if(obstacles.length) {
        this.heighestValue = getMaxOfArray(obstacles, function(o)  {
            return o.y;
        });
    } else {
        this.heighestValue = 0;
    }
}

BlockController.prototype.update = function(deltaTime) {
    var block = this.getActiveBlock();
    //coarse detection
    if(block.getPosition().y > this.heighestValue + THETA) {
        block.moveDown(deltaTime);
    } else if(this.thresholdTime < BLOCK_THRESHOLDTIME) {
        block.setPosition(block.getPosition().x, this.heighestValue, 0);
        this.thresholdTime += deltaTime;
    } else {
        block.setPosition(block.getPosition().x, this.heighestValue, 0);
        this.setTile(block);
        this.generateBlock();
        this.coarseDetectionY(this.getActiveBlock());
        this.thresholdTime = 0;
        this.moveFastPressed = false;
    }
    /*if(!this.getActiveBlock().active) {
        this.generateBlock();
    }*/
}

BlockController.prototype.gameOver = function() {
    this.isGameOver = true;
    while(this.blocks.length) {
        var block = this.blocks.pop();
        block.remove();
    }
    this.init();
}