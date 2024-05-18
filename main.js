class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    array = [...new Set(array)].sort((a, b) => a - b);
    this.root = this.buildTree(array);
  }

  buildTree(array, start = 0, end = array.length - 1) {
    if (start > end) {
      return null;
    }

    const mid = Math.floor((start + end) / 2);
    let root = new Node(array[mid]);

    root.left = this.buildTree(array, start, mid - 1);
    root.right = this.buildTree(array, mid + 1, end);

    return root;
  }

  insert(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    let parent = null;

    while (current) {
      parent = current;
      if (value === current.data) return null;

      if (value < current.data) {
        current = current.left;
        if (current === null) {
          parent.left = newNode;
          return;
        }
      } else {
        current = current.right;
        if (current === null) {
          parent.right = newNode;
          return;
        }
      }
    }
  }

  remove(value) {
    this.root = this._removeNode(this.root, value);
  }

  _removeNode(node, value) {
    if (node === null) {
      return null;
    }

    // if less we assign node.left to this method but using node.left as argument
    // if more we do the same but with node.right
    if (value < node.data) {
      node.left = this._removeNode(node.left, value);
      return node;
    } else if (value > node.data) {
      node.right = this._removeNode(node.right, value);
      return node;
    } else {
      // when I find the node

      // if it has no children just delete it
      if (node.left === null && node.right === null) {
        return null;
      }

      // if it has one children return that children
      if (node.left === null) {
        return node.right;
      }
      if (node.right === null) {
        return node.left;
      }

      // if it has two children
      const successor = this._findMin(node.right); // find smallest bigger-node in subtree
      node.data = successor.data; // replace current node data with successors

      node.right = this._removeNode(node.right, successor.data); // remove original successor node

      return node;
    }
  }

  _findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  find(value) {
    if (this.root === null) {
      return "EMPTY TREE";
    }

    let current = this.root;

    while (current) {
      if (value === current.data) {
        return current;
      }
      if (value < current.data) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
  }

  levelOrderIterative(callback) {
    if (!this.root) return "EMPTY TREE";

    const queue = [this.root];
    const values = [];

    while (queue.length > 0) {
      const node = queue.shift();

      if (callback) {
        callback(node);
      } else {
        values.push(node.data);
      }

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    return callback ? undefined : values;
  }

  inOrder(callback, node = this.root, values = []) {
    if (node === null) return;
    this.inOrder(callback, node.left, values);

    if (callback) {
      callback(node);
    } else {
      values.push(node.data);
    }

    this.inOrder(callback, node.right, values);

    return callback ? undefined : values;
  }

  preOrder(callback, node = this.root, values = []) {
    if (node === null) return;

    if (callback) {
      callback(node);
    } else {
      values.push(node.data);
    }
    this.preOrder(callback, node.left, values);
    this.preOrder(callback, node.right, values);

    return callback ? undefined : values;
  }

  postOrder(callback, node = this.root, values = []) {
    if (node === null) return;

    this.postOrder(callback, node.left, values);
    this.postOrder(callback, node.right, values);

    if (callback) {
      callback(node);
    } else {
      values.push(node.data);
    }

    return callback ? undefined : values;
  }

  height(node = this.root) {
    if (node === null) {
      return -1; // rest one because by we added one even if the previous node didnt have children
    }

    // return the height of each node (i.e = leftHeight is 1 + 1 + 1 -1, which results to two)
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return 1 + Math.max(leftHeight, rightHeight);
  }

  depth(node = this.root) {
    if (node === null) {
      return "EMPTY TREE";
    }

    let current = this.root;
    let counter = 0;

    while (current) {
      if (node === current) {
        return counter;
      }
      if (node.data < current.data) {
        counter++;
        current = current.left;
      } else {
        counter++;
        current = current.right;
      }
    }

    return counter;
  }

  isBalanced(node = this.root) {
    if (node === null) {
      return true;
    }

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    if (Math.abs(leftHeight - rightHeight) <= 1) {
      // Math.abs converts negatvies into positives
      return this.isBalanced(node.left) && this.isBalanced(node.right);
    } else {
      return false;
    }
  }

  rebalance() {
    // use inOrder() to get a sorted array of values
    // and build a tree using it
    this.root = this.buildTree(this.inOrder());
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};



// DRIVER SCRIPT

// Function to generate an array of random numbers
function generateRandomNumbers(count) {
  const randomNumbers = [];
  for (let i = 0; i < count; i++) {
      randomNumbers.push(Math.floor(Math.random() * 100));
  }
  return randomNumbers;
}

// Function to print elements of the tree
function printTreeElements(tree) {
  console.log("LevelOrder:", tree.levelOrderIterative().join(", "));
  console.log("PreOrder:", tree.preOrder().join(", "));
  console.log("PostOrder:", tree.postOrder().join(", "));
  console.log("InOrder:", tree.inOrder().join(", "));
}

// create tree
function driverScript() {
  const randomNumbers = generateRandomNumbers(10);
  const tree = new Tree(randomNumbers);
  
  // test balanced tree
  console.log(tree.isBalanced())
  printTreeElements(tree);

  // unbalance tree
  const unbalancedNumbers = [110, 120, 130];
  unbalancedNumbers.forEach(num => tree.insert(num));
  console.log('\n')
  console.log(tree.isBalanced())
  printTreeElements(tree);

  // rebalance tree
  tree.rebalance()
  console.log('\n')
  console.log(tree.isBalanced())
  printTreeElements(tree);
}

driverScript()