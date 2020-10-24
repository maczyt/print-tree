/**
   ┌───381────┐
   │          │
┌─12─┐     ┌─410─┐
│    │     │     │
9  ┌─40─┐ 394 ┌─540─┐
   │    │     │     │
  35 ┌─190 ┌─476 ┌─760─┐
     │     │     │     │
    146   445   600   800
*/

export default class Printer {
  static MIN_SPACE = 5;
  public tree
  public nodes: (PrintNode[])[]
	protected root: PrintNode
	maxWidth: number;
  constructor(tree) {
    this.tree = tree
    this.root = new PrintNode(tree.getRoot(), tree, this)
    // this.maxWidth = this.root.width;
  }

  // @override
  getWidth(str): number {
    return str.length
  }

  makeLocation(): void {
    // nodes用来存放所有的节点
    this.nodes = []
    this.fillNodes()
    this.cleanNodes()
    this.compressNodes()
    // let str = ''
    // for (const rowNodes of this.nodes) {
    //   let minX = 0
    //   for (const node of rowNodes) {
    //     str += `${' '.repeat(node.x - minX)}${node.string}`
    //     minX = node.x
    //   }
    //   str += '\n'
    // }
  }

  /**
   * 以满二叉树的形式填充节点
   */
  fillNodes(): void {
    // 第一行
	  const firstRowNodes = []
		firstRowNodes.push(this.root)
    this.nodes.push(firstRowNodes)
    
    /**
     * nodes: [
     *  [], [], []
     * ]
     */

    // 其它行
    while (true) {
      // 最后一项
      const preRowNodes = this.nodes[this.nodes.length - 1]
      const rowNodes = []
      let notNull = false;
      // 遍历上一行的节点
      for (const node of preRowNodes) {
        // 节点为null，所以左右节点都为null
        if (node === null) {
          rowNodes.push(null)
          rowNodes.push(null)
        } else {
          const left = this.addNode(rowNodes, this.tree.getLeft(node.btNode))
          // 左节点不为null
          if (left !== null) {
            node.left = left;
						left.parent = node;
						notNull = true;
          }

          const right = this.addNode(rowNodes, this.tree.getRight(node.btNode));
					if (right !== null) {
						node.right = right;
						right.parent = node;
						notNull = true;
					}
        }
      }

      // 全是null，就退出
			if (!notNull) break;
			this.nodes.push(rowNodes);
    }
  }

  /**
   * 删除全部null、更新节点的坐标
   */
  cleanNodes(): void {
    const rowCount = this.nodes.length;
    if (rowCount < 2) return;
    
    // 最后一行的节点数量
		const lastRowNodeCount = this.nodes[rowCount - 1].length;
    // 每个节点之间的间距
    const nodeSpace = this.maxWidth + 2;
    // 最后一行的长度
		const lastRowLength = lastRowNodeCount * this.maxWidth 
      + nodeSpace * (lastRowNodeCount - 1);
    
    for (let i = 0; i < rowCount; i++) {
      const rowNodes = this.nodes[i]
			const rowNodeCount = rowNodes.length;
			// 节点左右两边的间距
			const allSpace = lastRowLength - (rowNodeCount - 1) * nodeSpace;
			let cornerSpace = allSpace / rowNodeCount - this.maxWidth;
			cornerSpace >>= 1;

			let rowLength = 0;
			for (let j = 0; j < rowNodeCount; j++) {
				if (j != 0) {
					// 每个节点之间的间距
					rowLength += nodeSpace;
				}
				rowLength += cornerSpace;
				const node = rowNodes[j];
				if (node !== null) {
					// 居中（由于奇偶数的问题，可能有1个符号的误差）
					const deltaX = (this.maxWidth - node.width) >> 1;
					node.x = rowLength + deltaX;
					node.y = i;
				}
				rowLength += this.maxWidth;
				rowLength += cornerSpace;
			}
			// 删除所有的null
			rowNodes.reduceRight((_, node, index) => {
        if (node === null) {
          rowNodes.splice(index, 1)
        }
        return _
      }, 0);
		}
  }

  /**
   * 压缩空格
   */
  compressNodes(): void {
    const rowCount = this.nodes.length;
		if (rowCount < 2) return;

		for (let i = rowCount - 2; i >= 0; i--) {
      const rowNodes = this.nodes[i]
      for (const node of rowNodes) {
        const left = node.left
        const right = node.right
        if (left === null && right === null) continue;
        if (left !== null && right !== null) {
					// 让左右节点对称
					node.balance(left, right);

					// left和right之间可以挪动的最小间距
					let leftEmpty = node.leftBoundEmptyLength();
					let rightEmpty = node.rightBoundEmptyLength();
					let empty = Math.min(leftEmpty, rightEmpty);
					empty = Math.min(empty, (right.x - left.rightX()) >> 1);

					// left、right的子节点之间可以挪动的最小间距
					let space = left.minLevelSpaceToRight(right) - Printer.MIN_SPACE;
					space = Math.min(space >> 1, empty);

					// left、right往中间挪动
					if (space > 0) {
						left.translateX(space);
						right.translateX(-space);
					}

					// 继续挪动
					space = left.minLevelSpaceToRight(right) - Printer.MIN_SPACE;
					if (space < 1) continue;

					// 可以继续挪动的间距
					leftEmpty = node.leftBoundEmptyLength();
					rightEmpty = node.rightBoundEmptyLength();
					if (leftEmpty < 1 && rightEmpty < 1) continue;

					if (leftEmpty > rightEmpty) {
						left.translateX(Math.min(leftEmpty, space));
					} else {
						right.translateX(-Math.min(rightEmpty, space));
					}
				} else if (left != null) {
					left.translateX(node.leftBoundEmptyLength());
				} else { // right != null
					right.translateX(-node.rightBoundEmptyLength());
				}
      }
			for (const node of rowNodes) {
				const left = node.left;
				const right = node.right;
				if (left == null && right == null) continue;
			}
		}
  }

