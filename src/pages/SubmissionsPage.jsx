import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import FormBuilderContext from '../context/FormBuilderContext'; // Import context to use deleteForm

const SubmissionsPage = () => {
    const { deleteForm } = useContext(FormBuilderContext); // Get deleteForm from context
    const [savedForms, setSavedForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [formToDelete, setFormToDelete] = useState(null); // Stores the form object to be deleted

    // Function to load all forms (now also called after deletion)
    const loadAllForms = () => {
        const forms = JSON.parse(localStorage.getItem('formBuilderForms') || '[]');
        setSavedForms(forms);
        setLoading(false);
    };

    useEffect(() => {
        loadAllForms();
    }, []); // Empty dependency array means this effect runs once on mount

    // Handler for delete button click
    const handleDeleteClick = (form) => {
        setFormToDelete(form); // Set the form to be deleted in state
        setShowConfirmModal(true); // Show the confirmation modal
    };

    // Handler for confirming deletion
    const handleConfirmDelete = () => {
        if (formToDelete) {
            deleteForm(formToDelete.id); // Call the deleteForm function from context
            loadAllForms(); // Reload the list of forms to reflect the deletion
            setShowConfirmModal(false); // Close the modal
            setFormToDelete(null); // Clear the form to delete
        }
    };

    // Handler for canceling deletion
    const handleCancelDelete = () => {
        setShowConfirmModal(false); // Close the modal
        setFormToDelete(null); // Clear the form to delete
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-500">Loading forms...</div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">All Saved Forms</h1>
            <div className="max-w-6xl mx-auto">
                {savedForms.length === 0 ? (
                    <p className="text-center text-gray-500">No forms have been saved yet. <Link to="/" className="text-blue-500 hover:underline">Create one now!</Link></p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedForms.map(form => (
                            <div key={form.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-xl font-bold mb-2 text-gray-800">{form.title}</h2>
                                    <p className="text-sm text-gray-600 mb-3">ID: <span className="font-mono text-xs">{form.id.substring(0, 10)}...</span></p>
                                    <p className="text-xs text-gray-500">Last Saved: {new Date(form.lastSaved).toLocaleString()}</p>
                                </div>
                                <div className="mt-4 flex flex-col space-y-2">
                                    <Link
                                        to={`/fill/${form.id}`}
                                        className="inline-block w-full text-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm"
                                    >
                                        🔗 Fill Form
                                    </Link>
                                    <Link
                                        to={`/submissions/${form.id}`}
                                        className="inline-block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                                    >
                                        📊 View Submissions
                                    </Link>
                                    <Link
                                        to={`/?loadFormId=${form.id}`}
                                        className="inline-block w-full text-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                                    >
                                        ✏️ Edit Form
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteClick(form)}
                                        className="inline-block w-full text-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                    >
                                        🗑️ Delete Form
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="text-center mt-12">
                    <Link to="/" className="text-blue-500 hover:underline">← Go to Builder</Link>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && formToDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Deletion</h2>
                        <p className="mb-6 text-gray-700">
                            Are you sure you want to delete the form "
                            <span className="font-semibold">{formToDelete.title}</span>"?
                            This action cannot be undone and all associated submissions will also be deleted.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionsPage;
