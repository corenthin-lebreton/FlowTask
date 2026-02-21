import { useState, useCallback } from "react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from "./KanbanColumn";
import { SortableTask } from "./SortableTask";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import { useKanbanContext } from "../../context/KanbanContext";
import { Task, BoardState } from "../../types/kanban";

const useGridSensors = () => useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
);

const handleDropOverTask = (activeId: string, overId: string, board: BoardState, moveTask: any) => {
    const aTask = board.tasks[activeId];
    const oTask = board.tasks[overId];
    if (!aTask || !oTask) return;
    const srcCol = board.columns.find(c => c.id === aTask.columnId);
    const dstCol = board.columns.find(c => c.id === oTask.columnId);
    if (!srcCol || !dstCol) return;
    moveTask(activeId, srcCol.id, dstCol.id, srcCol.taskIds.indexOf(activeId), dstCol.taskIds.indexOf(overId));
};

const handleDropOverColumn = (activeId: string, overId: string, board: BoardState, moveTask: any) => {
    const aTask = board.tasks[activeId];
    if (!aTask) return;
    const srcCol = board.columns.find(c => c.id === aTask.columnId);
    const dstCol = board.columns.find(c => c.id === overId);
    if (!srcCol || !dstCol || srcCol.id === dstCol.id) return;
    moveTask(activeId, srcCol.id, dstCol.id, srcCol.taskIds.indexOf(activeId), dstCol.taskIds.length);
};

export function KanbanBoard() {
    const ctx = useKanbanContext();
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeColTitle, setActiveColTitle] = useState("");
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

    const handleEditTask = useCallback((taskId: string) => setEditingTaskId(taskId), []);
    const handleRenameCol = useCallback((colId: string) => {
        const t = window.prompt("Nouveau nom :");
        if (t?.trim()) ctx.renameColumn(colId, t.trim());
    }, [ctx.renameColumn]);
    const handleDeleteCol = useCallback((colId: string) => {
        if (window.confirm("Supprimer cette catégorie et ses tâches ? Action irréversible.")) ctx.deleteColumn(colId);
    }, [ctx.deleteColumn]);
    const handleAdd = useCallback((colId: string) => {
        const t = window.prompt("Nouvelle tâche :");
        if (t?.trim()) ctx.addTask({ title: t.trim(), description: "", columnId: colId, priority: "Moyenne", subTasks: [] });
    }, [ctx.addTask]);

    const handleDragStart = (e: DragStartEvent) => {
        if (e.active.data.current?.type === 'Task') {
            setActiveTask(e.active.data.current.task);
            setActiveColTitle(e.active.data.current.columnTitle);
        }
    };

    const handleDragEnd = (e: DragEndEvent) => {
        setActiveTask(null); setActiveColTitle("");
        if (!e.over || e.active.data.current?.type !== 'Task') return;
        const activeId = e.active.id as string;
        const overId = e.over.id as string;
        const overType = e.over.data.current?.type;

        if (overType === 'Task') handleDropOverTask(activeId, overId, ctx.board, ctx.moveTask);
        else if (overType === 'Column') handleDropOverColumn(activeId, overId, ctx.board, ctx.moveTask);
    };

    return (
        <div className="flex h-full gap-8 min-w-[1000px]">
            <DndContext sensors={useGridSensors()} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                {ctx.board.columns.map(col => {
                    const colTasks = col.taskIds.map(id => ctx.filteredTasks[id]).filter(t => t !== undefined);
                    return (
                        <KanbanColumn key={col.id} id={col.id} title={col.title} count={colTasks.length} colorClass={col.colorClass} taskIds={col.taskIds} onAddTask={handleAdd} onRename={handleRenameCol} onDelete={handleDeleteCol}>
                            {colTasks.map(t => <SortableTask key={t.id} task={t} columnTitle={col.title} onClick={handleEditTask} onDelete={ctx.deleteTask} />)}
                        </KanbanColumn>
                    );
                })}
                <DragOverlay>{activeTask && <TaskCard task={activeTask} columnTitle={activeColTitle} />}</DragOverlay>
            </DndContext>
            {editingTaskId && ctx.board.tasks[editingTaskId] && (
                <TaskModal task={ctx.board.tasks[editingTaskId]} columnTitle={ctx.board.columns.find(c => c.id === ctx.board.tasks[editingTaskId].columnId)?.title || ""} isOpen={!!editingTaskId} onClose={() => setEditingTaskId(null)} onChangeTitle={(id, t) => ctx.updateTask(id, { title: t })} onChangeDescription={(id, d) => ctx.updateTask(id, { description: d })} onToggleSubtask={ctx.toggleSubTask} onAddSubtask={ctx.addSubTask} onDeleteSubtask={ctx.deleteSubTask} onChangePriority={ctx.updateTaskPriority} onChangeDueDate={ctx.updateTaskDueDate} />
            )}
        </div>
    );
}
