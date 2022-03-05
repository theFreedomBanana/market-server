const fs = require('fs');
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const items = JSON.parse(fs.readFileSync("db.json", "utf8")).items;

countPerCompany = {};
const countPerTag = {};
items.forEach(({ manufacturer, tags }) => {
	if (countPerCompany[manufacturer]) {
		countPerCompany[manufacturer]++;
	} else {
		countPerCompany[manufacturer] = 1;
	}

	tags.forEach((tag) => {
		if (countPerTag[tag]) {
			countPerTag[tag]++;
		} else {
			countPerTag[tag] = 1;
		}
	});
});

server.use(middlewares);

const port = process.env.PORT || 3000;

server.get(
	"/counts/:filter/",
	(req, res) => {
		if (req.params.filter === "company") {
			res.jsonp(countPerCompany);
		} else if (req.params.filter === "tags") {
			res.jsonp(countPerTag);
		}
	},
);

server.use(router);
server.listen(port, () => {
	console.log(`Market DB is running on port ${port}`)
})
