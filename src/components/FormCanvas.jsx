import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import FormBuilderContext from '../context/FormBuilderContext';
import DraggableFormItem from './DraggableFormItem';

const FormCanvas = () => {
    const { formFields, addField, moveField, setSelectedField } = useContext(FormBuilderContext);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'FIELD_TYPE',
        drop: (item, monitor) => {
            if (monitor.didDrop()) {
                return;
            }
            addField(item.type);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    const handleMoveField = (dragIndex, hoverIndex) => {
        moveField(dragIndex, hoverIndex);
    };

    return (
        <div
            ref={drop}
            // Enhanced styling for attractive drag-over effect and base look
            className={`relative flex-1 p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-xl flex flex-col items-center justify-center overflow-y-auto
                       min-h-[calc(100vh-12rem)] border-2 transition-all duration-300
                       ${isOver
                           ? 'border-blue-500 bg-blue-50/50 shadow-blue-300 scale-[1.01]' // More prominent feedback
                           : 'border-gray-200 hover:border-gray-300' // Subtle hover on non-dragging state
                       }`}
        >
            <h2 className="text-2xl font-extrabold text-gray-800 mb-8 z-10">Your Form Design</h2>
            {formFields.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-500 text-center p-12 border-2 border-dashed border-gray-300 rounded-xl bg-white/70 backdrop-blur-sm shadow-inner transition-all duration-300 hover:border-blue-400 hover:text-blue-600">
                    <span className="text-6xl mb-4">✨</span>
                    <p className="text-xl font-semibold mb-2">Start Building Your Form</p>
                    <p className="text-md max-w-sm">Drag and drop fields from the <span className="font-bold text-blue-700">"Form Fields"</span> panel on the left into this canvas.</p>
                    <p className="mt-4 text-sm text-gray-400">Hint: Click on a field to edit its properties on the right.</p>
                </div>
            ) : (
                <div className="w-full max-w-2xl space-y-5 p-2 transition-all duration-300"> {/* Added max-w-2xl and increased spacing */}
                    {formFields.map((field, index) => (
                        <DraggableFormItem
                            key={field.id}
                            field={field}
                            index={index}
                            moveField={handleMoveField}
                            onClick={() => setSelectedField(field)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FormCanvas;