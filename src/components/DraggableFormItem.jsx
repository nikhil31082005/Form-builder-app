import React, { useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import FormBuilderContext from '../context/FormBuilderContext';

const ItemTypes = {
    FORM_ITEM: 'formItem',
};

const DraggableFormItem = ({ field, index, moveField, onClick }) => {
    const ref = useRef(null);
    const { selectedField } = useContext(FormBuilderContext);
    const isSelected = selectedField && selectedField.id === field.id;

    const [, drop] = useDrop({
        accept: ItemTypes.FORM_ITEM,
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveField(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.FORM_ITEM,
        item: () => ({ id: field.id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    const renderField = () => {
        switch (field.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        placeholder={field.placeholder}
                        disabled
                        className="p-2 border border-gray-300 rounded-md bg-white w-full"
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        placeholder={field.placeholder}
                        disabled
                        rows="3"
                        className="p-2 border border-gray-300 rounded-md bg-white w-full"
                    ></textarea>
                );
            case 'dropdown':
                return (
                    <select disabled className="p-2 border border-gray-300 rounded-md bg-white w-full">
                        <option value="">{field.placeholder || 'Select an option'}</option>
                        {field.options && field.options.map((option, idx) => (
                            <option key={idx} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                );
            case 'checkbox':
                return (
                    <div className="flex flex-col space-y-1">
                        {field.options && field.options.map((option, idx) => (
                            <label key={idx} className="inline-flex items-center text-gray-700">
                                <input type="checkbox" disabled className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                                <span className="ml-2">{option.label}</span>
                            </label>
                        ))}
                    </div>
                );
            case 'radio':
                return (
                    <div className="flex flex-col space-y-1">
                        {field.options && field.options.map((option, idx) => (
                            <label key={idx} className="inline-flex items-center text-gray-700">
                                <input type="radio" disabled className="form-radio h-4 w-4 text-blue-600" />
                                <span className="ml-2">{option.label}</span>
                            </label>
                        ))}
                    </div>
                );
            case 'date':
                return (
                    <input type="date" disabled className="p-2 border border-gray-300 rounded-md bg-white w-full" />
                );
            case 'email':
                return (
                    <input type="email" placeholder={field.placeholder} disabled className="p-2 border border-gray-300 rounded-md bg-white w-full" />
                );
            case 'phone':
                return (
                    <input type="tel" placeholder={field.placeholder} disabled className="p-2 border border-gray-300 rounded-md bg-white w-full" />
                );
            default:
                return null;
        }
    };

    return (
        <div
            ref={ref}
            onClick={onClick}
            // Enhanced styling for visual appeal, selection, and hover
            className={`p-4 border rounded-lg cursor-grab bg-white transition-all duration-200
                      ${isDragging ? 'opacity-0' : 'opacity-100'}
                      ${isSelected
                          ? 'border-blue-600 ring-2 ring-blue-300 shadow-lg' // More distinct selection
                          : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300' // Subtle depth and hover
                      }`}
        >
            <label className="block text-lg font-medium text-gray-800 mb-2">
                {field.label} {field.required && <span className="text-red-500 text-sm">*</span>}
            </label>
            {renderField()}
        </div>
    );
};

export default DraggableFormItem;