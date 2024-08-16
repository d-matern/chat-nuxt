export default defineEventHandler((event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    setHeaders(event, headers);

    if (event.node.req.method === "OPTIONS") {
        event.node.res.statusCode = 204;
        event.node.res.end();
    }
});