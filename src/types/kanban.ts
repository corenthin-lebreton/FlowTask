export type TaskPriority = 'Basse' | 'Moyenne' | 'Haute' | 'Important' | 'Crucial';

export interface SubTask {
    id: string;
    title: string;
    isCompleted: boolean;
}

export interface Column {
    id: string;
    title: string;
    colorClass: string;
    taskIds: string[];
}

export interface Task {
    id: string;
    columnId: string;
    title: string;
    description: string;
    priority: TaskPriority;
    subTasks: SubTask[];
    dueDate?: string;
    avatars?: string[];
    tags?: string[];
    imageUrl?: string;
}

export interface BoardState {
    columns: Column[];
    tasks: Record<string, Task>;
}
