const { BinaryTreeInfo } = require('../')
class Node {
  constructor(element, left=null, right=null, parent=null) {
    this.element = element
    this.left = left
    this.right = right
    this.parent = parent
  }
}
const root = new Node(1)
root.left = new Node(2)
root.right = new Node(3)
root.left.left = new Node(4)
root.left.right = new Node(5)
root.right.left = new Node(6)
root.right.right = new Node(7)
class Tree {
  constructor(root) {
    this.root = root
  }
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
BinaryTreeInfo.print(new Tree(root), {
  canvasWidth: 600,
  canvasHeight: 300,
  output: 'image'
})