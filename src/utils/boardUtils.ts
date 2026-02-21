import { Task, BoardState, Column, TaskPriority, SubTask } from '../types/kanban';

export const createColumn = (state: BoardState, title: string, colorClass: string): BoardState => {
    const newCol: Column = {
        id: crypto.randomUUID(),
        title,
        colorClass,
        taskIds: []
    };
    return { ...state, columns: [...state.columns, newCol] };
};

export const createTask = (state: BoardState, newTaskData: Omit<Task, 'id'>): BoardState => {
    const taskId = crypto.randomUUID();
    const newTask: Task = { ...newTaskData, id: taskId };

    return {
        ...state,
        tasks: { ...state.tasks, [taskId]: newTask },
        columns: state.columns.map(col =>
            col.id === newTask.columnId
                ? { ...col, taskIds: [...col.taskIds, taskId] }
                : col
        )
    };
};

export const renameColumnInBoard = (state: BoardState, colId: string, newTitle: string): BoardState => {
    return {
        ...state,
        columns: state.columns.map(col =>
            col.id === colId ? { ...col, title: newTitle } : col
        )
    };
};

export const removeColumnFromBoard = (state: BoardState, colId: string): BoardState => {
    const colToDelete = state.columns.find(c => c.id === colId);
    if (!colToDelete) return state;

    // Filter out the column
    const newColumns = state.columns.filter(c => c.id !== colId);

    // Filter out orphaned tasks
    const newTasks = { ...state.tasks };
    colToDelete.taskIds.forEach(taskId => {
        delete newTasks[taskId];
    });

    return {
        ...state,
        columns: newColumns,
        tasks: newTasks
    };
};

export const updateTaskInList = (state: BoardState, id: string, updates: Partial<Task>): BoardState => {
    const task = state.tasks[id];
    if (!task) return state;

    return {
        ...state,
        tasks: {
            ...state.tasks,
            [id]: { ...task, ...updates }
        }
    };
};

export const removeTaskFromList = (state: BoardState, id: string): BoardState => {
    const task = state.tasks[id];
    if (!task) return state;

    const newTasks = { ...state.tasks };
    delete newTasks[id];

    return {
        ...state,
        tasks: newTasks,
        columns: state.columns.map(col =>
            col.id === task.columnId
                ? { ...col, taskIds: col.taskIds.filter(tid => tid !== id) }
                : col
        )
    };
};

export const toggleSubTaskInList = (state: BoardState, taskId: string, subTaskId: string): BoardState => {
    const task = state.tasks[taskId];
    if (!task) return state;

    const updatedSubTasks = task.subTasks.map(sub =>
        sub.id === subTaskId ? { ...sub, isCompleted: !sub.isCompleted } : sub
    );

    return {
        ...state,
        tasks: {
            ...state.tasks,
            [taskId]: { ...task, subTasks: updatedSubTasks }
        }
    };
};

export const addSubTaskToList = (state: BoardState, taskId: string, subTaskTitle: string): BoardState => {
    const task = state.tasks[taskId];
    if (!task) return state;

    const newSubTask: SubTask = {
        id: crypto.randomUUID(),
        title: subTaskTitle,
        isCompleted: false
    };

    return {
        ...state,
        tasks: {
            ...state.tasks,
            [taskId]: { ...task, subTasks: [...task.subTasks, newSubTask] }
        }
    };
};

export const deleteSubTaskFromList = (state: BoardState, taskId: string, subTaskId: string): BoardState => {
    const task = state.tasks[taskId];
    if (!task) return state;

    // Filter creates a fresh array avoiding direct splice mutations
    const updatedSubTasks = task.subTasks.filter(sub => sub.id !== subTaskId);

    return {
        ...state,
        tasks: {
            ...state.tasks,
            [taskId]: { ...task, subTasks: updatedSubTasks }
        }
    };
};

export const changeTaskPriority = (state: BoardState, taskId: string, priority: TaskPriority): BoardState => {
    const task = state.tasks[taskId];
    if (!task) return state;

    return {
        ...state,
        tasks: {
            ...state.tasks,
            [taskId]: { ...task, priority }
        }
    };
};

export const setTaskDueDate = (state: BoardState, taskId: string, dueDate: string): BoardState => {
    const task = state.tasks[taskId];
    if (!task) return state;

    return {
        ...state,
        tasks: {
            ...state.tasks,
            [taskId]: { ...task, dueDate }
        }
    };
};

export const moveTaskInBoard = (
    state: BoardState,
    taskId: string,
    sourceColId: string,
    destColId: string,
    sourceIdx: number,
    destIdx: number
): BoardState => {
    const task = state.tasks[taskId];
    if (!task) return state;

    const newColumns = state.columns.map(col => ({ ...col, taskIds: [...col.taskIds] }));
    const sourceCol = newColumns.find(c => c.id === sourceColId);
    const destCol = newColumns.find(c => c.id === destColId);

    if (!sourceCol || !destCol) return state;

    sourceCol.taskIds.splice(sourceIdx, 1);
    destCol.taskIds.splice(destIdx, 0, taskId);

    return {
        ...state,
        columns: newColumns,
        tasks: {
            ...state.tasks,
            [taskId]: { ...task, columnId: destColId }
        }
    };
};
