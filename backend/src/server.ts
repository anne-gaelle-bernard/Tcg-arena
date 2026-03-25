declare const process: {
	env: Record<string, string | undefined>;
};

declare function require(moduleName: string): any;

const http = require("node:http");
const { handleRequest } = require("./app");

const port = Number(process.env.PORT ?? 3001);

const server = http.createServer(handleRequest);

server.listen(port, () => {
	console.log(`Backend lancé sur http://localhost:${port}`);
});
