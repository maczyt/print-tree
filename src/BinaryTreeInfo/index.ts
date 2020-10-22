import { createCanvas } from 'canvas'
import * as terminalImage from 'terminal-image'

const defaultOptions = {
  lineColor: 'rgb(66,66,66)',
  rectColor: 'rgb(249, 38, 114)',
  fontColor: '#fff',
  rectHeight:  30,
  canvasWidth: 500,
  canvasHeight: 300,
  font: 'bold 16px Consolas',
  textAlign: 'center',
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
  constructor(tree, ctx, options) {
    this.tree = tree
    this.ctx = ctx
    this.options = options
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
    console.log(await terminalImage.buffer(canvas.toBuffer(), options.terminalImageOptions))
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
    const { ctx, options: { rectHeight, lineColor } } = this
    var content = this.tree.getString(left)
    var text = ctx.measureText(content)
    const currentRectWidth = getWidth(text)
    const leftRectWidth = this.getLineWidth(left)
    const destX = x - (leftRectWidth >> 1)
    const destY = y + rectHeight
    ctx.beginPath();
    ctx.moveTo(x, y)
    ctx.lineTo(x - (leftRectWidth >> 1), y)
    ctx.lineTo(destX, destY)
    ctx.lineTo(destX - 5, destY - 5)
    ctx.lineTo(destX, destY)
    ctx.lineTo(destX + 5, destY - 5)
    ctx.save()
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()
    ctx.closePath()
    this.drawNode(left, destX - (currentRectWidth >> 1), destY)
  }

  /**
   * 绘制线段 & 节点
   * @param right
   * @param x 
   * @param y 
   */
  drawRight(right, x, y) {
    const { ctx, options: { rectHeight, lineColor } } = this
    if (right === null) return
    var content = this.tree.getString(right)
    var text = ctx.measureText(content)
    const currentRectWidth = getWidth(text)
    const rightRectWidth = this.getLineWidth(right)
    const destX = x + (rightRectWidth >> 1)
    const destY = y + rectHeight
    ctx.beginPath();
    ctx.moveTo(x, y)
    ctx.lineTo(x + (rightRectWidth >> 1), y)
    ctx.lineTo(destX, destY)
    ctx.lineTo(destX - 5, destY - 5)
    ctx.lineTo(destX, destY)
    ctx.lineTo(destX + 5, destY - 5)
    ctx.save()
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()
    ctx.closePath()
    this.drawNode(right, destX - (currentRectWidth >> 1), destY)
  }

  private getLineWidth(node) {
    const { ctx, tree } = this
    let width = 0
    if (node) {
      let content = tree.getString(node)
      let text = ctx.measureText(content)
      width += getWidth(text)
      width += this.getLineWidth(tree.getLeft(node))
      width += this.getLineWidth(tree.getRight(node))
    }
    return width
  }
}