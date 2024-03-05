# Web Worker 示例项目

本项目演示了如何在 Web 应用中使用 Web Worker 来执行后台任务，以避免阻塞主线程并提高页面的响应性。

## 技术栈

- HTML
- JavaScript
- Web Worker

## 功能

- 使用 Web Worker 处理耗时的数据计算，避免阻塞主线程。
- 主线程与 Worker 线程之间的消息传递。

## 如何运行

1. 克隆本仓库到本地。
2. 在本地服务器上打开项目根目录（可以使用 Python 的 `http.server` 模块，或者 Node.js 的 `http-server` 包）。
3. 在浏览器中访问 `index.html`。

## 项目结构

- `index.html` - 主页面，用户界面。
- `main.js` - 主线程脚本，负责 UI 交互和与 Worker 通信。
- `worker.js` - Web Worker 脚本，执行耗时任务。

## 示例代码

### 主线程：main.js

```javascript
// 创建一个新的 Worker
const myWorker = new Worker("worker.js");
// 向 Worker 发送数据
myWorker.postMessage("Hello, Worker!");
// 接收来自 Worker 的消息
myWorker.onmessage = function (e) {
	console.log("Message received from worker:", e.data);
};
```

### Worker 线程：worker.js

```javascript
// 监听来自主线程的消息
self.onmessage = function (e) {
	console.log("Worker: Message received from main script");
	const result = e.data * 2;
	// 向主线程发送消息
	postMessage(result);
};
```

## 注意事项

- Web Worker 无法访问 DOM。
- 传递给 Worker 的数据是通过结构化克隆算法克隆的，Worker 不能直接操作原始数据。
- 确保在支持 Web Worker 的环境中运行示例。

## 参考资料

- [Web Workers MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
