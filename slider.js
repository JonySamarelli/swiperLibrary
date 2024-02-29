class Coordinates {
    constructor(element) {
        this.element = element;
        this.x = 0;
        this.y = 0;
        this.originalX = 0;
        this.originalY = 0;
        this.transformX = 0;
        this.transformY = 0;
        this.dragging = false;
    }
}

position = 0;

function slider(element) {
    const init = () => {
        const coordinates = new Coordinates(element);
        
        startDrag = (event) => {
            coordinates.dragging = true;
            coordinates.element.style.cursor = 'grabbing';
            coordinates.element.style.zIndex = ++position;
            coordinates.originalX =  event.clientX;
            coordinates.originalY =  event.clientY;    
        };
    
        drag = (event) => {
            if (coordinates.dragging) {
                coordinates.x = event.clientX - coordinates.originalX + coordinates.transformX;
                coordinates.y = event.clientY - coordinates.originalY + coordinates.transformY;
                coordinates.element.style.transform = `translate(${coordinates.x}px, ${coordinates.y}px)`;
            }
        };
    
        endDrag = () => {
            coordinates.dragging = false;
            coordinates.transformX = coordinates.x;
            coordinates.transformY = coordinates.y;
            coordinates.element.style.cursor = 'grab';
        };    

        coordinates.element = element;
        coordinates.element.style.cursor = 'grab';
        coordinates.element.style.position = 'relative';
        
        coordinates.element.addEventListener('mousedown', startDrag);
        coordinates.element.addEventListener('mousemove', drag);
        window.addEventListener('mousemove', drag);
        coordinates.element.addEventListener('mouseup', endDrag);
        coordinates.element.addEventListener('mouseleave', endDrag);
    };
    init();
}
