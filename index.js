// Set up the canvas element from the HTML document and get its 2D rendering context
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Set the dimensions of the canvas element
canvas.width = 1024
canvas.height = 576

// Draw a filled rectangle covering the entire canvas
c.fillRect(0, 0, canvas.width, canvas.height)
