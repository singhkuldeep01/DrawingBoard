const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let path = []; // Stores drawing actions
let isDrawing = false;
let redoStack = []; // Stores redo actions

let currentColor = 'black';
let currentTool = 'pencil';
let brushSize = 5;

function setupCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpi = window.devicePixelRatio;
    canvas.width = rect.width * dpi;
    canvas.height = rect.height * dpi;
    ctx.scale(dpi, dpi);
}

document.addEventListener('DOMContentLoaded', () => {
    setupCanvas();
    document.querySelector('#pencil').addEventListener('click', () => setActiveTool('pencil'));
    document.querySelector('#eraser').addEventListener('click', () => setActiveTool('eraser'));
    document.querySelector('#undo').addEventListener('click', undoLastAction);
    document.querySelector('#redo').addEventListener('click', redoLastAction);
    document.querySelector('#clear').addEventListener('click', clearCanvas);
    document.querySelector('#color-picker').addEventListener('change', (e) => currentColor = e.target.value);
    document.querySelector('#brush-size').addEventListener('change', (e) => brushSize = parseInt(e.target.value));

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    setActiveTool('pencil');
});

function draw(e) {
    if (!isDrawing) return;
    const mousePosition = getMousePosition(e);
    path[path.length - 1].points.push(mousePosition);
    drawPath();
}

function drawPath() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    path.forEach(p => {
        ctx.beginPath();
        ctx.moveTo(p.points[0].x, p.points[0].y);
        p.points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.strokeStyle = (p.tool === 'eraser') ? 'white' : p.color;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        ctx.stroke();
    });
}

function undoLastAction() {
    if (path.length > 0) {
        redoStack.push(path.pop());
        drawPath();
    }
}

function redoLastAction() {
    if (redoStack.length > 0) {
        path.push(redoStack.pop());
        drawPath();
    }
}

function startDrawing(e) {
    isDrawing = true;
    const mousePosition = getMousePosition(e);
    path.push({
        color: currentColor,
        tool: currentTool,
        size: brushSize,
        points: [mousePosition]
    });
    redoStack = [];
}

function getMousePosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left),
        y: (e.clientY - rect.top)
    };
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    path = [];
    redoStack = [];
}

function setActiveTool(tool) {
    currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    let selectedTool = document.querySelector('#' + tool);
    if (selectedTool) {
        selectedTool.classList.add('active');
    }
    canvas.style.cursor = currentTool === 'pencil' ? 'crosshair' : 'cell';
}
