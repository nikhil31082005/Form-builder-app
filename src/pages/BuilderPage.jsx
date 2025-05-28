import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormBuilderContext from '../context/FormBuilderContext';
import DraggableFieldType from '../components/DraggableFieldType';
import FormCanvas from '../components/FormCanvas';
import FieldPropertiesPanel from '../components/FieldPropertiesPanel';

// Define fixed heights/widths for layout calculations
const HEADER_HEIGHT_CLASS = 'h-16'; // Corresponds to p-4, making it roughly 64px tall
const LEFT_SIDEBAR_WIDTH_CLASS = 'w-1/5'; // 20% width
const RIGHT_SIDEBAR_WIDTH_CLASS = 'w-1/4'; // 25% width

const BuilderPage = () => {
    const { formTitle, setFormTitle, formFields, saveForm, currentFormId, setCurrentFormId, setShareUrl } = useContext(FormBuilderContext);
    const [showShareModal, setShowShareModal] = useState(false);
    const [generatedShareLink, setGeneratedShareLink] = useState('');
    const [saveStatus, setSaveStatus] = useState('Saved'); // 'Saved', 'Saving...', 'Error saving'

    // Ref to store the timeout ID for debouncing
    const saveTimeoutRef = useRef(null);

    // --- Auto-Save Logic ---
    useEffect(() => {
        // Clear any previous timeout to debounce the save operation
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Set status to 'Saving...'
        setSaveStatus('Saving...');

        // Set a new timeout to save the form after 1000ms (1 second) of inactivity
        saveTimeoutRef.current = setTimeout(() => {
            try {
                const id = saveForm(); // This function returns the ID of the saved form
                if (id) {
                    setCurrentFormId(id); // Ensure currentFormId is set if it's a new form
                    setSaveStatus('Saved');
                } else {
                    setSaveStatus('Error saving');
                }
            } catch (error) {
                console.error("Auto-save failed:", error);
                setSaveStatus('Error saving');
            }
        }, 1000); // 1 second debounce time

        // Cleanup function: clear timeout if component unmounts or dependencies change
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [formTitle, formFields, saveForm, setCurrentFormId]); // Dependencies: trigger save on title or fields change

    // --- Manual Save (if user clicks the button) ---
    const handleManualSaveForm = () => {
        // Clear any pending auto-save timeout to immediately save
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        setSaveStatus('Saving...');
        try {
            const id = saveForm();
            if (id) {
                setCurrentFormId(id);
                setSaveStatus('Saved');
                alert(`Form "${formTitle}" saved successfully!`);
            } else {
                setSaveStatus('Error saving');
                alert('Failed to save form.');
            }
        } catch (error) {
            console.error("Manual save failed:", error);
            setSaveStatus('Error saving');
            alert('Failed to save form.');
        }
    };

    const handleShareForm = () => {
        // Ensure the form is saved before generating a share link
        if (!currentFormId) {
            alert('Please save the form first to generate a shareable link.');
            return;
        }

        const shareLink = `${window.location.origin}/fill/${currentFormId}`;
        setGeneratedShareLink(shareLink);
        setShareUrl(shareLink);
        setShowShareModal(true);
    };

    const copyToClipboard = () => {
        const el = document.createElement('textarea');
        el.value = generatedShareLink;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('Link copied to clipboard!');
    };

    return (
        <DndProvider backend={HTML5Backend}>
            {/* Main container: Full screen height, flex column */}
            <div className="flex flex-col h-screen bg-gray-50">

                {/* Top Bar - Fixed */}
                <header className={`fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white shadow-md ${HEADER_HEIGHT_CLASS}`}>
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-800 mr-4">Form Builder</h1>
                        <input
                            type="text"
                            className="text-xl font-semibold p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                        />
                        <span className="ml-4 text-sm text-gray-600 font-medium">
                            {saveStatus === 'Saved' && <span className="text-green-600">✔ Saved</span>}
                            {saveStatus === 'Saving...' && <span className="text-yellow-600">...Saving</span>}
                            {saveStatus === 'Error saving' && <span className="text-red-600">✖ Error saving</span>}
                        </span>
                    </div>
                    <div className="space-x-4">
                        <Link to="/preview" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                            Preview
                        </Link>
                        <button
                            onClick={handleManualSaveForm}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Save Form
                        </button>
                        <button
                            onClick={handleShareForm}
                            disabled={!currentFormId || saveStatus === 'Saving...'}
                            className={`px-4 py-2 rounded-md transition-colors ${currentFormId && saveStatus !== 'Saving...' ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            Share
                        </button>
                        {/* Link to the new /forms route to view all forms */}
                        <Link
                            to="/forms"
                            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                        >
                            View All Forms
                        </Link>
                    </div>
                </header>

                {/* Left Sidebar: Component Palette - FIXED and positioned correctly */}
                <div className={`fixed left-0 top-16 bottom-0 ${LEFT_SIDEBAR_WIDTH_CLASS} z-20 bg-white shadow-md overflow-y-auto p-4`}>
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Form Fields</h2>
                    <DraggableFieldType type="text" />
                    <DraggableFieldType type="textarea" />
                    <DraggableFieldType type="dropdown" />
                    <DraggableFieldType type="checkbox" />
                    <DraggableFieldType type="radio" />
                    <DraggableFieldType type="date" />
                    <DraggableFieldType type="email" />
                    <DraggableFieldType type="phone" />
                </div>

                {/* Right Sidebar: Field Properties - FIXED and positioned correctly */}
                <div className={`fixed right-0 top-16 bottom-0 ${RIGHT_SIDEBAR_WIDTH_CLASS} z-20 bg-white shadow-md overflow-y-auto p-4`}>
                    <FieldPropertiesPanel />
                </div>

                {/* Main Content Area (Form Canvas) - This section is *not* fixed. */}
                <div className={`flex-1 mt-16 ml-[20%] mr-[25%] p-4 overflow-y-auto`}>
                    <FormCanvas />
                </div>

                {/* Share Modal */}
                {showShareModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                            <h2 className="text-xl font-bold mb-4">Share Your Form</h2>
                            <p className="mb-4 text-gray-700">Use this link to share your form:</p>
                            <div className="flex items-center border rounded-md p-2 bg-gray-100">
                                <input
                                    type="text"
                                    readOnly
                                    value={generatedShareLink}
                                    className="flex-1 bg-transparent border-none outline-none text-blue-600 text-sm"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                                >
                                    Copy
                                </button>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DndProvider>
    );
};

export default BuilderPage;