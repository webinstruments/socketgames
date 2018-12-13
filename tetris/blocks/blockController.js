function BlockController(globalScene, width, height, columns, rows, scoreChangedCB, scoreBinder) {
    this.globalScene = globalScene;
    this.width = width;
    this.height = height;
    this.columns = columns;
    this.rows = rows;
    this.tiles = [];
    this.blocks = [];
    this.isGameOver = false;
    this.positionSynced = false;
    this.scoreChangedCB = scoreChangedCB;
    this.scoreBinder = scoreBinder;
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
        this.heights[i] = { x: 0, y: 0 };
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
        y = 0;
    }
    var heightRelation = y / this.getFieldHeight();
    return Math.floor(this.rows * heightRelation);
}

BlockController.prototype.setTile = function(obj) {
    var removedRows = 0;
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
            ++removedRows;
            i = -1;
        }
    }
    if(this.scoreChangedCB && removedRows) {
        this.scoreChangedCB.call(this.scoreBinder, removedRows);
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
            if(h.y < self.tileSizeHalf + THETA) {
                h.y = 0;
            }
        }
    });
    for(var i = rowIndex; i < this.rows; ++i) {
        this.tiles[i] = this.tiles[i + 1];
    }
    var filteredBlocks = this.blocks.filter(function(block) {
        return block.getPosition().y > rowIndex * self.tileSize - THETA
    });
    for(var i = 0; i < filteredBlocks.length; ++i) {
        var pos = filteredBlocks[i].getPosition();
        filteredBlocks[i].setPosition(pos.x, pos.y - this.tileSize, 0);
    }
    for(var i = 0; i < this.blocks.length; ++i) {
        var block = this.blocks[i];
        if(block.isEmpty()) {
            this.blocks.splice(i, 1);
            --i;
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
    this.tileSizeHalf = this.tileSize / 2;
    this.tileSizeTolerance = this.tileSize * 1 / 100; //Toleranz wird benötigt zum verschieben der Blöcke
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
        var self = this;
        var leftObject = findFromArray(this.heights, function(obj) {
            return position.x - obj.x - THETA <= self.tileSize && obj.y > position.y;
        });
        if(!leftObject || this.checkCollision(block.getLeftBlocks(), -this.tileSize / 2, 0)) {
            this.getActiveBlock().moveLeft();
            this.coarseDetectionY(this.getActiveBlock());
        }
    }
}

BlockController.prototype.moveRight = function() {
    var block = this.getActiveBlock();
    var position = block.getPosition();
    if(position.x + block.width - this.width + this.tileSize < THETA) {
        var self = this;
        var rightObject = findFromArray(this.heights, function(obj) {
            return obj.x - position.x - THETA >= self.tileSize && obj.y > position.y;
        });
        //Linke Ecke vom Rechteck zählt!
        if(!rightObject || this.checkCollision(block.getRightBlocks(), this.tileSize + this.tileSizeHalf, 0)) {
            this.getActiveBlock().moveRight();
            this.coarseDetectionY(this.getActiveBlock());
        }
    }
}

//Auf Basis von Links unten!
BlockController.prototype.checkCollision = function(cubes, offsetX, offsetY) {
    var self = this;
    var validate = function(colIndex, rowIndex) {
        if(self.tiles[rowIndex][colIndex] != false) {
            return false;
        }
        return true;
    }
    for(var i = 0; i < cubes.length; ++i) {
        var position = cubes[i].getPosition(this.globalScene);
        var tile = this.getTileFromPosition(position.leftX + offsetX, position.bottomY + offsetY);
        
        if(!validate(tile.colIndex, tile.rowIndex)) {
            return false;
        } else if(offsetX != 0) { // Bewegung nach links oder rechts - Ungenauigkeit bei oberen Block
            tile = this.getTileFromPosition(position.leftX + offsetX, position.bottomY + this.tileSizeTolerance);
            if(!validate(tile.colIndex, tile.rowIndex)) {
                return false;
            }
        } else if(offsetY != 0) { //Bewegung nach unten - Problem mit rechten Block
            tile = this.getTileFromPosition(position.leftX + this.tileSizeTolerance, position.bottomY + offsetY);
            if(tile.colIndex >= this.columns) {
                tile.colIndex = this.columns - 1;
            } 
            if(!validate(tile.colIndex, tile.rowIndex)) {
                return false;
            }
        }
    }
    return true;
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
    //Objekt fällt nur nach unten, es muss nur höchstes Objekt in Reichweite gefunden werden.
    var obstacles = this.currentObstaclesY(block);
    if(obstacles.length) {
        this.heighestValue = getMaxOfArray(obstacles, function(o)  {
            return o.y;
        });
    } else {
        this.heighestValue = 0;
    }
}

BlockController.prototype.syncPosition = function(block) {
    var offset = 0;
    var position = block.getPosition();
    for(var i = 0; i < block.cubes.length; ++i) {
        var cube = block.cubes[i].getPosition(this.globalScene);
        var tile = this.getTileFromPosition(cube.x, cube.y);
        if(tile.rowIndex >= this.rows) {
            this.gameOver();
            return;
        }
        if(this.tiles[tile.rowIndex][tile.colIndex] != false && offset == 0) {
            console.log('error'); //Wenn Frame-Rate zu niedrig verschwinden Bloecke in andere
            while(this.tiles[tile.rowIndex + ++offset][tile.colIndex]) {
                //offset so lange hochzaehlen bis naechster freier Block da.
            }
        }
    }
    //offset wird zur endposition dazugezählt
    var tile = this.getTileFromPosition(position.x + this.tileSizeHalf, position.y + this.tileSizeHalf);
    block.setPosition(tile.colIndex * this.tileSize, (tile.rowIndex + offset) * this.tileSize, 0);
    this.positionSynced = true;
}

BlockController.prototype.update = function(deltaTime) {
    var block = this.getActiveBlock();
    var position = block.getPosition();
    if(position.y < 0) {
        position.y = 0;
    }
    //coarse detection
    if(position.y > this.heighestValue + THETA) {
        block.moveDown(deltaTime);
    } else if(position.y > 0 
        && this.checkCollision(block.getBottomBlocks(), 0, -this.tileSizeTolerance)) {
            block.moveDown(deltaTime);
            this.thresholdTime = 0;
    } else if(this.thresholdTime < BLOCK_THRESHOLDTIME) {
        if(!this.positionSynced) {
            this.syncPosition(block);
        }
        //block.setPosition(block.getPosition().x, this.heighestValue, 0);
        this.thresholdTime += deltaTime;
    } else {
        //align with tiles
        this.syncPosition(block);
        this.setTile(block);
        this.generateBlock();
        this.coarseDetectionY(this.getActiveBlock());
        this.thresholdTime = 0;
        this.moveFastPressed = false;
        this.positionSynced = false;
    }
}

BlockController.prototype.gameOver = function() {
    this.isGameOver = true;
    while(this.blocks.length) {
        var block = this.blocks.pop();
        block.remove();
    }
    this.init();
}