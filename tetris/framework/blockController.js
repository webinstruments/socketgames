var BLOCK_THRESHOLDTIME = 1;
var BLOCK_TILES_PER_SECOND = 3;
var BLOCK_MULTIPLICATOR = 3;
var BLOCK_MAXIMUM_SPEED = 7;
var BLOCK_MINIMUM_THRESHOLD = 0.5;

function BlockController(globalScene, width, height, columns, rows, scoreChangedCB, scoreBinder, stageOutput) {
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
    this.timeToRemove = 1000;
    this.levelOutput = stageOutput;
    this.init();
}

BlockController.prototype.init = function() {
    this.resize(this.width, this.height);
    for(var i = 0; i < this.rows + 1; ++i) {
        this.tiles[i] = this.newRow();
    }
    this.heighestValue = 0;
    this.thresholdTime = 0;
    this.velocity = this.tileSize;
    this.velocityMult = 1;
    this.rowsRemoved = 0;
    this.level = 0;
    this.levelAdd = 0;
    if(this.levelOutput) {
        this.levelOutput.innerHTML = 0;
    }
    this.moveFastPressed = false;
    var shadowGeo = new THREE.BoxGeometry(this.tileSize, this.tileSize, this.tileSize);
    this.shadowBlock = new WireFrame(shadowGeo, 0xAA0000, 5);
    this.globalScene.add(this.shadowBlock.wireframe);
    this.hideShadow();
    this.removalTimer = null;
    this.activeBlock = null;
    this.isGameOver = false;
}

BlockController.prototype.newRow = function() {
    var result = [];
    for(var i = 0; i < this.columns; ++i) {
        result[i] = false;
    }

    return result;
}

BlockController.prototype.generateBlock = function() {
    var random = getRandom(7); // debug
    if(gameGlobals.control.block1) { random = 0 }
    else if(gameGlobals.control.block2) { random = 1 }
    else if(gameGlobals.control.block3) { random = 2 }
    else if(gameGlobals.control.block4) { random = 3 }
    else if(gameGlobals.control.block5) { random = 4 }
    else if(gameGlobals.control.block6) { random = 5 }
    else if(gameGlobals.control.block7) { random = 6 }
    var block = null;
    if(random == 0) {
        block = new Block1(this.tileSize, this.globalScene);
    } else if(random == 1) {
        block = new Block2(this.tileSize, this.globalScene);
    } else if(random == 2) { 
        block = new Block2(this.tileSize, this.globalScene);
        block.invert();
    } else if(random == 3) {
        block = new Block3(this.tileSize, this.globalScene);
    } else if(random == 4) {
        block = new Block4(this.tileSize, this.globalScene);
    } else if(random == 5) {
        block = new Block5(this.tileSize, this.globalScene);
    } else if(random == 6 || random == 7) {
        block = new Block5(this.tileSize, this.globalScene);
        block.invert();
    }
    if(this.level <= 4) {
        var blockTiles = Math.floor(block.width / 2 / this.tileSize) * this.tileSize;
        block.setPosition(this.startPosition - blockTiles, this.tileSize * this.rows);
    } else {
        var pos = this.columns - 1 - Math.floor(block.width / this.tileSize);
        pos = getRandom(pos) * this.tileSize;
        block.setPosition(pos, this.tileSize * this.rows);
    }
    this.activeBlock = block;
    this.coarseDetectionY(this.activeBlock);
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
    var col = Math.floor(this.columns * widthRelation);
    var nextCol = col + 1;
    if(this.tileSize * nextCol - x <= THETA) {
        //Überprüfung ob eigentlich nächste Column gemeint ist, da es zu ungenauigkeiten kommen kann.
        return nextCol; //ungenauigkeit bei Berechnungen
    }
    return col;
}

function debug(tiles) {
    console.log("======================================================");
    for(var i = 0; i < tiles.length; ++i) {
        var a = 'row ' + i + ':';
        for(var j = 0; j < tiles[i].length; ++j) {
            if(tiles[i][j] == false) {
                a += ' o';
            } else {
                a += ' x';
            }
        }
        console.log(a);
    }
    console.log("====================================================");
}

BlockController.prototype.getRowTileFromPosition = function(y) {
    if(y <= THETA) {
        y = 0;
    }
    var heightRelation = y / this.getFieldHeight();
    return Math.floor(this.rows * heightRelation);
}

