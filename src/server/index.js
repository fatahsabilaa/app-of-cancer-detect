require("dotenv").config();
const Hapi = require("@hapi/hapi");
const routes = require("../server/routes");
const loadModel = require("../services/model");
const inputError = require("../exception/inputError");
const { model } = require("@tensorflow/tfjs-node");

(async () => {
    const server = Hapi.server({
        port: process.env.APP_PORT || 8080,
        host: process.env.APP_HOST || "0.0.0.0",
        routes: {
            cors: {
                origin: ["*"],
            },
            payload: {
                maxBytes: 1 * 1024 * 1024,
            },
        },
    });
    const model = await loadModel();
    server.app.model = model;

    server.route(routes);
    server.ext("onPreResponse", (request, h) => {
        const response = request.response;

        if (response.isBoom && response.output.statusCode === 413) {
            const newResponse = h.response({
                status: "fail",
                message: "Payload content length greater than maximum allowed: 1000000"
            });
            newResponse.code(413);
            return newResponse;
        }
        if (response instanceof inputError) {
            const newResponse = h.response({
                status: "fail",
                message: `${response.message}`
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }
        if (response.isBoom) {
            const newResponse = h.response({
                status: "fail",
                message: response.message
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }
        return h.continue;
    });
    await server.start();
    console.log("Server running on :", server.info.uri);
})();