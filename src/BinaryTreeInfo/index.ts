import { createCanvas } from 'canvas'
import Printer from './Printer'

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

export class BinaryTreeInfo extends Printer {
  private ctx: CanvasRenderingContext2D
  private options: any
  constructor(tree, ctx, options) {
    super(tree)
    this.ctx = ctx
    this.options = options
  }

  getWidth(string): number {
    const text = this.ctx.measureText(string)
    return Math.max(text.width + 10, 20)
  }

  static async print(tree, options) {
    options = Object.assign({}, defaultOptions, options)
    const { textAlign, font, canvasWidth, canvasHeight, } = options
    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')
    ctx.font = font
    ctx.textAlign = textAlign
    const info = new BinaryTreeInfo(tree, ctx, options)
    info.maxWidth = info.root.width
    info.makeLocation()
    
    // 画节点
    for (const rowNodes of info.nodes) {
      for (const node of rowNodes) {
        info.drawNode(node, node.x, node.y * 40)
      }
    }
    // reset
    ctx.translate(0, 0)
    // 画线段
    const queue = [info.root]
    const middleRectHeight = options.rectHeight >> 1
    while (queue.length > 0) {
      const node = queue.shift()
      const left = node.left
      const right = node.right
      // 左子节点
      if (left !== null) {
        const start = [node.x, node.y * 40 + middleRectHeight]
        const middle = [left.x + (left.width >> 1), node.y * 40 + middleRectHeight]
        const end = [left.x + (left.width >> 1), left.y * 40]
        info.drawLine(start, middle, end)
        queue.push(left)
      }
      // 右子节点
      if (right !== null) {
        const start = [node.x + node.width, node.y * 40 + middleRectHeight]
        const middle = [right.x + (right.width >> 1), node.y * 40 + middleRectHeight]
        const end = [right.x + (right.width >> 1), right.y * 40]
        info.drawLine(start, middle, end)
        queue.push(right)
      }
    }

    if (options.output === 'log') {
      const terminalImage = require('terminal-image')
      console.log(await terminalImage.buffer(canvas.toBuffer(), options.terminalImageOptions))
    } else if (options.output === 'image') {
      const fs = require('fs')
      const path = require('path')
      fs.writeFileSync(path.resolve(process.cwd(), 'binaryTree.png'), canvas.toBuffer())
      console.log('Success!')
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
    const content = node.string
    ctx.save()
    ctx.translate(x, y)
    const rectWidth = node.width
    // 1. 最外层
    ctx.fillStyle = lineColor
    ctx.fillRect(0, 0, rectWidth, rectHeight)

    // 2. 红色层
    ctx.fillStyle = rectColor
    ctx.fillRect(2, 2, rectWidth - 4, rectHeight - 4)

    // 3. 内容
    ctx.fillStyle = fontColor
    ctx.fillText(content, rectWidth >> 1, (rectHeight >> 1) + 6, rectWidth)
    ctx.restore()
  }

  private drawLine(start, middle, end) {
    const { ctx, options } = this
    ctx.beginPath();
    ctx.moveTo(start[0], start[1])
    ctx.lineTo(middle[0], middle[1])
    ctx.lineTo(end[0], end[1])
    ctx.lineTo(end[0] - 5, end[1] - 5)
    ctx.lineTo(end[0], end[1])
    ctx.lineTo(end[0] + 5, end[1] - 5)
    ctx.save()
    ctx.strokeStyle = options.lineColor
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.restore()
    ctx.closePath()
  }
}