  /**
   * 添加一个元素节点
   * @param nodes 
   * @param btNode 
   */
  addNode(nodes: PrintNode[], btNode): PrintNode {
    let node = null;
		if (btNode != null) {
			node = new PrintNode(btNode, this.tree, this);
			this.maxWidth = Math.max(this.maxWidth, node.width);
			nodes.push(node);
		} else {
			nodes.push(null);
		}
		return node;
  }
}

class PrintNode {
  // 顶部符号距离父节点的最小距离（最小能填0）
  static TOP_LINE_SPACE = 1;
  btNode: any
  printer: Printer
  left: PrintNode
  right: PrintNode
  parent: PrintNode
  // 首字符的位置
  x: number
  y: number
  treeHeight: number
  string: string
  constructor(btNode, opetaion, printer) {
    this.left = null
    this.right = null
    this.parent = null
    this.btNode = btNode
    this.printer = printer
    this.init(opetaion.getString(btNode).toString());
  }

  get width() {
    return this.printer.getWidth(this.string)
  }

  init(string: string): void {
    string = (string === null) ? "null" : string;
    string = !string ? " " : string;
    this.string = string;
  }

  /**
   * 顶部方向字符的X（极其重要）
   * 
   * @return
   */
  topLineX() {
    // 宽度的一半
    let delta = this.width;
    if (delta % 2 === 0) {
      delta--;
    }
    delta >>= 1;

    if (this.parent !== null && this === this.parent.left) {
      return this.rightX() - 1 - delta;
    } else {
      return this.x + delta;
    }
  }

  /**
   * 右边界的位置（rightX 或者 右子节点topLineX的下一个位置）（极其重要）
   */
  rightBound(): number {
    if (this.right === null) return this.rightX();
    return this.right.topLineX() + 1;
  }

  /**
   * 左边界的位置（x 或者 左子节点topLineX）（极其重要）
   */
  leftBound(): number {
    if (this.left === null) return this.x;
    return this.left.topLineX();
  }

  /**
   * x ~ 左边界之间的长度（包括左边界字符）
   * 
   * @return
   */
  leftBoundLength(): number {
    return this.x - this.leftBound();
  }

  /**
   * rightX ~ 右边界之间的长度（包括右边界字符）
   * 
   * @return
   */
  rightBoundLength(): number {
    return this.rightBound() - this.rightX();
  }

  /**
   * 左边界可以清空的长度
   * 
   * @return
   */
  leftBoundEmptyLength(): number {
    return this.leftBoundLength() - 1 - PrintNode.TOP_LINE_SPACE;
  }

  /**
   * 右边界可以清空的长度
   * 
   * @return
   */
  rightBoundEmptyLength(): number {
    return this.rightBoundLength() - 1 - PrintNode.TOP_LINE_SPACE;
  }

  /**
   * 让left和right基于this对称
   */
  balance(left: PrintNode, right: PrintNode): void {
    if (left === null || right === null) return;
    // 【left的尾字符】与【this的首字符】之间的间距
    const deltaLeft = this.x - left.rightX();
    // 【this的尾字符】与【this的首字符】之间的间距
    const deltaRight = right.x - this.rightX();

    const delta = Math.max(deltaLeft, deltaRight);
    const newRightX = this.rightX() + delta;
    right.translateX(newRightX - right.x);

    const newLeftX = this.x - delta - left.width;
    left.translateX(newLeftX - left.x);
  }

  getTreeHeight(node: PrintNode): number {
    if (node === null) return 0;
    if (node.treeHeight != 0) return node.treeHeight;
    node.treeHeight = 1 + Math.max(
        this.getTreeHeight(node.left), this.getTreeHeight(node.right));
    return node.treeHeight;
  }

  /**
   * 和右节点之间的最小层级距离
   */
  minLevelSpaceToRight(right: PrintNode) {
    const thisHeight = this.getTreeHeight(this);
    const rightHeight = this.getTreeHeight(right);
    let minSpace = Number.MAX_VALUE;
    for (let i = 0; i < thisHeight && i < rightHeight; i++) {
      const space = right.levelInfo(i).leftX 
          - this.levelInfo(i).rightX;
      minSpace = Math.min(minSpace, space);
    }
    return minSpace;
  }

  levelInfo(level: number): LevelInfo {
    if (level < 0) return null;
    const levelY = this.y + level;
    if (level >= this.getTreeHeight(this)) return null;

    const list = [];
    const queue = []
    queue.push(this)

    // 层序遍历找出第level行的所有节点
    while (queue.length > 0) {
      const node = queue.shift();
      if (levelY == node.y) {
        list.push(node);
      } else if (node.y > levelY) break;

      if (node.left != null) {
        queue.push(node.left);
      }
      if (node.right != null) {
        queue.push(node.right);
      }
    }

    const left = list[0];
    const right = list[list.length - 1];
    return new LevelInfo(left, right);
  }

  /**
   * 尾字符的下一个位置
   */
  public rightX(): number {
    return this.x + this.width;
  }

  public translateX(deltaX: number): void {
    if (deltaX == 0) return;
    this.x += deltaX;

    // 如果是LineNode
    if (this.btNode == null) return;

    if (this.left != null) {
      this.left.translateX(deltaX);
    }
    if (this.right != null) {
      this.right.translateX(deltaX);
    }
  }
}

class LevelInfo {
  leftX;
  rightX;
  constructor(left: PrintNode, right: PrintNode) {
    this.leftX = left.leftBound();
    this.rightX = right.rightBound();
  }
}