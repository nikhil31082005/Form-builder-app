import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import FormBuilderContext from '../context/FormBuilderContext';

const FormPreviewPage = () => {
    const { formTitle, formFields } = useContext(FormBuilderContext);

    // This component will just render the form structure, not allow input
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{formTitle} - Preview</h1>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
                {formFields.length === 0 ? (
                    <p className="text-center text-gray-500">No fields added to this form yet.</p>
                ) : (
                    <div className="space-y-6">
                        {formFields.map((field) => (
                            <div key={field.id} className="flex flex-col p-3 border border-gray-200 rounded-md bg-gray-50">
                                <label className="text-lg font-medium text-gray-700 mb-1">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>
                                {field.type === 'text' && (
                                    <input
                                        type="text"
                                        placeholder={field.placeholder}
                                        disabled
                                        className="p-2 border border-gray-300 rounded-md bg-gray-100"
                                    />
                                )}
                                {field.type === 'textarea' && (
                                    <textarea
                                        placeholder={field.placeholder}
                                        disabled
                                        rows="4"
                                        className="p-2 border border-gray-300 rounded-md bg-gray-100"
                                    ></textarea>
                                )}
                                {field.type === 'dropdown' && (
                                    <select
                                        disabled
                                        className="p-2 border border-gray-300 rounded-md bg-gray-100"
                                    >
                                        <option>{field.placeholder || 'Select an option'}</option>
                                        {field.options.map((option, idx) => (
                                            <option key={idx}>{option.label}</option>
                                        ))}
                                    </select>
                                )}
                                {field.type === 'checkbox' && (
                                    <div className="flex flex-col space-y-2 mt-1">
                                        {field.options.map((option, idx) => (
                                            <label key={idx} className="inline-flex items-center">
                                                <input type="checkbox" disabled className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                                                <span className="ml-2 text-gray-700">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {field.type === 'radio' && (
                                    <div className="flex flex-col space-y-2 mt-1">
                                        {field.options.map((option, idx) => (
                                            <label key={idx} className="inline-flex items-center">
                                                <input type="radio" disabled className="form-radio h-4 w-4 text-blue-600" />
                                                <span className="ml-2 text-gray-700">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {field.type === 'date' && (
                                    <input type="date" disabled className="p-2 border border-gray-300 rounded-md bg-gray-100" />
                                )}
                                {field.type === 'email' && (
                                    <input type="email" placeholder={field.placeholder} disabled className="p-2 border border-gray-300 rounded-md bg-gray-100" />
                                )}
                                {field.type === 'phone' && (
                                    <input type="tel" placeholder={field.placeholder} disabled className="p-2 border border-gray-300 rounded-md bg-gray-100" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <div className="text-center mt-8">
                    <Link to="/" className="text-blue-500 hover:underline">Back to Builder</Link>
                </div>
            </div>
        </div>
    );
};

export default FormPreviewPage;