export interface AppState {
    currentPath: string;
    isLoggedIn: boolean; // 👈 Add this line
}

export class PageModel {
    private state: AppState;
    private listeners: Array<(state: AppState) => void> = [];

    constructor() {
        this.state = {
            currentPath: "/",
            isLoggedIn: false // 👈 Default to logged out
        };
    }

    public getState(): AppState {
        return { ...this.state };
    }

    // 👈 Method to change login state
    public setLoginStatus(status: boolean): void {
        this.state.isLoggedIn = status;
        this.notifyListeners();
    }

    public updatePath(path: string): void {
        this.state.currentPath = path;
        this.notifyListeners();
    }

    public subscribe(listener: (state: AppState) => void): void {
        this.listeners.push(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.state));
    }
}