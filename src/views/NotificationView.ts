import { View } from "./View";
import { SystemNotification } from "../models/NotificationModel";

export class NotificationView extends View {
    private notifications: SystemNotification[] = [];

    public updateState(notifications: SystemNotification[]): void {
        this.notifications = notifications;
    }

    public render(): string {
        if (this.notifications.length === 0) return `<div id="toast-deck" class="fixed bottom-6 right-6 z-50 space-y-2"></div>`;

        const cards = this.notifications.map(n => {
            let colors = "border-neutral-900 bg-white text-neutral-900";
            if (n.type === "ALERT") colors = "border-red-500 bg-red-50 text-red-900";
            if (n.type === "WARNING") colors = "border-amber-500 bg-amber-50 text-amber-900";

            return `
                <div class="border-l-4 p-4 shadow-md font-mono text-[11px] w-80 flex flex-col backdrop-blur-sm animate-slide-in ${colors}">
                    <span class="font-black text-[9px] opacity-40 uppercase tracking-widest mb-1">// SYSTEM ${n.type}</span>
                    <span class="tracking-tight leading-normal">${n.message}</span>
                </div>
            `;
        }).join("");

        return `<div id="toast-deck" class="fixed bottom-6 right-6 z-50 space-y-2">${cards}</div>`;
    }
}