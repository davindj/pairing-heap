//title
let p1 = 50 , p2 = 100;
let dp = -1;
const div = document.querySelector('.container')
setInterval(() => {
    div.style.backgroundImage = `
    linear-gradient(${p1}deg,royalblue 0%,teal ${p1}%,lime 100%)
    `;
    if(dp + p1 >= 80 || dp + p1 <= 10)
        dp *=-1;
    p1 += dp;
}, 50);

document.querySelector('#btnIns').onclick = ()=>{
    const val = parseFloat(prompt('Insert Value:'));
    if(val || val==0){
        hideButton();
        
        newNode = new Node(val);
        goal = `Insert ${val}`
        
        setTimeout(() => {
            compareDetail();
        }, 500);
    }
}

document.querySelector('#btnExt').onclick = ()=>{
    if(ph.root == null){
        alert('cannot extract from null heap')
        return;
    }
    hideButton();
    
    setTimeout(() => {
        goal = `Extract min → ${ph.root.value}`
        text = `Remove Root Node`
        mainCanvas.drawText(getProcess(),50,25,20)
        state = 'extract'
    }, 500);
}

document.querySelector('#btnDec').onclick = ()=>{
    if(ph.root == null){
        alert('cannot decrease from null heap')
        return;
    }
    const target = parseFloat(prompt('Value to be Decreased (Target) :'))
    const newVal = parseFloat(prompt('New Value :'))
    if((target || target == 0) && (newVal || newVal == 0) && target > newVal){
        hideButton();
        
        setTimeout(() => {
            targetValue = target;
            newValue = newVal;
            goal = `Decrease ${target} → ${newVal}`
            text = `Find Decreased Node`
            mainCanvas.drawText(getProcess(),50,25,20)
            state = 'decrease1';
        }, 500);
    }else{
        alert('there\'s problem with your input')
    }
}

document.querySelector('#btnClr').onclick = ()=>{
    if(confirm('Are You Sure?')){
        ph.root = null;
        addHistory("Clear Heap",null)
        mainCanvas.draw(ph);
    }
}

document.querySelector('#btnSav').onclick = ()=>{
    if(confirm('Are You Sure?'))
        ph.save()
}

let state = null;
let newNode = null;
let current = null;
let finalX = null;
let goal = null;
let text = null;
let arrNode = [];
let targetValue = null;
let newValue = null;
let tempTree = null;
let decNode = null;

function getProcess(){
    return `${goal} : ${text}`
}

function compareDetail(blink = false){
    text = `Compare with Root`
    finalX = mainCanvas.draw(ph)
    mainCanvas.drawText(getProcess(),50,25,20)
    mainCanvas.drawText("+",finalX + nodeSize/2 + space, 15 + nodeSize/2 + space, 50, 'black','center')
    setTimeout(() => {
        current = {
            x: finalX + nodeSize ,
            y: 0
        }
        let tempX = mainCanvas.drawNode(newNode, current.x, current.y)
        function printChild(idx){
            if(idx == arrNode.length){
                state = 'insert'
                return;
            }
            setTimeout(() => {
                mainCanvas.drawText("+",tempX + nodeSize/2 + space, 15 + nodeSize/2 + space, 50, 'black','center')
                setTimeout(() => {
                    tempX = mainCanvas.drawNode(arrNode[idx],tempX + nodeSize,0)
                    printChild(idx + 1)
                }, blink ? 0 : 500);
            }, blink ? 0 : 500);
        }
        printChild(0)
    }, blink ? 0 : 500);
}

document.querySelector('#btnNext').onclick = ()=>{
    if(state == null)
        return;
    if(state == 'end'){
        state = null
        mainCanvas.draw(ph);
        hideButton(false);
        addHistory(goal,ph.root)
    }
    if(state == "insert"){
        state = null;
        const target = {
            x: ph.root == null || ph.root.child.length == 0 ? 0 : finalX,
            y: ph.root == null ? 0 : nodeSize*2
        }
        
        const rootTarget = {
            x: 0, y: 0
        }

        const rootPos = {
            x:0 , y:0
        }

        if(ph.root != null && ph.root.value >= newNode.value){
            target.x = target.y = 0;
            rootTarget.y = nodeSize * 2;
            if(newNode.child.length != 0){
                rootTarget.x = mainCanvas.drawNode(newNode,0,0);
                mainCanvas.clear();
            }
        }


        if(ph.root == null)
            text = 'Root is Null, New Node become Root'
        else if(ph.root.value < newNode.value)
            text = `New Node Value is greater than Root Value, New Node become Root's child`
        else
            text = `New Node Value is less than Root Value, New Node become Root`

        let ctr = 60;
        let spd = {
            x: (target.x - current.x) / ctr,
            y: (target.y - current.y) / ctr
        }

        let rootSpd = {
            x: (rootTarget.x - rootPos.x) / ctr,
            y: (rootTarget.y - rootPos.y) / ctr,
        }

        const t = setInterval(() => {
            //newNode
            current.x += spd.x;
            current.y += spd.y;
            
            //root
            rootPos.x += rootSpd.x;
            rootPos.y += rootSpd.y;

            let change = true;
            if(--ctr <= 0)
                change = false;

            mainCanvas.clear()
            mainCanvas.drawText(getProcess(),50,25,20)
            let tempX = mainCanvas.drawNode(ph.root,rootPos.x,rootPos.y)
            tempX = Math.max(
                mainCanvas.drawNode(newNode, current.x, current.y), tempX
            )
            arrNode.forEach(el => {
                mainCanvas.drawText("+",tempX + nodeSize/2 + space, 15 + nodeSize/2 + space, 50, 'black','center')
                tempX = mainCanvas.drawNode(el,tempX + nodeSize,0)
            })
            if(!change){
                clearInterval(t);
                ph.insertNode(newNode)

                tempX = mainCanvas.draw(ph);
                mainCanvas.drawText(getProcess(),50,25,20)
                arrNode.forEach(el => {
                    mainCanvas.drawText("+",tempX + nodeSize/2 + space, 15 + nodeSize/2 + space, 50, 'black','center')
                    tempX = mainCanvas.drawNode(el,tempX + nodeSize,0)
                })

                if(arrNode.length == 0){
                    resizeMainCanvas(
                        () => state = 'end',
                        () => mainCanvas.drawText(getProcess(),50,25,20)
                    )
                }
                else{
                    state = 'merge'
                }
            }
        },25);
    }
    if(state == 'extract'){
        state = null;
        arrNode = [];
        ph.root.child.forEach(child => {
            arrNode.push(child)
        })
        ph.root.child = [];

        let rootX = 0;
        let nodeY = nodeSize*2;

        const t = setInterval(() => {
            if(rootX <= -150){
                nodeY -= 5;
            }else{
                rootX -= 5;
            }
            mainCanvas.clear();
            mainCanvas.drawText(getProcess(),50,25,20)
            mainCanvas.drawNode(ph.root,rootX)
            let nodeX = 0;
            arrNode.forEach(el => {
                nodeX = mainCanvas.drawNode(el,nodeX,nodeY)
            })

            if(nodeY == 0){
                clearInterval(t);
                ph.root = null; //clear root

                let spaceX  = 0;
                const t2 = setInterval(() => {
                    mainCanvas.clear();
                    spaceX++;   
                    text = 'Merge All child if there\'s any'
                    mainCanvas.drawText(getProcess(),50,25,20)
                    if(arrNode.length > 0){
                        nodeX = 0;
                        arrNode.forEach(el => {
                            nodeX = mainCanvas.drawNode(el,nodeX + spaceX,nodeY)
                        })  
                        if(spaceX == nodeSize){
                            clearInterval(t2)
                            state = 'merge'
                        }
                    }else{
                        clearInterval(t2);
                        state = 'end';
                    }
                }, 50);
            }
        }, 50);
    }
    if(state == 'merge'){
        newNode = arrNode.shift();
        compareDetail(true);
    }
    if(state == 'decrease1'){
        state = null;
        let target = [];
        function recur(node,x=0,y=0){
            const obj = {
                'node'    : node,
                'x'       : x,
                'y'       : y,
                'checked' : false
            }
            target.push(obj)
            if(node.child.length == 0){
                return x + nodeSize + nodeSize/2;
            }
            node.child.forEach(child => {
                x = recur(child,x,y + nodeSize * 2)
                target.push(obj)
            })
            return x;
        }
        recur(ph.root);
        
        current = {
            x: 0, y: 0
        }
        let spd = {
            x: 0, y:0
        }
        let ctr = 0;
        let wait = 0;
        let lastNode = null;
        const t = setInterval(() => {
            mainCanvas.draw(ph);
            mainCanvas.drawText(getProcess(),50,25,20);
            mainCanvas.drawCircle(
                current.x,wait>0 && lastNode != null ? lastNode.y : current.y,
                wait>0 ? 1.2 : 0.5,'red'
            );
            if(wait > 0){
                wait--;
                return;
            }
            if(ctr == 0){
                if(target[0].node.value == targetValue){
                    clearInterval(t);
                    text = 'Target Found!, Decrease Target Node Value'
                    mainCanvas.draw(ph)
                    mainCanvas.drawText(getProcess(),50,25,20);
                    mainCanvas.drawCircle(
                        current.x, target[0].y, 1.2 ,'red'
                    );

                    function getTempTree(node,parent = null,x=0,y=0){
                        const cNode = {
                            'parent'   : parent,
                            'node'     : node,
                            'x'        : x,
                            'y'        : y,
                            'child'    : [],
                            'isTarget' : node == target[0].node
                        }
                        
                        if(cNode.isTarget)
                            decNode = cNode;

                        if(parent)
                            parent.child.push(cNode)

                        if(node.child.length > 0){
                            node.child.forEach(child => {
                                x = getTempTree(child,cNode,x,y+nodeSize*2)
                            })
                            cNode.node.child = [];
                            if(cNode.isTarget){
                                mergeRedundant(cNode,true)
                            }
                            return parent ? x : cNode;
                        }else{
                            return parent ? x + nodeSize + 25 : cNode;
                        }
                    }
                    tempTree = getTempTree(ph.root);
                    console.log(tempTree);
                    
                    mergeRedundant(tempTree)

                    let newArr = []
                    function convCnodeArray(cNode){
                        newArr.push(cNode)
                        cNode.child.forEach(child => {
                            convCnodeArray(child)
                        })
                    }
                    convCnodeArray(tempTree);

                    tempTree = newArr
                    state='decrease2'

                }else if(target.length > 1){
                    ctr = 25;
                    if(!target[0].checked){
                        wait = 100;
                    }
                    target[0].checked = true;
                    let up = target.length >= 2 && target[0].y > target[1].y
                    current.y = up ? target[0].y - nodeSize/2 : target[0].y
                    lastNode = target[0];
                    target.shift();
                    spd.x = (target[0].x - current.x) / ctr
                    spd.y = (target[0].y - current.y - (up ?0 : nodeSize/2)) / ctr
                }else{
                    //ndagel
                    clearInterval(t);
                    text = 'Target not Found!, Do nothing'
                    mainCanvas.draw(ph);
                    mainCanvas.drawText(getProcess(),50,25,20);
                    state = 'end'
                }
            }else{
                ctr--;
                current.x += spd.x
                current.y += spd.y
            }
        }, 10);
    }
    if(state == 'decrease2'){
        state = null;
        decNode.node.value = newValue;
        text  = 'Compare Decreased Node Value with Parent\'s if there\'s any'
        mainCanvas.clear()
        mainCanvas.drawText(getProcess(),50,25,20);
        let a = decNode;
        let b = decNode.parent;
        if(b != null){
            mainCanvas.drawLine(
                a.x + nodeSize/2 + space, a.y + space,
                b.x + nodeSize/2 + space, b.y + nodeSize/2 + space
            )
        }
        mainCanvas.drawNode(decNode.node,decNode.x,decNode.y);
        mainCanvas.drawCNodes(tempTree)
        mainCanvas.drawCircle(
            decNode.x, decNode.y, 1.2 ,'red'
        );
        if(b != null){
            mainCanvas.drawCircle(
                decNode.parent.x, decNode.parent.y, 1.2 ,'#ff6600'
            );
        }
        setTimeout(() => {
            state = 'decrease3'
        }, 500);
    }
    if(state == 'decrease3'){
        state = null;

        let nothing = true;
        if(decNode.parent == null){
            text = 'Parent doesnt exist, Do Nothing'
        }else if(decNode.parent.node.value <= decNode.node.value){
            text = 'Decreased Node Value greater than Parent Value, Do Nothing'
        }else{
            text = 'Decreased Node Value less than Parent Value, Cut Decreased Node from Parent'
            nothing = false;
        }

        mainCanvas.clear()
        mainCanvas.drawText(getProcess(),50,25,20);
        let a = decNode;
        let b = decNode.parent;
        if(b != null){
            mainCanvas.drawLine(
                a.x + nodeSize/2 + space, a.y              + space,
                b.x + nodeSize/2 + space, b.y + nodeSize/2 + space
            )
        }
        mainCanvas.drawNode(decNode.node,decNode.x,decNode.y);
        mainCanvas.drawCNodes(tempTree)
        mainCanvas.drawCircle(
            decNode.x, decNode.y, 1.2 ,'red'
        );
        if(b != null){
            mainCanvas.drawCircle(
                decNode.parent.x, decNode.parent.y, 1.2 ,'#ff6600'
            );
        }
        if(!nothing){
            tempTree.splice(tempTree.indexOf(decNode),1)
            const t = setInterval(() => {
                mainCanvas.clear();
                mainCanvas.drawText(getProcess(),50,25,20);
                
                mainCanvas.drawNode(decNode.node,decNode.x,decNode.y);
                const target = {
                    x: mainCanvas.drawCNodes(tempTree) + nodeSize,
                    y: 0
                }
                
                let genah = true;
                
                // CNode
                if(tempTree.length != 0){
                    let tempX = nodeSize + 25;
                    tempTree.forEach( (cNode,idx) => {
                        if(idx == 0 || !genah)
                        return;
                        if(
                            (cNode.parent == tempTree[idx-1] && cNode.x != tempTree[idx-1].x) ||
                            (cNode.parent != tempTree[idx-1] && cNode.x != tempX)
                        ){
                            cNode.x--;
                            genah = false; 
                        }else{
                            tempX = mainCanvas.drawNode(cNode.node,cNode.x,10000)
                        }
                    })
                }
        
                // DecNode
                let num = 4;
                while(num--){
                    if(decNode.x != target.x || decNode.y != target.y){
                        genah = false;
                        if(decNode.x != target.x)
                            decNode.x += 1 * (decNode.x < target.x ? 1 : -1)
                        if(decNode.y != target.y)
                            decNode.y += 1 * (decNode.y < target.y ? 1 : -1)
                    }
                }
                
                if(genah){
                    clearInterval(t);
                    mergeRedundant(tempTree[0],true)
                    
                    ph.root = tempTree[0].node;
                    newNode = decNode.node;
                    compareDetail(true)
                }

            }, 10);
        }else{
            decNode.isTarget = false;
            mergeRedundant(tempTree[0])
            ph.root = tempTree[0].node;
            state = 'end';
        }
        
    }
}
    
