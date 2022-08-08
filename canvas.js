
class CanvasX
{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx    = canvas.getContext('2d');
    }

    clear(){
        this.ctx.clearRect(0,0,
            parseInt(this.canvas.width),parseInt(this.canvas.height)
        )
    }
    
    clearText(){
        this.ctx.clearRect(0,0,parseInt(this.canvas.width),50)
    }
    
    draw(ph){
        this.clear();
        return this.drawNode(ph.root);
    }
        
    drawLine(x1,y1,x2,y2){
        this.ctx.beginPath();
        this.ctx.moveTo(x1,y1);
        this.ctx.lineTo(x2,y2);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();
    }

    drawText(text, x=0 , y=0 , size=10 , color='black' , align='left'){
        this.ctx.beginPath();
        this.ctx.font = `${size}px Comic Sans MS`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }

    drawCircle(x,y,ratio=1,color='black'){
        this.ctx.beginPath();
        this.ctx.arc(
            x + nodeSize/2 + space, y + nodeSize/2 + space, 
            nodeSize/2 * ratio, 0, 2 * Math.PI
        );
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }

    drawNode(node, x=0 , y=0){
        if(node == null)
            return x;
        let retX;
        const currX = x;
        if(node.child.length == 0){ 
            retX = x + nodeSize + distance.x;
        }else{
            node.child.forEach((element,idx)=>{
                this.drawLine(
                    currX+nodeSize/2 + space,
                    y+nodeSize/2 + space,
                    x+nodeSize/2 + space, 
                    y+nodeSize+ distance.y + space
                )
                x = this.drawNode(element,x,y+nodeSize+ distance.y);
            })
            retX = x;
        }    
        this.ctx.beginPath();
        this.ctx.arc(currX + nodeSize/2 + space, y + nodeSize/2 + space, nodeSize/2, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        this.ctx.fillStyle = "#ded";
        this.ctx.fill();
        this.ctx.stroke();
        this.drawText(node.value, currX+nodeSize/2 + space, y+nodeSize/2+10 + space, 20, "green" , "center");
        return retX;
    }

    drawCNodes(cNodes){
        let max = -1000;
        for(let i=cNodes.length-1;i>=0;i--){
            const cNode = cNodes[i];
            const tempParent = cNode.parent;
            if(tempParent)
                this.drawLine(
                    cNode.x      + nodeSize/2 + space, cNode.y                   + space,
                    tempParent.x + nodeSize/2 + space, tempParent.y + nodeSize/2 + space
                );
            max = Math.max(this.drawNode(cNode.node,cNode.x,cNode.y),max);
        }
        return max;
    }

    drawCustomTree(cNode){
        if(cNode == null || cNode.isTarget)
            return;
        if(cNode.parent){
            let tempParent = cNode.parent;
            this.drawLine(
                cNode.x      + nodeSize/2 + space, cNode.y                   + space,
                tempParent.x + nodeSize/2 + space, tempParent.y + nodeSize/2 + space
            );
        }
        cNode.child.forEach(child => {
            this.drawCustomTree(child)
        })
        this.drawNode(cNode.node,cNode.x,cNode.y);
    }

    measureNodeSize(node,x=0,y=0,max=null){
        max = !max ? {x:0,y:0} : max;
        let retX;
        if(node == null){
        }else if(node.child.length <= 0){
            max.x = Math.max(max.x,x+nodeSize);
            max.y = Math.max(max.y,y+nodeSize);
            retX = x + nodeSize + distance.x;
        }else{
            node.child.forEach(el => {
                x = this.measureNodeSize(el,x,y+nodeSize+distance.y,max);
            })
            retX = x;
        }

        return y==0? max : retX;
    }

    resize(root,slow = false){
        const treeSize = this.measureNodeSize(root);
        
        let change = true;
        const inc = {
            width  : 5,
            height : 3
        }

        do{
            const canvSize = {
                x: this.canvas.width,
                y: this.canvas.height
            }
            // shrink
            if(canvSize.x > 1000 && canvSize.y > 600 && 
                (treeSize.x/canvSize.x <= 0.70 && treeSize.y/canvSize.y <= 0.70)){
                this.canvas.width  -= inc.width
                this.canvas.height -= inc.height
            }
            // grow
            else if(treeSize.x/canvSize.x >= 0.80 || treeSize.y/canvSize.y >= 0.80){
                this.canvas.width  += inc.width
                this.canvas.height += inc.height
            }
            // exit
            else{
                change = false;
            }
        }while(change && !slow)
        this.drawNode(root);

        return change;
    }
}

const nodeSize = 50;
const space = 50;

//jarak antar node;
const distance = {
    x: 25,
    y: 50
}

