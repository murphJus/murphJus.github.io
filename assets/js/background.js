// Create and initialize the background
function initNetworkBackground() {
    const canvas = document.createElement('div');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-10';
    canvas.style.backgroundColor = 'rgb(33, 37, 41)';
    canvas.className = 'fixed-background';
    canvas.style.pointerEvents = 'none';   
    canvas.style.userSelect = 'none';      
    canvas.style.touchAction = 'none';      
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.userSelect = 'none';
    svg.style.touchAction = 'none';
    canvas.appendChild(svg);
    svg.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    const CONNECTION_DISTANCE = 200;
    const MIN_CONNECTIONS = 15;
    const NODE_COUNT = 45;
    
    let nodes = [];
    let dimensions = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    // Generate initial nodes
    function generateNodes() {
        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * dimensions.width,
                y: Math.random() * dimensions.height,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                radius: 3
            });
        }
    }

    // Update and draw connections
    function updateConnections() {
        // Clear previous elements
        svg.innerHTML = '';
        
        // Update node positions
        nodes = nodes.map((node, index) => {
            let newX = node.x + node.speedX;
            let newY = node.y + node.speedY;
            
            if (newX < 0 || newX > dimensions.width) {
                node.speedX *= -1;
                newX = Math.max(0, Math.min(newX, dimensions.width));
            }
            if (newY < 0 || newY > dimensions.height) {
                node.speedY *= -1;
                newY = Math.max(0, Math.min(newY, dimensions.height));
            }

            return {
                ...node,
                x: newX,
                y: newY
            };
        });

        // Draw connections
        nodes.forEach((node, i) => {
            // Create dot
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', node.radius);
            circle.setAttribute('fill', 'rgb(255, 60, 60)');
            svg.appendChild(circle);

            // Calculate and draw connections
            nodes.forEach((otherNode, j) => {
                if (i < j) {
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < CONNECTION_DISTANCE) {
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', node.x);
                        line.setAttribute('y1', node.y);
                        line.setAttribute('x2', otherNode.x);
                        line.setAttribute('y2', otherNode.y);
                        line.setAttribute('stroke', 'rgba(255, 40, 40, 0.5)');
                        line.setAttribute('stroke-width', '1.5');
                        line.setAttribute('opacity', (1 - distance / CONNECTION_DISTANCE) * 0.8);
                        svg.appendChild(line);
                    }
                }
            });
        });

        requestAnimationFrame(updateConnections);
    }

    let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas();
    }, 200); // Delay to avoid rapid resizing
});

    // Initialize
    generateNodes();
    updateConnections();
}

// Start the background when the page loads
window.addEventListener('load', initNetworkBackground);