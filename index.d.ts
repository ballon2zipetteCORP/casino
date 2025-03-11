export interface IToastParams {
    level: "ERROR"|"SUCCESS"|"INFO"|"WARNING";
    title: string;
    subtitle?: string;
}

declare global {
    interface Window {
        toast(params: IToastParams): void;
    }   
}
