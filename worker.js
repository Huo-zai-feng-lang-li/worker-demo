let intervalId = null;
let controller = null;
const fetchLatestData = async () => {
	// 如果之前有控制器存在，先废弃它 Warn:如果设置轮询时长过于短会终止上一个请求
	if (controller) controller.abort();
	controller = new AbortController(); // 创建一个新的AbortController实例
	const { signal } = controller; // 获取其信号量
	try {
		const initOptions = {
			// method: "GET",
			// headers: {
			// 	"Content-Type": "application/json",
			// },
			signal,
			// body: JSON.stringify({ tableId: 15 }),
		};

		const response = await fetch(
			"https://jsonplaceholder.typicode.com/posts",
			initOptions
		);

		const data = await response.json();
		const selected = data.sort(() => 0.2 - Math.random()).slice(0, 2);
		self.postMessage({
			name: "Worker: 轮询已启动",
			data: selected,
		});
	} catch (error) {
		if (error.name === "AbortError") {
			self.postMessage({ name: "Worker: 请求被中止" });
		} else {
			self.postMessage({ error: "获取数据失败啦！~" });
			self.postMessage({ error: "获取数据失败啦！~", detail: error });
		}
	}
};

self.onmessage = (e) => {
	if (e.data === "start_Worker") {
		// 如果已经有轮询在进行中，先清除它
		if (intervalId) clearInterval(intervalId);

		// 立即执行一次数据获取，然后设置轮询
		fetchLatestData();
		intervalId = setInterval(fetchLatestData, 2000);
	} else if (e.data === "stop_Worker") {
		// 清除定时器，停止轮询
		clearInterval(intervalId);
		intervalId = null;
		if (controller) {
			controller.abort();
			controller = null;
		}
		self.postMessage("Worker: 轮询已停止");
	}
};
