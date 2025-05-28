import React, { useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import FormBuilderContext from '../context/FormBuilderContext';

const FieldComponent = ({ field, index }) => {
    const { setSelectedFieldId, moveField, deleteField } = useContext(FormBuilderContext);
    const ref = useRef(null);

    const [{ handlerId }, drop] = useDrop({
        accept: 'CANVAS_FIELD', // Accepts other canvas fields for reordering
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            moveField(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations, but it's acceptable here
            // to optimize the performance of the moveField operation
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'CANVAS_FIELD', // Unique type for canvas fields
        item: { id: field.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    drag(drop(ref)); // Attach both drag and drop to the same ref

    const handleSelectField = () => {
        setSelectedFieldId(field.id);
    };

    const handleDeleteField = (e) => {
        e.stopPropagation(); // Prevent selecting the field when deleting
        deleteField(field.id);
    };

    return (
        <div
            ref={ref}
            className={`relative p-4 mb-3 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer
                        hover:border-blue-500 transition-all duration-200
                        ${isDragging ? 'opacity-0' : ''}`} // Hide original while dragging
            onClick={handleSelectField}
            data-handler-id={handlerId}
        >
            <div className="flex justify-between items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <button
                    onClick={handleDeleteField}
                    className="text-red-500 hover:text-red-700 text-lg"
                    title="Delete Field"
                >
                    &times;
                </button>
            </div>
            {/* Simple preview of the field type */}
            {field.type === 'text' && <input type="text" placeholder={field.placeholder} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled />}
            {field.type === 'textarea' && <textarea placeholder={field.placeholder} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24" disabled />}
            {field.type === 'dropdown' && (
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled>
                    {field.options.map((option, i) => <option key={i}>{option}</option>)}
                </select>
            )}
            {field.type === 'checkbox' && (
                <div>
                    {field.options.map((option, i) => (
                        <div key={i} className="flex items-center mb-2">
                            <input type="checkbox" id={`${field.id}-${i}`} className="mr-2" disabled />
                            <label htmlFor={`${field.id}-${i}`}>{option}</label>
                        </div>
                    ))}
                </div>
            )}
            {field.type === 'radio' && ( // Added radio button preview
                <div>
                    {field.options.map((option, i) => (
                        <div key={i} className="flex items-center mb-2">
                            <input type="radio" id={`${field.id}-${i}`} name={`radio-${field.id}`} className="mr-2" disabled />
                            <label htmlFor={`${field.id}-${i}`}>{option}</label>
                        </div>
                    ))}
                </div>
            )}
            {field.type === 'date' && <input type="date" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled />}
            {field.type === 'email' && <input type="email" placeholder={field.placeholder} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled />}
            {field.type === 'phone' && <input type="tel" placeholder={field.placeholder} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled />}

            {field.helpText && <p className="text-gray-500 text-xs mt-1">{field.helpText}</p>}
        </div>
    );
};

export default FieldComponent;
