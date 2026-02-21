import { Task, TaskPriority, SubTask, BoardState, Column } from '../types/kanban';

const VALID_PRIORITIES: TaskPriority[] = ['Basse', 'Moyenne', 'Haute', 'Important', 'Crucial'];

function isValidSubTask(data: any): data is SubTask {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.id === 'string' &&
        typeof data.title === 'string' &&
        typeof data.isCompleted === 'boolean'
    );
}

function isValidColumn(data: any): data is Column {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.id === 'string' &&
        typeof data.title === 'string' &&
        typeof data.colorClass === 'string' &&
        Array.isArray(data.taskIds) &&
        data.taskIds.every((id: any) => typeof id === 'string')
    );
}

function isValidTask(data: any): data is Task {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.id === 'string' &&
        typeof data.columnId === 'string' &&
        typeof data.title === 'string' &&
        typeof data.description === 'string' &&
        VALID_PRIORITIES.includes(data.priority) &&
        Array.isArray(data.subTasks) &&
        data.subTasks.every(isValidSubTask) &&
        (data.dueDate === undefined || typeof data.dueDate === 'string') &&
        (data.imageUrl === undefined || typeof data.imageUrl === 'string') &&
        (data.avatars === undefined || (Array.isArray(data.avatars) && data.avatars.every((a: any) => typeof a === 'string'))) &&
        (data.tags === undefined || (Array.isArray(data.tags) && data.tags.every((t: any) => typeof t === 'string')))
    );
}

export function isValidBoardState(data: any): data is BoardState {
    if (typeof data !== 'object' || data === null) return false;

    if (!Array.isArray(data.columns) || !data.columns.every(isValidColumn)) return false;

    if (typeof data.tasks !== 'object' || data.tasks === null || Array.isArray(data.tasks)) return false;

    // Build sets for Relational Integrity checking (Foreign Keys)
    const columnIds = new Set(data.columns.map((c: any) => c.id));
    const taskIds = new Set(Object.keys(data.tasks));

    for (const key in data.tasks) {
        const task = data.tasks[key];
        if (!isValidTask(task)) return false;

        // Relational Check: Task must belong to an existing Column
        if (!columnIds.has(task.columnId)) {
            console.error(`Security Guard: Task ${task.id} references missing column ${task.columnId}`);
            return false;
        }
    }

    for (const col of data.columns) {
        for (const taskId of col.taskIds) {
            // Relational Check: Column must only reference existing Tasks
            if (!taskIds.has(taskId)) {
                console.error(`Security Guard: Column ${col.id} references missing task ${taskId}`);
                return false;
            }
        }
    }

    return true;
}
