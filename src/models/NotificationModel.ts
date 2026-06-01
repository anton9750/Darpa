export interface SystemNotification {
    id: string;
    message: string;
    type: "SUCCESS" | "WARNING" | "ALERT";
}

export class NotificationModel {
    private notifications: SystemNotification[] = [];
    private listeners: Array<() => void> = [];

    public getNotifications(): SystemNotification[] {
        return this.notifications;
    }

    public trigger(message: string, type: "SUCCESS" | "WARNING" | "ALERT" = "SUCCESS"): void {
        const id = Math.random().toString(36).substring(2, 9);
        this.notifications.push({ id, message, type });
        this.notifyListeners();

        // Automatically clear notifications after 3.5 seconds
        setTimeout(() => {
            this.notifications = this.notifications.filter(n => n.id !== id);
            this.notifyListeners();
        }, 3500);
    }

    public subscribe(listener: () => void): void {
        this.listeners.push(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener());
    }
}