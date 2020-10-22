'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var canvas = require('canvas');
var terminalImage = require('terminal-image');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var defaultOptions = {
    lineColor: 'rgb(66,66,66)',
    rectColor: 'rgb(249, 38, 114)',
    fontColor: '#fff',
    rectHeight: 30,
    canvasWidth: 500,
    canvasHeight: 300,
    font: 'bold 16px Consolas',
    textAlign: 'center',
    terminalImageOptions: {
        width: '50%',
        height: '50%',
    },
};
var getWidth = function (text, padding, mini) {
    if (padding === void 0) { padding = 20; }
    if (mini === void 0) { mini = 50; }
    return Math.max(text.width + padding, mini);
};
var BinaryTreeInfo = /** @class */ (function () {
    function BinaryTreeInfo(tree, ctx, options) {
        this.tree = tree;
        this.ctx = ctx;
        this.options = options;
    }
    BinaryTreeInfo.print = function (tree, options) {
        return __awaiter(this, void 0, void 0, function () {
            var textAlign, font, canvasWidth, canvasHeight, canvas$1, ctx, startPoint, info, root, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        options = Object.assign({}, defaultOptions, options);
                        textAlign = options.textAlign, font = options.font, canvasWidth = options.canvasWidth, canvasHeight = options.canvasHeight;
                        canvas$1 = canvas.createCanvas(canvasWidth, canvasHeight);
                        ctx = canvas$1.getContext('2d');
                        ctx.font = font;
                        ctx.textAlign = textAlign;
                        startPoint = [canvas$1.width >> 1, 20];
                        info = new BinaryTreeInfo(tree, ctx, options);
                        root = tree.getRoot();
                        info.drawNode(root, startPoint[0], startPoint[1]);
                        _b = (_a = console).log;
                        return [4 /*yield*/, terminalImage.buffer(canvas$1.toBuffer(), options.terminalImageOptions)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * draw 节点
     * @param node
     * @param x
     * @param y
     */
    BinaryTreeInfo.prototype.drawNode = function (node, x, y) {
        var _a = this, ctx = _a.ctx, _b = _a.options, lineColor = _b.lineColor, rectColor = _b.rectColor, fontColor = _b.fontColor, rectHeight = _b.rectHeight;
        var content = this.tree.getString(node);
        var text = ctx.measureText(content);
        var rectWidth = getWidth(text);
        ctx.save();
        ctx.translate(x, y);
        // 1. 最外层
        ctx.fillStyle = lineColor;
        ctx.fillRect(0, 0, rectWidth, rectHeight);
        // 2. 红色层
        ctx.fillStyle = rectColor;
        ctx.fillRect(2, 2, rectWidth - 4, rectHeight - 4);
        // 3. 内容
        ctx.fillStyle = fontColor;
        ctx.fillText(content, rectWidth >> 1, (rectHeight >> 1) + 6);
        this.drawLeft(this.tree.getLeft(node), 0, rectHeight >> 1);
        this.drawRight(this.tree.getRight(node), rectWidth, rectHeight >> 1);
        ctx.restore();
    };
    /**
     * 绘制线段 & 节点
     * @param left
     * @param x
     * @param y
     */
    BinaryTreeInfo.prototype.drawLeft = function (left, x, y) {
        if (left === null)
            return;
        var _a = this, ctx = _a.ctx, _b = _a.options, rectHeight = _b.rectHeight, lineColor = _b.lineColor;
        var content = this.tree.getString(left);
        var text = ctx.measureText(content);
        var currentRectWidth = getWidth(text);
        var leftRectWidth = this.getLineWidth(left);
        var destX = x - (leftRectWidth >> 1);
        var destY = y + rectHeight;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - (leftRectWidth >> 1), y);
        ctx.lineTo(destX, destY);
        ctx.lineTo(destX - 5, destY - 5);
        ctx.lineTo(destX, destY);
        ctx.lineTo(destX + 5, destY - 5);
        ctx.save();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
        this.drawNode(left, destX - (currentRectWidth >> 1), destY);
    };
    /**
     * 绘制线段 & 节点
     * @param right
     * @param x
     * @param y
     */
    BinaryTreeInfo.prototype.drawRight = function (right, x, y) {
        var _a = this, ctx = _a.ctx, _b = _a.options, rectHeight = _b.rectHeight, lineColor = _b.lineColor;
        if (right === null)
            return;
        var content = this.tree.getString(right);
        var text = ctx.measureText(content);
        var currentRectWidth = getWidth(text);
        var rightRectWidth = this.getLineWidth(right);
        var destX = x + (rightRectWidth >> 1);
        var destY = y + rectHeight;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (rightRectWidth >> 1), y);
        ctx.lineTo(destX, destY);
        ctx.lineTo(destX - 5, destY - 5);
        ctx.lineTo(destX, destY);
        ctx.lineTo(destX + 5, destY - 5);
        ctx.save();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
        this.drawNode(right, destX - (currentRectWidth >> 1), destY);
    };
    BinaryTreeInfo.prototype.getLineWidth = function (node) {
        var _a = this, ctx = _a.ctx, tree = _a.tree;
        var width = 0;
        if (node) {
            var content = tree.getString(node);
            var text = ctx.measureText(content);
            width += getWidth(text);
            width += this.getLineWidth(tree.getLeft(node));
            width += this.getLineWidth(tree.getRight(node));
        }
        return width;
    };
    return BinaryTreeInfo;
}());

exports.BinaryTreeInfo = BinaryTreeInfo;
