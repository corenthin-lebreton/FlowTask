import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from './TaskCard';
import { Task } from '../../types/kanban';

interface SortableTaskProps {
    task: Task;
    columnTitle: string;
    onClick: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const SortableTask = memo(function SortableTask({ task, columnTitle, onClick, onDelete }: SortableTaskProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task: task,
            columnTitle
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard
                task={task}
                columnTitle={columnTitle}
                onClick={onClick}
                onDelete={onDelete}
            />
        </div>
    );
});
