import { create } from "zustand";

/**
 * Zustand store
 * Responsible for managing the global state of the new task adding component
 */
interface ModalState {
    isOpen: boolean;
    openAddModal: () => void;
    closeAddModal: () => void;

    // New task state management
    newTaskInput: string;
    setNewTaskInput: (input: string) => void;
    newTaskType: TypedColumn;
    setNewTaskType: (type: TypedColumn) => void;

    // Image state management
    image: File | null;
    setImage: (imageFile: File | null) => void;
}

export const useModalAddStore = create<ModalState>()((set) => ({
    isOpen: false,
    openAddModal: () => set({isOpen: true}),
    closeAddModal: () => set({isOpen: false}),

    newTaskInput: "",
    setNewTaskInput: (input) => set({newTaskInput: input}),

    newTaskType: 'todo',
    setNewTaskType: (type) => set({newTaskType: type}),

    image: null,
    setImage: (imageFile) => set({image: imageFile})

}));