const { BinaryTreeInfo } = require('../')

class BinarySearchTree {
  constructor(compare) {
    this.size = 0
    this.compare = compare
    this.root = null
  }
  isEmpty() {
    return this.size === 0
  }
  getSize() {
    return this.size
  }
  add(e) {
    if (this.isEmpty()) {
      this.root = new BinarySearchTreeNode(e)
      this.size ++
    } else {
      let node = this.root
      let parent = null
      let compareRes
      while (node !== null) {
        compareRes = this.compare(node.element, e)
        parent = node
        if (compareRes > 0) {
          node = node.left
        } else if (compareRes < 0) {
          node = node.right
        } else {
          // 值相同 直接返回
          return
        }
      }
      const newNode = new BinarySearchTreeNode(e, null, null, parent)
      if (compareRes > 0) {
        parent.left = newNode
      } else {
        parent.right = newNode
      }
      this.size ++
    }
  }

  // print
  getRoot() {
    return this.root
  }
  getLeft(node) {
    return node.left
  }
  getRight(node) {
    return node.right
  }
  getString(node) {
    return node.element.toString()
  }
}

class BinarySearchTreeNode {
  constructor(
    element, 
    left = null,
    right = null,
    parent = null
  ) {
    this.element = element
    this.left = left
    this.right = right
    this.parent = parent
  }
}

const tree = new BinarySearchTree((a, b) => a - b)
for (let i = 0; i < 10; i ++) {
  tree.add(~~(Math.random() * 100))
}
BinaryTreeInfo.print(tree, {
  canvasWidth: 1600,
  canvasHeight: 400,
  output: 'image'
})