var BLOCKCONTROLLER_BLOCKS = 0;
BlockController.prototype.setTile = function(obj) {
    //console.log('block_' + (++BLOCKCONTROLLER_BLOCKS), obj.getPosition().x + ', ' + obj.getPosition().y);
    var removedRows = 0;
    var rowsToRemove = [];
    //console.log('before_set');
    //debug(this.tiles);
    this.blocks.push(this.getActiveBlock());
    for(var i = 0; i < obj.cubes.length; ++i) {
        var pos =  obj.cubes[i].getPosition(this.globalScene);
        var tile = this.getTileFromPosition(pos.x, pos.y);
        if(tile.rowIndex >= this.rows) {
            this.gameOver();
            return;
        }

        this.tiles[tile.rowIndex][tile.colIndex] = obj.cubes[i];
        if(this.heights[tile.colIndex].y < pos.topY) {
            this.heights[tile.colIndex].y = (tile.rowIndex + 1) * this.tileSize;
        }
        if(this.tiles[tile.rowIndex].filter(function(obj) {
            return obj != false;
        }).length == this.columns) {
            rowsToRemove.push(tile.rowIndex);
            ++removedRows;
        }
    }
    //console.log('after_set');
    //debug(this.tiles);
    if(rowsToRemove.length) {
        this.rowsRemoved += rowsToRemove.length;
        if(this.rowsRemoved >= 6) {
            this.rowsRemoved -= 6;
            this.levelUp();
        }
        this.removeRows(rowsToRemove);
    }
    if(this.scoreChangedCB && removedRows) {
        var add = rowsToRemove.length / 10;
        if(rowsToRemove.length === 4) {
            add = 0.6;
        }
        var multiplier = 0.9 + add + this.levelAdd;
        this.scoreChangedCB.call(this.scoreBinder, removedRows, multiplier);
    }
}

BlockController.prototype.removeRows = function(rowIndexes) {
    var rowIndexes = rowIndexes.sort(function(a, b) {
        return b - a; //descending
    });
    var self = this;
    for(var i = 0; i < rowIndexes.length; ++i) {
        var rowIndex = rowIndexes[i];
        var self = this;
        this.tiles[rowIndex].map(function(cube) {
            cube.remove();
        });

        this.heights.map(function(h) { //adding height for coarse detection
            if(h.y > 0) {
                h.y -= self.tileSize;
                if(h.y < self.tileSizeHalf + THETA) {
                    h.y = 0;
                }
            }
        });
    }

    for(var i = 0; i < this.blocks.length; ++i) { //removing empty blocks
        var block = this.blocks[i];
        if(block.isEmpty()) {
            this.blocks.splice(i, 1);
            --i;
        }
    }

    this.removalTimer = setTimeout(this.shiftBlocks.bind(this, rowIndexes), this.timeToRemove);
}

BlockController.prototype.shiftBlocks = function(rowIndexes) {
    var self = this;
    for(var i = 0; i < rowIndexes.length; ++i) {
        var rowIndex = rowIndexes[i];
        this.tiles[this.rows] = this.newRow(); //array will be treated as reference!
        for(var j = rowIndex; j < this.rows; ++j) { //shifting rows
            this.tiles[j] = this.tiles[j + 1];

            var boxes = this.tiles[j].filter(function(rowItem) {
                return rowItem != false;
            });
            boxes.map(function(cube) {
                cube.moveDown(self.tileSize);
            });
        }
    }

    clearTimeout(this.removalTimer);
    this.removalTimer = null;
    this.generateBlock();
    //console.log('after_remove');
    //debug(this.tiles);
}

BlockController.prototype.resize = function(width, height) {
    this.tileSize = height / this.rows;
    if(this.tileSize * this.columns > width) {
        this.tileSize = width / this.columns;
    }
    this.tileSizeHalf = this.tileSize / 2;
    this.tileSizeTolerance = this.tileSize * 20 / 100; //Toleranz wird benötigt zum verschieben der Blöcke
    this.height = this.getFieldHeight();
    this.width = this.getFieldWidth();
    this.heights = [];
    this.startPosition = Math.floor(this.columns / 2) * this.tileSize;
    for(var i = 0; i < this.columns; ++i) {
        this.heights[i] = { x: this.tileSize * i, y: 0 };
    }
    console.log('tilesize', this.tileSize);
}

BlockController.prototype.getFieldWidth = function() {
    return this.tileSize * this.columns;
}

