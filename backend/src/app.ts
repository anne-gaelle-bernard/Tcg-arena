type RequestLike = {
	method?: string;
	url?: string;
};

type ResponseLike = {
	statusCode: number;
	setHeader: (name: string, value: string) => void;
	end: (body?: string) => void;
};

export function handleRequest(req: RequestLike, res: ResponseLike): void {
	const method = req.method ?? "GET";
	const url = req.url ?? "/";

	res.setHeader("Content-Type", "application/json; charset=utf-8");

	if (method === "GET" && url === "/health") {
		res.statusCode = 200;
		res.end(JSON.stringify({ status: "ok" }));
		return;
	}

	if (method === "GET" && url === "/") {
		res.statusCode = 200;
		res.end(JSON.stringify({ message: "Backend Node + TypeScript prêt" }));
		return;
	}

	res.statusCode = 404;
	res.end(JSON.stringify({ error: "Not found" }));
}
