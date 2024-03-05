let intervalId = null;
let controllers = new Map();

const fetchLatestData = async () => {
	const controller = new AbortController();
	controllers.set(controller, true);
	const { signal } = controller;

	try {
		const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
			signal,
		});
		const data = await response.json();
		const selected = data.sort(() => 0.5 - Math.random()).slice(0, 5);
		self.postMessage({
			name: "Worker: 轮询已启动",
			data: selected,
		});
	} catch (error) {
		if (error.name === "AbortError") {
			self.postMessage({ name: "Worker: 请求被中止" });
		} else {
			self.postMessage({ error: "MyDIY---获取数据失败" });
		}
	} finally {
		// 请求完成后，无论成功或失败，都从Map中移除控制器
		controllers.delete(controller);
	}
};

self.onmessage = (e) => {
	if (e.data === "start_Worker") {
		if (intervalId) clearInterval(intervalId);
		fetchLatestData();
		//Tip: 时间设置的短一些，可以看到之前挂起的请求被中止的效果
		intervalId = setInterval(fetchLatestData, 20);
	} else if (e.data === "stop_Worker") {
		clearInterval(intervalId);
		intervalId = null;
		// 取消所有活跃的请求
		for (let controller of controllers.keys()) {
			controller.abort();
		}
		controllers.clear();
		self.postMessage("Worker: 轮询已停止");
	}
};
