export default defineEventHandler((event) => {
    // const allowedOrigins = [`exp://${process.env.SECRET_KEY_MOBILE_APP}`];

    //  if (event.node.req.headers.origin && allowedOrigins.includes(event.node.req.headers.origin)) {
    //     const headers = {
    //         "Access-Control-Allow-Origin": event.node.req.headers.origin,
    //         "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    //         "Access-Control-Allow-Headers": "Content-Type, Authorization",
    //     };

    //     for (const [key, value] of Object.entries(headers)) {
    //         event.node.res.setHeader(key, value);
    //     }

    //     if (event.node.req.method === "OPTIONS") {
    //         event.node.res.statusCode = 204;
    //         event.node.res.end();
    //     }
    // }

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    for (const [key, value] of Object.entries(headers)) {
        event.node.res.setHeader(key, value);
    }

    if (event.node.req.method === "OPTIONS") {
        event.node.res.statusCode = 204;
        event.node.res.end();
    }
});