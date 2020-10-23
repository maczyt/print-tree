import { createCanvas } from 'canvas'

const defaultOptions = {
  lineColor: 'rgb(66,66,66)',
  rectColor: 'rgb(249, 38, 114)',
  fontColor: '#fff',
  rectHeight:  30,
  canvasWidth: 500,
  canvasHeight: 300,
  font: 'bold 16px Consolas',
  textAlign: 'center',
  output: 'log', // log or image
  terminalImageOptions: {
    width: '50%',
    height: '50%',
  },
}

const getWidth = (text, padding = 20, mini = 50) => {
  return Math.max(text.width + padding, mini)
}

export default class BinaryTreeInfo {
  private tree: any
  private ctx: CanvasRenderingContext2D
  private options: any
  private points: Array<any>
  constructor(tree, ctx, options) {
    this.tree = tree
    this.ctx = ctx
    this.options = options
    this.points = []
  }

  static async print(tree, options) {
    options = Object.assign({}, defaultOptions, options)
    const { textAlign, font, canvasWidth, canvasHeight, } = options
    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')
    ctx.font = font
    ctx.textAlign = textAlign
    const startPoint = [canvas.width >> 1, 20]
    const info = new BinaryTreeInfo(tree, ctx, options)
    const root = tree.getRoot()
    info.drawNode(root, startPoint[0], startPoint[1])
    if (options.output === 'log') {
      const terminalImage = require('terminal-image')
      console.log(await terminalImage.buffer(canvas.toBuffer(), options.terminalImageOptions))
    } else if (options.output === 'image') {
      const fs = require('fs')
      const path = require('path')
      fs.writeFileSync(path.resolve(process.cwd(), 'binaryTree.png'), canvas.toBuffer())
    }
  }

  /**
   * draw 节点
   * @param node 
   * @param x 
   * @param y 
   */
  drawNode(node, x, y) {
    const { ctx, options: { lineColor, rectColor, fontColor, rectHeight, } } = this
    const content = this.tree.getString(node)
    const text = ctx.measureText(content)
    const rectWidth = getWidth(text)
    ctx.save()
    ctx.translate(x, y)
    const { e, f } = ctx['currentTransform']
    this.points.push([e, e + rectWidth, f])
    // 1. 最外层
    ctx.fillStyle = lineColor
    ctx.fillRect(0, 0, rectWidth, rectHeight)

    // 2. 红色层
    ctx.fillStyle = rectColor
    ctx.fillRect(2, 2, rectWidth - 4, rectHeight - 4)

    // 3. 内容
    ctx.fillStyle = fontColor
    ctx.fillText(content, rectWidth >> 1, (rectHeight >> 1) + 6)

    this.drawLeft(this.tree.getLeft(node), 0, rectHeight >> 1)
    this.drawRight(this.tree.getRight(node), rectWidth, rectHeight >> 1)
    ctx.restore()
  }

  /**
   * 绘制线段 & 节点
   * @param left 
   * @param x 
   * @param y 
   */
  drawLeft(left, x, y) {
    if (left === null) return
    const { ctx, options } = this
    const { rectHeight } = options
    const content = left.element.toString()
    const text = ctx.measureText(content)
    const currentRectWidth = getWidth(text)
    const leftRectWidth = currentRectWidth // getLineWidth(left)
    let destX = x - (leftRectWidth)
    let destY = y + rectHeight
    let newNodePoint = [destX - (currentRectWidth >> 1), destY]
    const chongdieDistance = this.overlap(
      newNodePoint[0], newNodePoint[1], currentRectWidth
    )
    if (chongdieDistance > 0) {
      destX = destX + 15
      newNodePoint = [destX - (currentRectWidth >> 1), destY]
      options.lineColor = 'rgba(64,158,255,.7)'
      options.rectColor = 'rgba(249, 38, 114,.5)'
    } else {
      options.lineColor = 'rgba(66,66,66,1)'
      options.rectColor = 'rgba(249, 38, 114,1)'
    }
    ctx.beginPath();
    ctx.moveTo(x, y)
    ctx.lineTo(destX, y)
    ctx.lineTo(destX, destY)
    ctx.lineTo(destX - 5, destY - 5)
    ctx.lineTo(destX, destY)
    ctx.lineTo(destX + 5, destY - 5)
    ctx.save()
    ctx.strokeStyle = options.lineColor
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()
    ctx.closePath()
    this.drawNode(left, newNodePoint[0], newNodePoint[1])
  }

  /**
   * 绘制线段 & 节点
   * @param right
   * @param x 
   * @param y 
   */
  drawRight(right, x, y) {
    if (right === null) return
    const { ctx, options } = this
    const { rectHeight } = options
    const content = right.element.toString()
    const text = ctx.measureText(content)
    const currentRectWidth = getWidth(text)
    const rightRectWidth = currentRectWidth // getLineWidth(right)
    let destX = x + (rightRectWidth)
    let destY = y + rectHeight
    let newNodePoint = [destX - (currentRectWidth >> 1), destY]
    const chongdieDistance = this.overlap(
      newNodePoint[0], newNodePoint[1], currentRectWidth
    )
    if (chongdieDistance > 0) {
      destX = destX + 15
      newNodePoint = [destX - (currentRectWidth >> 1), destY]
      options.lineColor = 'rgba(64,158,255,.7)'
      options.rectColor = 'rgba(249, 38, 114,.5)'
    } else {
      options.lineColor = 'rgba(66,66,66,1)'
      options.rectColor = 'rgba(249, 38, 114,1)'
    }
    ctx.beginPath();
    ctx.moveTo(x, y)
    ctx.lineTo(destX, y)
    ctx.lineTo(destX, destY)
    ctx.lineTo(destX - 5, destY - 5)
    ctx.lineTo(destX, destY)
    ctx.lineTo(destX + 5, destY - 5)
    ctx.save()
    ctx.strokeStyle = options.lineColor
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()
    ctx.closePath()
    this.drawNode(right, newNodePoint[0], newNodePoint[1])
  }

  private overlap(x, y, w) {
    const ctx = this.ctx
    const { e, f } = ctx['currentTransform']
    x += e
    y += f
    let distance = 0
    let isChongdie = this.points.some(([pointL, pointR, pointY]) => {
      distance = pointR - x
      return !(pointY !== y || x > pointR || x + w < pointL)
    })
    if (isChongdie) {
      return distance
    }
    return 0
  }
}