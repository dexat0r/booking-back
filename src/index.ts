import App from "./express";

const app = new App({
    port: 3000,
    middleWares: [],
    routers: []
});

app.listen();