function hideButton(hide = true){
    document.querySelectorAll('.btn-option')
    .forEach(el => el.style.display = hide ? "none" : "")
    document.querySelector('#btnNext').style.display = hide ? "" : "none"
}

//cNode = Custom Node
function mergeRedundant(cNode,aggresive = false){
    if(cNode.isTarget && !aggresive){
        return false;
    }
    else if(cNode.child.length == 0)
        return true;
    let merge = true;
    cNode.child.forEach((child,idx) => {
        let temp = mergeRedundant(child,aggresive);
        if(!temp && !aggresive)
            merge = false;
    })

    while(merge && cNode.child.length > 0){
        const childNode = cNode.child.shift();
        if(!childNode.isTarget)
            cNode.node.child.push(childNode.node)
    }
    return merge;
} 

function resizeMainCanvas(callback = ()=>{},update = ()=>{}){
    const tempT = setInterval(() => {
        const cond = mainCanvas.resize(ph.root,true);
        update();
        if(!cond){
            clearInterval(tempT)
            callback();
        }
    }, 10);
}

let idxHistory = 0;
function addHistory(text=goal, pNode=ph.root){
    const newCanvas  = document.createElement('canvas')
    newCanvas.width  = 500;
    newCanvas.height = 300;
    const newCanvasX = new CanvasX(newCanvas)

    newCanvas.style = `
        width:100%;
        background-color : #aaa;
        border-radius:10px;
    `

    const node = JSON.parse(
        JSON.stringify(pNode)
    )
    newCanvasX.resize(node)

    newCanvas.onclick = function(e){
        const tempCanvas  = document.createElement('canvas')
        tempCanvas.width  = 500;
        tempCanvas.height = 300;
        const tempCanvasX = new CanvasX(tempCanvas)
        tempCanvasX.resize(node)
        $("body").append(
            $("<div></div>")
            .css({
                width :"100vw", height:"100vh",
                "background-color" : "rgba(0,0,0,0.75)",
                position: "fixed",
                top: "0px", left:"0px",
                display : "none"
            })
            .append(
                $(tempCanvas)
                .css({
                    width  : "150vh", height : "90vh",
                    "text-align" : 'center',
                    position  : 'absolute',
                    left  : '50%', top : '50%',
                    transform : 'translate(-50%,-50%)',
                    'border-radius' : '10px',
                    "background-color" : "#eee",
                })
                .click(function(e){
                    $(this).fadeOut(function(){
                        $(this).parent().fadeOut(function(){
                            $(this).remove()
                        });
                    })
                })
            )
            .fadeIn()
        )
    }

    $('.history-content')
    .append(`<hr><div class=history-text-state>${idxHistory++}.) ${text}</div>`)
    .append(newCanvas)
}