import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FormBuilderProvider } from './context/FormBuilderContext';

// Import pages
import BuilderPage from './pages/BuilderPage';
import FormPreviewPage from './pages/FormPreviewPage';
import FormFillerPage from './pages/FormFillerPage';
import SubmissionsPage from './pages/SubmissionsPage'; // NEW: Page that lists ALL forms
import FormSubmissionsDetailPage from './pages/FormSubmissionsDetailPage'; // RENAMED: Page for specific form submissions

export default function App() {
    return (
        <Router>
            <FormBuilderProvider>
                <Routes>
                    <Route path="/" element={<BuilderPage />} />
                    <Route path="/preview" element={<FormPreviewPage />} />
                    <Route path="/fill/:formId" element={<FormFillerPage />} />
                    {/* Route for the page listing all forms */}
                    <Route path="/forms" element={<SubmissionsPage />} />
                    {/* Route for the specific form's submissions detail page */}
                    <Route path="/submissions/:formId" element={<FormSubmissionsDetailPage />} />
                </Routes>
            </FormBuilderProvider>
        </Router>
    );
}