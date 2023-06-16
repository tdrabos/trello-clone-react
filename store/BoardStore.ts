import { ID, databases } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumns';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand'

/**
 * Zustand Store
 * Responsible for managing global board state
 */
interface BoardState {

    // Board state management
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;

    // Search string state management
    searchString: string;
    setSearchString: (searchString: string) => void;

    // Manage tasks in the DB
    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
    deleteTask: (index: number, todo: Todo, id: TypedColumn) => void;
    updateTask: (todo: Todo, columnId: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>()
  },

  getBoard: async() => {
    const board = await getTodosGroupedByColumn();
    set({board});
  },

  setBoardState: (board) => set({board}),

  searchString: "",
  setSearchString: (searchString) => set({searchString}),

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    // If there is an image for the task first we should upload it to Appwrite
    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id
        }
      }
    }

    // Then we create the new task on the DB level
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) })
      }
    );

    // Finally we update the global state with the new task
    set ((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id: $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image:file })
      };

      const column = newColumns.get(columnId);

      // Make sure that the column exists
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo]
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return { 
        board: {
          columns: newColumns
        } 
      }
    })
  },

  deleteTask: async (index: number, todo: Todo, id: TypedColumn) => {

  },

  updateTask: async (todo, columnId) => {
    await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        todo.$id,
        {
            title: todo.title,
            status: columnId
        }
    )
  }
}));