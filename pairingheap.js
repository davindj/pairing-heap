class PairHeap {
    insert(n = 0){
        this.insertNode(new Node(n))
    }

    insertNode(newNode){
        if(this.root == null)
            this.root = newNode;
        else if(this.root.value < newNode.value){
            this.root.child.push(newNode);
        }else{
            newNode.child.push(this.root);
            this.root = newNode;
        }
    }

    extract(){
        if(this.root == null)
            return 'Empty Tree :D';
        let val = this.root.value;
        const tempArr = [];
        this.root.child.forEach(element => {
            // element.parent = null;
            tempArr.push(element)
        });
        this.root = tempArr.shift();
        while(tempArr.length > 0){
            this.insertNode(tempArr.shift());
        }
        return val;
    }

    decrease(target, newValue, node=this.root, parent=null){
        if(newValue >= target || node == null)
            return false;
        if(node.value == target){
            node.value = newValue
            if(node != this.root && node.value < parent.value){
                parent.child.splice(parent.child.indexOf(node),1)
                this.insertNode(node)
            }
            return true;
        }else{
            // node.parent = null;
            node.child.forEach(childNode => {
                // childNode.parent = node;
                const result = this.decrease(target,newValue,childNode,node);
                if(result){
                    return result;
                }
            });
            return false;
        }
    }
    
    save(){
        const KEY = 'heap'
        if(this.root == null)
            localStorage.removeItem(KEY)
        else
            localStorage.setItem(KEY, JSON.stringify(this.root));

    }

    load(){
        const KEY = 'heap'
        if(localStorage.getItem(KEY)){
            this.root = JSON.parse(localStorage.getItem(KEY))
        }
    }

}

class Node{
    constructor(n){
        this.value = n;
        this.child = [];
    }
}