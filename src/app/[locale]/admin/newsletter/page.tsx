'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiSend, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/axios';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Subscriber {
    _id: string;
    email: string;
    createdAt: string;
    isActive: boolean;
}

export default function NewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [emailData, setEmailData] = useState({
        subject: '',
        body: '',
    });

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/newsletter/subscribers');
            setSubscribers(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch subscribers');
        } finally {
            setLoading(false);
        }
    };

    const sendBulkEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailData.subject || !emailData.body) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setSending(true);
            await api.post('/admin/newsletter/send-bulk', emailData);
            toast.success('Email sent to all subscribers successfully!');
            setEmailData({ subject: '', body: '' });
        } catch (error) {
            toast.error('Failed to send email');
        } finally {
            setSending(false);
        }
    };

    const deleteSubscriber = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subscriber?')) return;

        try {
            await api.delete(`/admin/newsletter/subscribers/${id}`);
            toast.success('Subscriber deleted successfully');
            fetchSubscribers();
        } catch (error) {
            toast.error('Failed to delete subscriber');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Newsletter</h1>
                    <p className="text-gray-600 mt-1">Manage subscribers and send campaigns</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
                    >
                        <FiMail className="w-8 h-8 mb-2" />
                        <h3 className="text-3xl font-bold">{subscribers.length}</h3>
                        <p className="text-blue-100">Total Subscribers</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
                    >
                        <FiSend className="w-8 h-8 mb-2" />
                        <h3 className="text-3xl font-bold">
                            {subscribers.filter((s) => s.isActive).length}
                        </h3>
                        <p className="text-green-100">Active Subscribers</p>
                    </motion.div>
                </div>

                {/* Send Bulk Email */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Send Bulk Email</h2>
                    <form onSubmit={sendBulkEmail} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                value={emailData.subject}
                                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                placeholder="Enter email subject..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Message Body
                            </label>
                            <textarea
                                value={emailData.body}
                                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                                rows={6}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                placeholder="Enter email body..."
                            />
                        </div>
                        <motion.button
                            type="submit"
                            disabled={sending}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center space-x-2 px-6 py-3 gradient-gold text-white rounded-lg shadow-lg disabled:opacity-50"
                        >
                            <FiSend />
                            <span>{sending ? 'Sending...' : `Send to ${subscribers.length} subscribers`}</span>
                        </motion.button>
                    </form>
                </motion.div>

                {/* Subscribers List */}
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Subscribers</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Subscribed Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {subscribers.map((subscriber) => (
                                        <tr key={subscriber._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-900">{subscriber.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${subscriber.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {subscriber.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(subscriber.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => deleteSubscriber(subscriber._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
