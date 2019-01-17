function DragAble(element, rotation, cbOptions) {
    this.startCB = cbOptions.startCB;
    this.endCB = cbOptions.endCB;
    this.moveCB = cbOptions.moveCB;
    element.addEventListener('touchstart', this.dragStart.bind(this), false);
    element.addEventListener('touchend', this.dragEnd.bind(this), false);
    element.addEventListener('touchmove', this.drag.bind(this), false);
    
    element.addEventListener('mousedown', this.dragStart.bind(this), false);
    element.addEventListener('mouseup', this.dragEnd.bind(this), false);
    element.addEventListener('mousemove', this.drag.bind(this), false);

    this.offsetX = 0;
    this.offsetY = 0;
    this.rotation = '';
    if(rotation) {
        this.rotation = "rotate(" + rotation + "deg)";
    }
    this.startX = this.startY = this.clickedOn = null;
    this.dragged = false; //object already moved
    this.dragAble = false; //will be set when clicked and button still touched
    this.canDrag = true; //disable, enable functionality
    this.dragTimer = null;
}

DragAble.prototype.isDragging = function() {
    if(this.dragAble && this.draggingPossible()) {
        this.dragged = true;
        this.startCB();
    }
    clearTimeout(this.dragTimer);
    this.dragTimer = null;
}

DragAble.prototype.dragStart = function() {
    if(!this.canDrag) { return; }
    this.clickedOn = Date.now();
    if(!this.startX) {
        var pos = this.getPosition();
        this.startX = pos.x;
        this.startY = pos.y;
    }
    this.dragAble = true;
    if(!this.dragTimer) {
        this.dragTimer = setTimeout(this.isDragging.bind(this), 1500);
    }
}

DragAble.prototype.dragEnd = function(event) {
    this.clickedOn = null;
    this.dragAble = false;
    if(this.dragged) {
        this.endCB();
    }
}

DragAble.prototype.drag = function(event) {
    if(this.dragAble && this.draggingPossible()) {
        var newX = newY = null;
        if(event.type == "touchmove") {
            newX = event.touches[0].clientX - this.startX;
            newY = event.touches[0].clientY - this.startY;
        } else {
            newX = event.clientX - this.startX;
            newY = event.clientY - this.startY;
        }
        this.moveCB(newX, newY);
    }
}

DragAble.prototype.enableDrag = function() {
    this.canDrag = true;
}

DragAble.prototype.disableDrag = function() {
    this.canDrag = false;
}

DragAble.prototype.draggingPossible = function() {
    return this.clickedOn && Date.now() - this.clickedOn >= 1500 && this.canDrag;
}

DragAble.prototype.getPosition = function() {
    var rect = this.domElement.getBoundingClientRect();
    var centerX = (rect.right - rect.left) / 2;
    var x = rect.left + centerX;
    var centerY = (rect.bottom - rect.top) / 2;
    var y = rect.top + centerY;

    return { x: x, y: y };
}