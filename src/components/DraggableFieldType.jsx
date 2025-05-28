import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableFieldType = ({ type }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'FIELD_TYPE',
        item: { type },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    // Function to get a simple icon for the field type
    const getFieldIcon = (fieldType) => {
        switch (fieldType) {
            case 'text': return '📝';
            case 'textarea': return '📖';
            case 'dropdown': return '🔽';
            case 'checkbox': return '✅';
            case 'radio': return '🔘';
            case 'date': return '📅';
            case 'email': return '📧';
            case 'phone': return '📞';
            default: return '❓';
        }
    };

    return (
        <div
            ref={drag}
            className={`p-3 mb-3 bg-blue-100 border border-blue-300 rounded-md cursor-grab text-blue-800 font-medium flex items-center space-x-2
                      ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        >
            <span className="text-lg">{getFieldIcon(type)}</span>
            <span>{type.charAt(0).toUpperCase() + type.slice(1)} Input</span>
        </div>
    );
};

export default DraggableFieldType;