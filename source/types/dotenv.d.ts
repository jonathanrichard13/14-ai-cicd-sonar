declare module 'dotenv' {
    export function config(): void;
    export function parse(src: string): { [key: string]: string };
}
