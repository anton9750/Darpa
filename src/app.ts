import { Router } from "./router/Router";
import { PageModel } from "./models/PageModel";
import { NavigationController } from "./controller/NavigationController";

// Instantiate the SPA Engine
const router = new Router();
const model = new PageModel();

// NavigationController attaches to router/models and initiates rendering cycles
new NavigationController(router, model);

// Read current browser path configuration directly upon terminal initialization
router.handleRoute(window.location.pathname);