BlockController.prototype.getFieldHeight = function() {
    return this.tileSize * this.rows;
}

BlockController.prototype.getActiveBlock = function() {
    return !this.removalTimer ? this.activeBlock : null;
}

BlockController.prototype.moveLeft = function() {
    if(!this.getActiveBlock()) { return; }
    this.hideShadow();
    var block = this.getActiveBlock();
    var position = block.getPosition();
    //coarse
    if(position.x > THETA) {
        var self = this;
        var leftObject = findFromArray(this.heights, function(obj) {
            return position.x - obj.x - THETA <= self.tileSize && obj.y > position.y;
        });
        var left = -this.tileSizeHalf;
        var bottom = this.tileSizeTolerance;
        var top = this.tileSize - this.tileSizeTolerance;
        if(!leftObject || (this.checkCollision(left, bottom) && this.checkCollision(left, top))) {
            this.getActiveBlock().moveLeft();
            this.coarseDetectionY(this.getActiveBlock());
        }
    }
}

BlockController.prototype.moveRight = function() {
    if(!this.getActiveBlock()) { return; }
    this.hideShadow();
    var block = this.getActiveBlock();
    var position = block.getPosition();
    if(position.x + block.width - this.width + this.tileSize < THETA) {
        var self = this;
        var rightObject = findFromArray(this.heights, function(obj) {
            return obj.x - position.x >= self.tileSize - THETA && obj.y > position.y;
        });
        var right = this.tileSize + this.tileSizeHalf;
        var bottom = this.tileSizeTolerance;
        var top = this.tileSize - this.tileSizeTolerance;
        //Linke Ecke vom Rechteck zählt!
        if(!rightObject || (this.checkCollision(right, bottom) && this.checkCollision(right, top))) {
            this.getActiveBlock().moveRight();
            this.coarseDetectionY(this.getActiveBlock());
        }
    }
}

//Auf Basis von Links unten!
BlockController.prototype.checkCollision = function(offsetX, offsetY) {
    var self = this;
    var validate = function(colIndex, rowIndex) {
        if(rowIndex < self.rows && self.tiles[rowIndex][colIndex] != false) {
            return false;
        }
        return true;
    }
    var cubes = this.getActiveBlock().cubes;
    for(var i = 0; i < cubes.length; ++i) {
        var position = cubes[i].getPosition(this.globalScene);
        var tile = this.getTileFromPosition(position.leftX + offsetX, position.bottomY + offsetY);
        
        if(!validate(tile.colIndex, tile.rowIndex)) {
            return false;
        }
    }
    return true;
}

BlockController.prototype.moveFast = function() {
    if(!this.getActiveBlock()) { return; }
    if(!this.moveFastPressed) {
        this.moveFastPressed = true;
        this.velocity *= BLOCK_MULTIPLICATOR;
        this.thresholdTime += BLOCK_THRESHOLDTIME / 2;
    }
}

BlockController.prototype.rotate = function() {
    var block = this.getActiveBlock();
    if(!block) { return; }
    var position = block.getPosition();
    var tile = this.getTileFromPosition(position.x, position.y + THETA);
    var counter = 0;
    //Space right
    while(tile.colIndex < this.columns && this.tiles[tile.rowIndex][tile.colIndex] == false && counter < 4) {
        ++counter;
        ++tile.colIndex;
    }
    var width = counter * this.tileSize;    
    block.rotate(width);
    //the offset of block will be tilesizeHalf before drawn. Left part = Middle
    if(!this.checkCollision(0, 0)) {
        block.undoRotate();
    }
    this.coarseDetectionY(block);
}

