export type TextSegment = {
    text: string;
    color?: string;
};
export declare const parseText: (text: string) => TextSegment[];
