const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const pencilBtn = document.getElementById("pencil");
const eraserBtn = document.getElementById("eraser");
const clearBtn = document.getElementById("clear");
const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");
const colorPicker = document.getElementById("color-picker");
const brushSize = document.getElementById("brush-size");

let isDrawing = false;
let lastX = 0, lastY = 0;
let brushColor = "#000000";
let brushWidth = 5;
let isErasing = false;

let paths = [];      // Stores all drawn strokes
let redoStack = [];  // Stores undone strokes

// Set canvas size
canvas.width = 2000;
canvas.height = 1200;
ctx.lineCap = "round";
ctx.lineJoin = "round";

// Start Drawing
function startDrawing(e) {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    
    // Create new stroke
    paths.push({
        points: [{ x: lastX, y: lastY }],
        color: isErasing ? "#ffffff" : brushColor,
        width: brushWidth
    });

    redoStack = []; // Clear redo stack on new draw
}

// Draw Line
function draw(e) {
    if (!isDrawing) return;
    
    let currentPath = paths[paths.length - 1];  // Get current stroke
    let newPoint = { x: e.offsetX, y: e.offsetY };
    currentPath.points.push(newPoint);

    redrawCanvas(); // Redraw everything
}

// Stop Drawing
function stopDrawing() {
    isDrawing = false;
}

// Redraw Canvas
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    paths.forEach(path => {
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.width;
        ctx.beginPath();
        
        path.points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        
        ctx.stroke();
    });
}

// Undo
undoBtn.addEventListener("click", () => {
    if (paths.length > 0) {
        redoStack.push(paths.pop()); // Move last stroke to redo stack
        redrawCanvas();
    }
});

// Redo
redoBtn.addEventListener("click", () => {
    if (redoStack.length > 0) {
        paths.push(redoStack.pop()); // Move last undone stroke back to paths
        redrawCanvas();
    }
});

// Clear Canvas
clearBtn.addEventListener("click", () => {
    paths = [];
    redoStack = [];
    redrawCanvas();
});

// Change Brush Color
colorPicker.addEventListener("input", (e) => {
    brushColor = e.target.value;
});

// Change Brush Size
brushSize.addEventListener("input", (e) => {
    brushWidth = e.target.value;
});

// Activate Pencil
pencilBtn.addEventListener("click", () => {
    isErasing = false;
});

// Activate Eraser
eraserBtn.addEventListener("click", () => {
    isErasing = true;
});

// Attach Event Listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