BlockController.prototype.currentObstaclesY = function(block) {
    var pos = block.getPosition();
    return possibleObstaces = this.heights.filter(function(obj) {
        return obj.x + THETA >= pos.x && obj.x <= pos.x + block.width - THETA;
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

BlockController.prototype.syncPosition = function(triggerGameOver) {
    var block = this.getActiveBlock();
    var offset = 0;
    var position = block.getPosition();
    for(var i = 0; i < block.cubes.length; ++i) {
        var cube = block.cubes[i].getPosition(this.globalScene);
        var tile = this.getTileFromPosition(cube.x, cube.y);
        if(tile.rowIndex >= this.rows) {
            if(triggerGameOver) {
                console.log('gameover3');
                this.gameOver();
            }
            break;
        }
        //Fallback Mechanik, falls Spiel haengen bleibt
        if(this.tiles[tile.rowIndex][tile.colIndex] != false && offset == 0) {
            //this.velocity = 0;
            console.log('error'); //Wenn Frame-Rate zu niedrig verschwinden Bloecke in andere
            console.log(tile.rowIndex, tile.colIndex);
            while(this.tiles[tile.rowIndex + ++offset][tile.colIndex]) {
                //offset so lange hochzaehlen bis naechster freier Block da.
                if(tile.rowIndex + offset >= this.rows) {
                    if(triggerGameOver) {
                        console.log('gameover2');
                        this.gameOver();
                    }
                    return;
                } 
            }
        }
    }
    //offset wird zur endposition dazugezählt
    var tile = this.getTileFromPosition(position.x + this.tileSizeHalf, position.y + this.tileSizeHalf);
    block.setPosition(tile.colIndex * this.tileSize, (tile.rowIndex + offset) * this.tileSize);
    this.positionSynced = true;
}

BlockController.prototype.levelUp = function() {
    this.level++;
    var toAdd = 0.05;
    if((this.velocityMult + toAdd) * BLOCK_TILES_PER_SECOND < BLOCK_MAXIMUM_SPEED) {
        this.velocityMult += toAdd;
    } else {
        this.velocityMult = BLOCK_MAXIMUM_SPEED / BLOCK_TILES_PER_SECOND;
    }
    if(this.thresholdTime > BLOCK_MINIMUM_THRESHOLD) {
        this.thresholdTime -= 0.05;
    } else {
        this.thresholdTime = BLOCK_MINIMUM_THRESHOLD;
    }
    if(this.level % 5 === 0) {
        if(this.level < 10) {
            this.levelAdd += 0.1;
        } else {
            this.levelAdd += 0.2;
        }
    }
    this.levelOutput.innerHTML = this.level;
}

BlockController.prototype.update = function(deltaTime) {
    if(this.removalTimer || this.isGameOver) {
        return; //new block must be generated first
    }
    var block = this.getActiveBlock();
    var position = block.getPosition();
    var offsetY = deltaTime * this.velocity * BLOCK_TILES_PER_SECOND * this.velocityMult;
    if(position.y < 0) {
        position.y = 0;
    }
    //coarse detection
    if(position.y - offsetY > this.heighestValue + THETA) {
        block.moveDown(offsetY);
        this.positionSynced = false;
    } else if(position.y > 0 
        && this.checkCollision(0, -offsetY)) {
            block.moveDown(offsetY);
            this.thresholdTime = 0;
            this.positionSynced = false;
    } else if(this.thresholdTime < BLOCK_THRESHOLDTIME) {
        if(!this.positionSynced) {
            this.syncPosition(false);
        }
        this.thresholdTime += deltaTime;
    } else {
        //align with tiles
        this.syncPosition(true);
        if(this.isGameOver) {
            return;
        }
        this.setTile(block);
        if(!this.removalTimer) { //conflicts with removal of rows
            this.generateBlock();
        }
        this.resetState();
    }
}

BlockController.prototype.resetState = function() {
    this.thresholdTime = 0;
    if(this.moveFastPressed) {
        this.moveFastPressed = false;
        this.velocity /= BLOCK_MULTIPLICATOR;
    }
    this.positionSynced = false;
}

BlockController.prototype.moveShadowLeft = function() {
    if(!this.getActiveBlock()) { return; }
    this.moveShadow(-this.getActiveBlock().width);
}

BlockController.prototype.moveShadowRight = function() {
    if(!this.getActiveBlock()) { return; }
    this.moveShadow(this.getActiveBlock().width);
}

BlockController.prototype.moveShadow = function(offsetX) {
    if(!this.getActiveBlock()) { return; }
    var block = this.getActiveBlock();
    var position = block.getPosition();
    var newPosition = position.x + block.width / 2 + offsetX;
    if(newPosition > -block.width && newPosition < this.width + block.width) {
        this.showShadow();
        this.shadowBlock.setPosition(newPosition, position.y + block.height / 2, 0);
    }
}

BlockController.prototype.hideShadow = function() {
    this.shadowBlock.hide();
}

BlockController.prototype.showShadow = function() {
    this.shadowBlock.show();
}

BlockController.prototype.gameOver = function() {
    this.isGameOver = true;
    while(this.blocks.length) {
        var block = this.blocks.pop();
        block.remove();
    }
    this.activeBlock.remove();
}