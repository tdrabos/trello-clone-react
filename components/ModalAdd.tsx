'use client'

import { Fragment, ChangeEvent, useRef, FormEvent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useModalAddStore } from '@/store/ModalAddStore'
import TaskTypeRadioGroup from './TaskTypeRadioGroup'
import Image from 'next/image'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { useBoardStore } from '@/store/BoardStore'

const setImage = (imageFile: File) => {

}
export const ModalAdd = () => {
  const [
    isOpen,
    closeAddModal,
    newTaskInput,
    newTaskType,
    setNewTaskInput,
    image,
    setImage
  ] = useModalAddStore((state) => [
    state.isOpen,
    state.closeAddModal,
    state.newTaskInput,
    state.newTaskType,
    state.setNewTaskInput,
    state.image,
    state.setImage
  ]);

  const addTask = useBoardStore((state) => state.addTask)

  const imageRef = useRef<HTMLInputElement>(null);

  const handleUploadImageClick = () => {
    setImage(null);
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // If it's not an image we don't do nothing
    if (!e.target.files![0].type.startsWith('image/')) return;
  
    setImage(e.target.files![0]);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newTaskInput) return;

    addTask(newTaskInput, newTaskType, image);

    setImage(null);
    setNewTaskInput("");

    closeAddModal();
  }
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as='form'
        className='relative z-10'
        onClose={closeAddModal}
        onSubmit={handleSubmit}
      >
        <div className='fixed inset-0 overflow-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
            </div>
        </div>

        <div className='fixed inset-0 overflow-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                    <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl
                    bg-white p-6 text-left align-middle shadow-xl transition-all'>
                        <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900 pb-2'>
                            Add a Task
                        </Dialog.Title>

                        {/** Task name - free text*/}
                        <div className='mt-2'>
                            <input 
                              type="text"
                              value={newTaskInput}
                              onChange={(e) => setNewTaskInput(e.target.value)}
                              placeholder='Enter a task here'
                              className='w-full border border-gray-300 rounded-md outline-none p-5'
                            />
                        </div>

                        {/** Task type selector - radio button*/}
                        <TaskTypeRadioGroup />

                        {/** Image upload */}
                        <div className='mt-2'>
                          <button
                            type='button'
                            onClick={() => imageRef.current?.click()} 
                            className='w-full border border-gray-300 rounded-md outline-none p-5
                            focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                          >
                            <PhotoIcon className='h-6 w-6 mr-2 inline-block' />
                            Upload Image
                          </button>

                          {image && (
                            <Image 
                              src={URL.createObjectURL(image)}
                              width={200}
                              height={200}
                              className='w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150'
                              alt='Upload an image'

                              onClick={handleUploadImageClick}
                            />
                          )}

                          <input
                            type="file" 
                            ref={imageRef}
                            hidden
                            onChange={handleImageChange}
                          />
                        </div>

                        <div className='mt-4 flex justify-center'>
                          <button
                            type='submit'
                            disabled={!newTaskInput}
                            className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2
                            text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2
                            focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300
                            disabled:cursor-not-allowed'
                          >
                            Add Task
                          </button>
                        </div>

                    </Dialog.Panel>
                </Transition.Child>
            </div>
        </div>
      </Dialog>
    </Transition>
  )
}