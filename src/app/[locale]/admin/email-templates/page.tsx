'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface EmailTemplate {
    type: string;
    subject: string;
    htmlContent: string;
    variables: Array<{
        name: string;
        description: string;
    }>;
    isActive: boolean;
}

export default function EmailTemplatesPage() {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
    const [formData, setFormData] = useState({
        type: '',
        subject: '',
        htmlContent: '',
        variables: '',
        isActive: true,
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/email-templates');
            setTemplates(response.data.templates || []);
        } catch (error) {
            toast.error('Failed to fetch templates');
        } finally {
            setLoading(false);
        }
    };

    const saveTemplate = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            subject: formData.subject,
            htmlContent: formData.htmlContent,
            variables: formData.variables.split(',').map((v) => {
                const trimmed = v.trim();
                return {
                    name: trimmed,
                    description: `Variable for ${trimmed}`
                };
            }).filter(v => v.name),
            isActive: formData.isActive,
        };

        try {
            await api.put(`/admin/email-templates/${formData.type}`, data);
            toast.success('Template saved successfully');
            setShowModal(false);
            setEditingTemplate(null);
            setFormData({ type: '', subject: '', htmlContent: '', variables: '', isActive: true });
            fetchTemplates();
        } catch (error) {
            toast.error('Failed to save template');
        }
    };

    const deleteTemplate = async (type: string) => {
        toast.error('Delete functionality not available in API');
    };

    const openEditModal = (template: EmailTemplate) => {
        setEditingTemplate(template);
        setFormData({
            type: template.type,
            subject: template.subject,
            htmlContent: template.htmlContent,
            variables: template.variables.map(v => v.name).join(', '),
            isActive: template.isActive,
        });
        setShowModal(true);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Email Templates</h1>
                        <p className="text-gray-600 mt-1">Manage reusable email templates</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setEditingTemplate(null);
                            setFormData({ type: '', subject: '', htmlContent: '', variables: '', isActive: true });
                            setShowModal(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 gradient-gold text-white rounded-lg shadow-lg"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>Add Template</span>
                    </motion.button>
                </div>

                {/* Templates Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : templates.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                        <p className="text-gray-500">No email templates found. Create your first template to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {templates.map((template, index) => (
                            <motion.div
                                key={template.type}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl shadow-lg p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 capitalize">{template.type.replace(/-/g, ' ')}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{template.subject}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openEditModal(template)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            onClick={() => deleteTemplate(template.type)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg opacity-50 cursor-not-allowed"
                                            disabled
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-gray-700 line-clamp-3" dangerouslySetInnerHTML={{ __html: template.htmlContent }}></p>
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${template.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {template.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                {template.variables.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-600 mb-2">Available Variables:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {template.variables.map((variable, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                                                    title={variable.description}
                                                >
                                                    {`{{${variable.name}}}`}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Create/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                {editingTemplate ? 'Edit Template' : 'Create Template'}
                            </h2>
                            <form onSubmit={saveTemplate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Template Type *
                                    </label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        disabled={!!editingTemplate}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none disabled:bg-gray-100"
                                    >
                                        <option value="">Select Template Type</option>
                                        <option value="order-confirmation">Order Confirmation</option>
                                        <option value="order-status-update">Order Status Update</option>
                                        <option value="promotional">Promotional</option>
                                        <option value="welcome-subscriber">Welcome Subscriber</option>
                                    </select>
                                    {editingTemplate && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Template type cannot be changed after creation
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                        placeholder="Your order {{orderId}} has been confirmed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        HTML Content
                                    </label>
                                    <textarea
                                        required
                                        value={formData.htmlContent}
                                        onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                                        rows={10}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none font-mono text-sm"
                                        placeholder="<h1>Dear {{customerName}}</h1><p>Your order has been confirmed...</p>"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Variables (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.variables}
                                        onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                        placeholder="customerName, orderId, totalAmount"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Use these variables in HTML content like: {`{{variableName}}`}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="isActive" className="ml-2 text-sm font-semibold text-gray-700">
                                        Template is Active
                                    </label>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 gradient-gold text-white rounded-lg font-semibold"
                                    >
                                        {editingTemplate ? 'Update Template' : 'Create Template'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
