'use client'

import { useBoardStore } from '@/store/BoardStore';
import { useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

function Board() {
    const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore((state) => [
        state.board,
        state.getBoard,
        state.setBoardState,
        state.updateTodoInDB
    ])

    useEffect(() => {
         getBoard();
    }, [getBoard])

    const handleOnDragEnd = (result: DropResult) => {
        const {destination, source, type} = result;

        if (!destination) return;

        // Column drag
        if (type === "column") {
            const entries = Array.from(board.columns.entries());
            const [removed] = entries.splice(source.index, 1);

            entries.splice(destination.index, 0, removed);
            const rearrangedColumns = new Map(entries)

            setBoardState({
                ...board,
                columns: rearrangedColumns
            })
        } else {
            
        }

        if (type === "card") {
            const columns = Array.from(board.columns);
            const sourceColIndex = columns[Number(source.droppableId)];
            const destColIndex = columns[Number(destination.droppableId)];

            const sourceCol: Column = {
                id: sourceColIndex[0],
                todos: sourceColIndex[1].todos
            };

            const destCol: Column = {
                id: destColIndex[0],
                todos: destColIndex[1].todos
            };

            if (!sourceCol || !destCol) return;

            // Do nothing if moving the card to the same place
            if (source.index === destination.index && sourceCol === destCol) return;

            const newTodos = sourceCol.todos;
            const [todoMoved] = newTodos.splice(source.index, 1);

            
            if (sourceCol.id === destCol.id) {
                // Same column drag
                newTodos.splice(destination.index, 0, todoMoved);

                const newCol: Column = {
                    id: sourceCol.id,
                    todos: newTodos
                };

                const newColumns = new Map(board.columns);
                newColumns.set(sourceCol.id, newCol);

                setBoardState({
                    ...board,
                    columns: newColumns
                });

            } else {
                // Dragging to another column
                const destTodos = Array.from(destCol.todos);
                destTodos.splice(destination.index, 0, todoMoved)

                const newColumns = new Map(board.columns);
                const newCol: Column = {
                    id: sourceCol.id,
                    todos: newTodos
                };

                newColumns.set(sourceCol.id, newCol);
                newColumns.set(destCol.id, {
                    id: destCol.id,
                    todos: destTodos
                });

                updateTodoInDB(todoMoved, destCol.id);

                setBoardState({
                    ...board,
                    columns: newColumns
                });
            }
        }
    };

  return (
    <div className='pt-10'>
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable 
                droppableId='board'
                direction='horizontal'
                type='column'
            >
                {(provided, snapshot) => (
                    <div
                        className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >{
                        Array.from(board.columns.entries()).map(([id, column], index) => (
                            <Column
                                key={id}
                                id={id}
                                todos={column.todos}
                                index={index}
                            />
                        ))
                    }</div>
                )}

            </Droppable>
        </DragDropContext>
    </div>
  )
}

export default Board
