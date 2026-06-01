export type RouteCallback = () => void;

export class Router {
    private routes: Record<string, RouteCallback> = {};
    private notFoundCallback: RouteCallback | null = null;

    constructor() {
        window.addEventListener("popstate", () => {
            this.handleRoute(window.location.pathname);
        });
    }

    public register(path: string, callback: RouteCallback): void {
        this.routes[path] = callback;
    }

    // Register a fallback method if a route doesn't match
    public registerNotFound(callback: RouteCallback): void {
        this.notFoundCallback = callback;
    }

    public navigate(path: string): void {
        window.history.pushState({}, "", path);
        this.handleRoute(path);
    }

    public handleRoute(path: string): void {
        const callback = this.routes[path];
        if (callback) {
            callback();
        } else if (this.notFoundCallback) {
            this.notFoundCallback();
        } else {
            console.error(`Route fallback failure on path: ${path}`);
        }
    }
}