import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FormBuilderContext = createContext();

export const FormBuilderProvider = ({ children }) => {
    const [formTitle, setFormTitle] = useState('Untitled Form');
    const [formFields, setFormFields] = useState([]);
    const [selectedField, setSelectedField] = useState(null);
    const [currentFormId, setCurrentFormId] = useState(null);
    const [shareUrl, setShareUrl] = useState('');

    // Load form from localStorage on initial render or when formId changes
    useEffect(() => {
        const storedForms = JSON.parse(localStorage.getItem('formBuilderForms') || '[]');
        let initialForm = null;

        // If currentFormId is already set (e.g., from a deep link or previous save)
        if (currentFormId) {
            initialForm = storedForms.find(form => form.id === currentFormId);
        } else if (storedForms.length > 0) {
            // Optionally, load the last edited form or create a new one
            // For now, let's stick to explicitly creating or loading.
        }

        if (initialForm) {
            setFormTitle(initialForm.title);
            setFormFields(initialForm.fields);
            setCurrentFormId(initialForm.id);
        } else {
            // If no form is loaded, start with a fresh untitled form
            setFormTitle('Untitled Form');
            setFormFields([]);
            setCurrentFormId(uuidv4()); // Assign a new ID for a new form
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Function to add a new field
    const addField = (type) => {
        const newField = {
            id: uuidv4(),
            type,
            label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            placeholder: `Enter ${type}...`,
            required: false,
            options: type === 'dropdown' || type === 'radio' || type === 'checkbox' ? [{ value: 'Option 1', label: 'Option 1' }] : [],
        };
        setFormFields((prevFields) => [...prevFields, newField]);
        setSelectedField(newField); // Select the new field immediately
    };

    // Function to update a field's properties
    const updateField = (id, newProps) => {
        setFormFields((prevFields) =>
            prevFields.map((field) =>
                field.id === id ? { ...field, ...newProps } : field
            )
        );
        setSelectedField((prevSelected) =>
            prevSelected && prevSelected.id === id ? { ...prevSelected, ...newProps } : prevSelected
        );
    };

    // Function to delete a field
    const deleteField = (id) => {
        setFormFields((prevFields) => prevFields.filter((field) => field.id !== id));
        setSelectedField(null); // Deselect if the deleted field was selected
    };

    // Function to save the entire form to localStorage
    const saveForm = () => {
        let savedForms = JSON.parse(localStorage.getItem('formBuilderForms') || '[]');
        const currentForm = {
            id: currentFormId || uuidv4(), // Ensure there's an ID
            title: formTitle,
            fields: formFields,
            lastSaved: new Date().toISOString(),
        };

        const existingFormIndex = savedForms.findIndex(form => form.id === currentForm.id);

        if (existingFormIndex > -1) {
            // Update existing form
            savedForms[existingFormIndex] = currentForm;
        } else {
            // Add new form
            savedForms.push(currentForm);
            setCurrentFormId(currentForm.id); // Set the new ID if it was a new form
        }

        localStorage.setItem('formBuilderForms', JSON.stringify(savedForms));
        console.log('Form saved:', currentForm);
        return currentForm.id; // Return the ID of the saved/updated form
    };

    // NEW: Function to delete a form and its submissions
    const deleteForm = (formIdToDelete) => {
        // 1. Delete form definition
        let savedForms = JSON.parse(localStorage.getItem('formBuilderForms') || '[]');
        const updatedForms = savedForms.filter(form => form.id !== formIdToDelete);
        localStorage.setItem('formBuilderForms', JSON.stringify(updatedForms));
        console.log(`Form ${formIdToDelete} definition deleted.`);

        // 2. Delete associated submissions
        let allSubmissions = JSON.parse(localStorage.getItem('formSubmissions') || '{}');
        if (allSubmissions[formIdToDelete]) {
            delete allSubmissions[formIdToDelete]; // Remove the entry for this formId
            localStorage.setItem('formSubmissions', JSON.stringify(allSubmissions));
            console.log(`Submissions for form ${formIdToDelete} deleted.`);
        }

        // If the currently active form in the builder is deleted, reset builder state
        if (currentFormId === formIdToDelete) {
            setFormTitle('Untitled Form');
            setFormFields([]);
            setSelectedField(null);
            setCurrentFormId(uuidv4()); // Assign a new ID for a fresh start
        }
    };

    // Function to reorder fields (Drag and Drop)
    const moveField = (dragIndex, hoverIndex) => {
        const draggedField = formFields[dragIndex];
        const updatedFields = [...formFields];
        updatedFields.splice(dragIndex, 1); // Remove dragged item
        updatedFields.splice(hoverIndex, 0, draggedField); // Insert at hover position
        setFormFields(updatedFields);
    };

    const contextValue = {
        formTitle,
        setFormTitle,
        formFields,
        setFormFields,
        addField,
        updateField,
        deleteField,
        selectedField,
        setSelectedField,
        saveForm,
        deleteForm, // NEW: Expose deleteForm
        currentFormId,
        setCurrentFormId,
        shareUrl,
        setShareUrl,
        moveField,
    };

    return (
        <FormBuilderContext.Provider value={contextValue}>
            {children}
        </FormBuilderContext.Provider>
    );
};

export default FormBuilderContext;
