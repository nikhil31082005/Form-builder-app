import React, { useContext, useState, useEffect } from 'react';
import FormBuilderContext from '../context/FormBuilderContext';

const FieldPropertiesPanel = () => {
    const { selectedField, updateField, deleteField, setSelectedField } = useContext(FormBuilderContext);
    const [localMinLength, setLocalMinLength] = useState(0);
    const [localMaxLength, setLocalMaxLength] = useState(255);
    const [localPattern, setLocalPattern] = useState('');
    const [localHelpText, setLocalHelpText] = useState('');

    // Sync local state with selectedField properties
    useEffect(() => {
        if (selectedField) {
            setLocalMinLength(selectedField.minLength !== undefined ? selectedField.minLength : 0);
            setLocalMaxLength(selectedField.maxLength !== undefined ? selectedField.maxLength : 255);
            setLocalPattern(selectedField.pattern || '');
            setLocalHelpText(selectedField.helpText || '');
        }
    }, [selectedField]);

    if (!selectedField) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center text-gray-500 h-full">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Field Properties</h2>
                <p className="text-center">Select a field on the canvas to edit its properties.</p>
            </div>
        );
    }

    const handlePropertyChange = (e) => {
        const { name, value, type, checked } = e.target;
        updateField(selectedField.id, {
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleLengthChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseInt(value, 10);

        if (name === 'minLength') {
            setLocalMinLength(isNaN(numValue) ? 0 : numValue);
            updateField(selectedField.id, { minLength: isNaN(numValue) ? 0 : numValue });
        } else if (name === 'maxLength') {
            setLocalMaxLength(isNaN(numValue) ? 255 : numValue);
            updateField(selectedField.id, { maxLength: isNaN(numValue) ? 255 : numValue });
        }
    };

    const handlePatternChange = (e) => {
        setLocalPattern(e.target.value);
        updateField(selectedField.id, { pattern: e.target.value });
    };

    const handleHelpTextChange = (e) => {
        setLocalHelpText(e.target.value);
        updateField(selectedField.id, { helpText: e.target.value });
    };

    const handleOptionChange = (index, e) => {
        const newOptions = [...selectedField.options];
        newOptions[index] = { ...newOptions[index], [e.target.name]: e.target.value };
        updateField(selectedField.id, { options: newOptions });
    };

    const addOption = () => {
        const newOptions = [...selectedField.options, { value: `Option ${selectedField.options.length + 1}`, label: `Option ${selectedField.options.length + 1}` }];
        updateField(selectedField.id, { options: newOptions });
    };

    const removeOption = (index) => {
        const newOptions = selectedField.options.filter((_, i) => i !== index);
        updateField(selectedField.id, { options: newOptions });
    };

    // Basic validation for min/max length
    const isMinMaxInvalid = localMinLength > localMaxLength && localMaxLength !== 0;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md overflow-y-auto relative h-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Field Properties</h2>
            <button
                onClick={() => setSelectedField(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-light leading-none"
                title="Close Properties Panel"
            >
                &times;
            </button>

            <div className="space-y-5">
                {/* General Properties Section */}
                <div className="border-b pb-4 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">General</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
                        <input
                            type="text"
                            value={selectedField.type.charAt(0).toUpperCase() + selectedField.type.slice(1)}
                            disabled
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                        <input
                            type="text"
                            id="label"
                            name="label"
                            value={selectedField.label || ''}
                            onChange={handlePropertyChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {selectedField.type !== 'checkbox' && selectedField.type !== 'radio' && (
                        <div className="mt-4">
                            <label htmlFor="placeholder" className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                            <input
                                type="text"
                                id="placeholder"
                                name="placeholder"
                                value={selectedField.placeholder || ''}
                                onChange={handlePropertyChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                    <div className="mt-4">
                        <label htmlFor="helpText" className="block text-sm font-medium text-gray-700 mb-1">Help Text</label>
                        <textarea
                            id="helpText"
                            name="helpText"
                            value={localHelpText}
                            onChange={handleHelpTextChange}
                            rows="3"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Provide a hint or explanation for the user."
                        ></textarea>
                    </div>
                    <div className="mt-4 flex items-center">
                        <input
                            type="checkbox"
                            id="required"
                            name="required"
                            checked={selectedField.required}
                            onChange={handlePropertyChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="required" className="ml-2 block text-sm text-gray-900">Required Field</label>
                    </div>
                </div>

                {/* Options Section (for dropdown, checkbox, radio) */}
                {(selectedField.type === 'dropdown' || selectedField.type === 'checkbox' || selectedField.type === 'radio') && (
                    <div className="border-b pb-4 border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Options</h3>
                        <div className="space-y-3">
                            {selectedField.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md border border-gray-200">
                                    <input
                                        type="text"
                                        name="label"
                                        value={option.label}
                                        onChange={(e) => handleOptionChange(index, e)}
                                        placeholder={`Option ${index + 1} Label`}
                                        className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => removeOption(index)}
                                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex-shrink-0"
                                        title="Remove option"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addOption}
                            className="mt-4 w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm transition-colors"
                        >
                            Add Option
                        </button>
                    </div>
                )}

                {/* Validation Rules Section (for text, textarea, email, phone) */}
                {(selectedField.type === 'text' || selectedField.type === 'textarea' || selectedField.type === 'email' || selectedField.type === 'phone') && (
                    <div className="border-b pb-4 border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Validation Rules</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="minLength" className="block text-sm font-medium text-gray-700 mb-1">Min Length</label>
                                <input
                                    type="number"
                                    id="minLength"
                                    name="minLength"
                                    value={localMinLength}
                                    onChange={handleLengthChange}
                                    className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${isMinMaxInvalid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                />
                            </div>
                            <div>
                                <label htmlFor="maxLength" className="block text-sm font-medium text-gray-700 mb-1">Max Length</label>
                                <input
                                    type="number"
                                    id="maxLength"
                                    name="maxLength"
                                    value={localMaxLength}
                                    onChange={handleLengthChange}
                                    className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${isMinMaxInvalid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                />
                            </div>
                        </div>
                        {isMinMaxInvalid && (
                            <p className="text-red-500 text-xs mt-2">Min length cannot be greater than Max length.</p>
                        )}

                        {(selectedField.type === 'email' || selectedField.type === 'phone') && (
                            <div className="mt-4">
                                <label htmlFor="pattern" className="block text-sm font-medium text-gray-700 mb-1">Pattern (Regex)</label>
                                <input
                                    type="text"
                                    id="pattern"
                                    name="pattern"
                                    value={localPattern}
                                    onChange={handlePatternChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., ^\S+@\S+\.\S+$ for email"
                                />
                                <p className="text-xs text-gray-500 mt-1">Provide a regular expression for advanced validation.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Delete Field Button */}
                <button
                    onClick={() => {
                        deleteField(selectedField.id);
                        setSelectedField(null); // Deselect after deleting
                    }}
                    className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors mt-6 shadow-md hover:shadow-lg"
                >
                    Delete Field
                </button>
            </div>
        </div>
    );
};

export default FieldPropertiesPanel;