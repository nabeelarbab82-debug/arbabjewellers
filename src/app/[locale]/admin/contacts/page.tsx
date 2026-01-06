'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiMail, FiCheck } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/axios';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Contact {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/contacts');
            setContacts(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (contactId: string, status: string) => {
        try {
            await api.put(`/admin/contacts/${contactId}`, { status });
            toast.success('Status updated successfully');
            fetchContacts();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const statusColors: Record<string, string> = {
        new: 'bg-blue-100 text-blue-800',
        read: 'bg-yellow-100 text-yellow-800',
        replied: 'bg-green-100 text-green-800',
        archived: 'bg-gray-100 text-gray-800',
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
                    <p className="text-gray-600 mt-1">Manage customer inquiries</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {['new', 'read', 'replied', 'archived'].map((status) => (
                        <motion.div
                            key={status}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow p-4"
                        >
                            <div className="text-sm text-gray-600 capitalize mb-1">{status}</div>
                            <div className="text-2xl font-bold text-gray-800">
                                {contacts.filter((c) => c.status === status).length}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Contacts Table */}
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Subject
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {contacts.map((contact) => (
                                        <tr
                                            key={contact._id}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => setSelectedContact(contact)}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-900">{contact.name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{contact.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-900">{contact.subject}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={contact.status}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        updateStatus(contact._id, e.target.value);
                                                    }}
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[contact.status]
                                                        }`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="read">Read</option>
                                                    <option value="replied">Replied</option>
                                                    <option value="archived">Archived</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(contact.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.location.href = `mailto:${contact.email}`;
                                                    }}
                                                    className="text-primary-600 hover:text-primary-800"
                                                >
                                                    <FiMail className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Message Detail Modal */}
                {selectedContact && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedContact(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Message Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">From</label>
                                    <p className="text-gray-900">{selectedContact.name}</p>
                                    <p className="text-gray-600 text-sm">{selectedContact.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Subject</label>
                                    <p className="text-gray-900">{selectedContact.subject}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Message</label>
                                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Date</label>
                                    <p className="text-gray-900">{formatDate(selectedContact.createdAt)}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex space-x-3">
                                <button
                                    onClick={() => window.location.href = `mailto:${selectedContact.email}`}
                                    className="flex-1 py-3 gradient-gold text-white rounded-lg font-semibold"
                                >
                                    Reply via Email
                                </button>
                                <button
                                    onClick={() => {
                                        updateStatus(selectedContact._id, 'replied');
                                        setSelectedContact(null);
                                    }}
                                    className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold"
                                >
                                    Mark as Replied
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
