export interface Coefficients {
    a: number;
    b: number;
    c: number;
}

export interface GraphDataPoint {
    x: number;
    y: number;
}

export enum TabOption {
    VISUALIZATION = 'VISUALIZATION',
    KNOWLEDGE = 'KNOWLEDGE',
    AI_TUTOR = 'AI_TUTOR'
}

export interface KnowledgePoint {
    title: string;
    content: string;
    importance: 'High' | 'Medium' | 'Low';
}

export type HighlightFeature = 'VERTEX' | 'AXIS' | 'ROOTS' | 'SHAPE' | 'LINE';
