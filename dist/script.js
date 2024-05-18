document.addEventListener('DOMContentLoaded', () => {
    const canvasEscritorio = document.getElementById('canvasEscritorio');
    const canvasContainer = document.getElementById('canvasContainer');
    if (canvasContainer) {
        canvasEscritorio.width = window.innerWidth;
        canvasEscritorio.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvasEscritorio.width = window.innerWidth;
            canvasEscritorio.height = window.innerHeight;
        });

        canvasContainer.addEventListener('dblclick', toggleFullscreen.bind(null, canvasContainer));

        class DraggableCanvas {
            constructor(id, x, y, width, height, color, drawFunction, container = document.getElementById('canvasContainer')) {
                this.canvas = document.createElement('canvas');
                this.canvas.id = id;
                this.canvas.width = width;
                this.canvas.height = height;
                this.canvas.classList.add('draggable-canvas');
                this.canvas.style.left = `${x}px`;
                this.canvas.style.top = `${y}px`;
                this.canvas.style.zIndex = 0;
                container.appendChild(this.canvas);
                this.ctx = this.canvas.getContext('2d');
                this.color = color;
                this.isDragging = false;
                this.isResizing = false;
                this.drawFunction = drawFunction;

                this.createResizeHandle(container);

                this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
                window.addEventListener('mousemove', this.onMouseMove.bind(this));
                window.addEventListener('mouseup', this.onMouseUp.bind(this));
                this.canvas.addEventListener('dblclick', this.toggleFullscreen.bind(this));

                this.draw();
            }

            createResizeHandle(container) {
                this.resizeHandle = document.createElement('div');
                this.resizeHandle.classList.add('resize-handle');
                container.appendChild(this.resizeHandle);

                this.resizeHandle.addEventListener('mousedown', this.onResizeMouseDown.bind(this));
                this.updateResizeHandlePosition();
            }

            onMouseDown(event) {
                if (event.target === this.resizeHandle) return;
                this.traerAlFrente();
                this.isDragging = true;
                this.offsetX = event.clientX - this.canvas.offsetLeft;
                this.offsetY = event.clientY - this.canvas.offsetTop;
            }

            traerAlFrente() {
                document.querySelectorAll('.draggable-canvas').forEach(canvas => canvas.style.zIndex = 0);
                this.canvas.style.zIndex = 1;
            }

            onMouseMove(event) {
                if (this.isDragging) {
                    this.canvas.style.left = `${event.clientX - this.offsetX}px`;
                    this.canvas.style.top = `${event.clientY - this.offsetY}px`;
                    this.updateResizeHandlePosition();
                } else if (this.isResizing) {
                    const newWidth = event.clientX - this.canvas.offsetLeft;
                    const newHeight = event.clientY - this.canvas.offsetTop;
                    this.canvas.width = newWidth;
                    this.canvas.height = newHeight;
                    this.updateResizeHandlePosition();
                    this.draw();
                }
            }

            onMouseUp() {
                this.isDragging = false;
                this.isResizing = false;
            }

            onResizeMouseDown(event) {
                this.traerAlFrente();
                this.isResizing = true;
                event.stopPropagation();
            }

            updateResizeHandlePosition() {
                this.resizeHandle.style.left = `${this.canvas.offsetLeft + this.canvas.width - 15}px`;
                this.resizeHandle.style.top = `${this.canvas.offsetTop + this.canvas.height - 15}px`;
            }

            toggleFullscreen() {
                toggleFullscreen(this.canvas);
            }

            draw() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fillStyle = this.color;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                if (this.drawFunction) {
                    this.drawFunction(this.ctx, this.canvas);
                }
            }
        }

        function toggleFullscreen(element) {
            if (!document.fullscreenElement) {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) { // Firefox
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) { // IE/Edge
                    element.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                    document.msExitFullscreen();
                }
            }
        }

        // Definir diferentes funciones de dibujo para cada canvas
        function drawPattern1(ctx, canvas) {
            ctx.fillStyle = 'red';
            ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
        }

        function drawPattern2(ctx, canvas) {
            ctx.fillStyle = 'green';
            for (let i = 0; i < canvas.width; i += 20) {
                ctx.beginPath();
                ctx.arc(i, canvas.height / 2, 10, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function drawPattern3(ctx, canvas) {
            ctx.fillStyle = 'blue';
            ctx.font = '30px Arial';
            ctx.fillText('Hello World', 10, 50);
        }

        function drawPattern4(ctx, canvas) {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.moveTo(50, 50);
            ctx.lineTo(100, 75);
            ctx.lineTo(100, 25);
            ctx.fill();
        }
// Definir función de dibujo para el canvas con contenido ASCII
        function drawAsciiArt(ctx, canvas) {
            const asciiArt = document.getElementById('ascii-art-1').innerText;
            ctx.font = '12px Arial';
            ctx.fillStyle = 'black';
            const lines = asciiArt.split('\n');
            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], 10, 15 * (i + 1));
            }
        }

        // Crear el canvas con contenido ASCII
        const canvas1 = new DraggableCanvas('canvas1', 50, 0, 200, 150, 'rgba(255, 0, 0, 0.5)', drawAsciiArt);

        // Crear los lienzos pequeños con diferentes patrones de dibujo
        const canvas2 = new DraggableCanvas('canvas2', 250, 0, 200, 150, 'rgba(0, 255, 0, 0.5)', drawPattern2);
        const canvas3 = new DraggableCanvas('canvas3', 450, 0, 200, 150, 'rgba(0, 0, 255, 0.5)', drawPattern3);
        const canvas4 = new DraggableCanvas('canvas4', 650, 0, 200, 150, 'rgba(150, 150, 150, 0.5)', drawPattern4);
    } else {
        console.error("No se encontró el elemento con id 'canvasContainer'.");
    }
});