import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Added Link import
import { v4 as uuidv4 } from 'uuid';

const FormFillerPage = () => {
    const { formId } = useParams();
    const navigate = useNavigate();
    const [formDefinition, setFormDefinition] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [formFound, setFormFound] = useState(true);

    useEffect(() => {
        const loadFormDefinition = () => {
            const savedForms = JSON.parse(localStorage.getItem('formBuilderForms') || '[]');
            const foundForm = savedForms.find(form => form.id === formId);

            if (foundForm) {
                setFormDefinition(foundForm);
                // Initialize formData with default values based on field types
                const initialFormData = {};
                foundForm.fields.forEach(field => {
                    if (field.type === 'checkbox') {
                        initialFormData[field.id] = []; // For checkboxes, value is an array
                    } else {
                        initialFormData[field.id] = '';
                    }
                });
                setFormData(initialFormData);
            } else {
                setFormFound(false);
            }
            setLoading(false);
        };

        loadFormDefinition();
    }, [formId]);

    const handleChange = (e, field) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => {
                const currentValues = prev[name] || [];
                if (checked) {
                    return { ...prev, [name]: [...currentValues, value] };
                } else {
                    return { ...prev, [name]: currentValues.filter(v => v !== value) };
                }
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation for required fields
        for (const field of formDefinition.fields) {
            if (field.required) {
                const value = formData[field.id];
                if (field.type === 'checkbox') {
                    if (!value || value.length === 0) {
                        alert(`Please select at least one option for ${field.label}.`);
                        return;
                    }
                } else if (!value || value.trim() === '') {
                    alert(`Please fill in the required field: ${field.label}.`);
                    return;
                }
            }
        }

        const submissionId = uuidv4();
        const timestamp = new Date().toISOString();

        // Get existing submissions
        const allSubmissions = JSON.parse(localStorage.getItem('formSubmissions') || '{}');
        const currentFormSubmissions = allSubmissions[formId] || [];

        // Add new submission
        currentFormSubmissions.push({
            submissionId,
            timestamp,
            formData,
        });

        // Update localStorage
        allSubmissions[formId] = currentFormSubmissions;
        localStorage.setItem('formSubmissions', JSON.stringify(allSubmissions));

        alert('Form submitted successfully!');
        setFormData({}); // Clear form after submission
        navigate(`/submissions/${formId}`); // Optionally navigate to submissions page
    };

    if (loading) {
        return <div className="text-center p-8 text-gray-500">Loading form...</div>;
    }

    if (!formFound) {
        return <div className="text-center p-8 text-red-500">Form not found!</div>;
    }

    if (!formDefinition || formDefinition.fields.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500">
                This form has no fields defined or is empty. <Link to="/">Go back to builder</Link>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{formDefinition.title}</h1>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {formDefinition.fields.map((field) => (
                        <div key={field.id} className="flex flex-col">
                            <label htmlFor={field.id} className="text-lg font-medium text-gray-700 mb-1">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            {field.type === 'text' && (
                                <input
                                    type="text"
                                    id={field.id}
                                    name={field.id}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleChange(e, field)}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                            {field.type === 'textarea' && (
                                <textarea
                                    id={field.id}
                                    name={field.id}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleChange(e, field)}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    rows="4"
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            )}
                            {field.type === 'dropdown' && (
                                <select
                                    id={field.id}
                                    name={field.id}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleChange(e, field)}
                                    required={field.required}
                                    className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>
                                        {field.placeholder || 'Select an option'}
                                    </option>
                                    {field.options && field.options.map((option, idx) => (
                                        <option key={idx} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {field.type === 'checkbox' && (
                                <div className="flex flex-col space-y-2 mt-1">
                                    {field.options && field.options.map((option, idx) => (
                                        <label key={idx} className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                name={field.id}
                                                value={option.value}
                                                checked={(formData[field.id] || []).includes(option.value)}
                                                onChange={(e) => handleChange(e, field)}
                                                className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                            />
                                            <span className="ml-2 text-gray-700">{option.label}</span>
                                        </label>
                                    ))}
                                    {field.required && (!formData[field.id] || formData[field.id].length === 0) && (
                                        <p className="text-red-500 text-sm">Please select at least one option.</p>
                                    )}
                                </div>
                            )}
                            {field.type === 'radio' && (
                                <div className="flex flex-col space-y-2 mt-1">
                                    {field.options && field.options.map((option, idx) => (
                                        <label key={idx} className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name={field.id}
                                                value={option.value}
                                                checked={formData[field.id] === option.value}
                                                onChange={(e) => handleChange(e, field)}
                                                required={field.required}
                                                className="form-radio h-4 w-4 text-blue-600"
                                            />
                                            <span className="ml-2 text-gray-700">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                            {field.type === 'date' && (
                                <input
                                    type="date"
                                    id={field.id}
                                    name={field.id}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleChange(e, field)}
                                    required={field.required}
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                            {field.type === 'email' && (
                                <input
                                    type="email"
                                    id={field.id}
                                    name={field.id}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleChange(e, field)}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                             {field.type === 'phone' && (
                                <input
                                    type="tel" // Use type="tel" for phone numbers
                                    id={field.id}
                                    name={field.id}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleChange(e, field)}
                                    placeholder={field.placeholder || 'e.g., (123) 456-7890'}
                                    required={field.required}
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Submit Form
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormFillerPage;