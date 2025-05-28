import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const FormSubmissionsDetailPage = () => { // Renamed component
    const { formId } = useParams(); // Still uses useParams to get the specific form ID
    const [formTitle, setFormTitle] = useState('Loading Submissions...');
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSubmissions = () => {
            const allSubmissions = JSON.parse(localStorage.getItem('formSubmissions') || '{}');
            const formSubmissions = allSubmissions[formId] || [];

            const savedForms = JSON.parse(localStorage.getItem('formBuilderForms') || '[]');
            const formDefinition = savedForms.find(form => form.id === formId);

            if (formDefinition) {
                setFormTitle(`Submissions for: ${formDefinition.title}`);
            } else {
                setFormTitle(`Submissions for Form ID: ${formId} (Form Definition Not Found)`);
            }

            setSubmissions(formSubmissions);
            setLoading(false);
        };

        loadSubmissions();
    }, [formId]);

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-500">Loading submissions...</div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{formTitle}</h1>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
                {submissions.length === 0 ? (
                    <p className="text-center text-gray-500">No submissions found for this form yet.</p>
                ) : (
                    <div className="space-y-6">
                        {submissions.map((submission, index) => (
                            <div key={submission.submissionId || index} className="p-4 border border-gray-200 rounded-md bg-gray-50 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">Submission #{index + 1}</h3>
                                    <span className="text-sm text-gray-500">{new Date(submission.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="text-sm text-gray-700">
                                    <p className="font-medium mb-1">Submission ID: <span className="font-normal text-xs text-gray-600">{submission.submissionId}</span></p>
                                    <p className="font-medium mb-2">Data:</p>
                                    <div className="bg-white p-3 rounded-md border border-gray-200 text-xs break-all">
                                        {Object.entries(submission.formData).map(([key, value]) => (
                                            <div key={key} className="mb-1">
                                                <span className="font-semibold text-blue-700">{key}:</span> {Array.isArray(value) ? value.join(', ') : value.toString()}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="text-center mt-8">
                    <Link to="/forms" className="text-blue-500 hover:underline">← Back to All Forms</Link> {/* Link back to the list */}
                </div>
            </div>
        </div>
    );
};

export default FormSubmissionsDetailPage; // Export with new name