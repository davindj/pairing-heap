//main
const mainCanvas = new CanvasX(document.querySelector('#main-canvas'))
const ph = new PairHeap()
ph.load()
mainCanvas.draw(ph)
hideButton(false)
resizeMainCanvas()
addHistory("Start State",ph.root)