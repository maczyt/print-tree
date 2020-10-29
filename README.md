# print-tree

![version](https://img.shields.io/npm/v/print-trees?label=print-trees)
![license](https://img.shields.io/npm/l/print-trees)
![downloads](https://img.shields.io/npm/dw/print-trees)

In terminal print binary tree data structure

在学习数据结构中，二叉树显然是个非常重要的知识点，为了更方便的查看一个二叉树的结构，所以基于`node-canvas`、`terminal-image`绘制出可视化的二叉树到控制台中，便于学习理解二叉树的一些算法。

## 使用

``` shell
yarn add print-trees # or npm install print-trees
```

## Doc

``` ts
import { BinaryTreeInfo } = 'print-trees'
BinaryTreeInfo.print(tree, options)

// tree 实例需要实现该 interface
interface IBinaryTreeInfo {
  getRoot(): Node // 返回树的根节点
  getLeft(node): Node // 返回左节点
  getRight(node): Node // 返回右节点
  getString(node): string // 节点要展示的内容
}

interface IOptions {
  canvasWidth: number
  canvasHeight: number
  output: ['log', 'image'] // log: 打印到控制台 or image: 输出一个binaryInfo.png文件
  terminalImageOptions: object // 参考 terminal-image 库
}
```

## Example

``` js
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

```

> 运行效果

![image.png](./image.png)
