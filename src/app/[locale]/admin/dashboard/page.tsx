'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    FiShoppingBag,
    FiShoppingCart,
    FiDollarSign,
    FiClock,
    FiTrendingUp,
    FiPackage,
    FiEye,
} from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/axios';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Stats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    totalCustomers: number;
}

interface RecentOrder {
    _id: string;
    orderNumber: string;
    customerName: string;
    email: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, ordersRes] = await Promise.all([
                api.get('/admin/dashboard/stats').catch(() => ({ data: { data: null } })),
                api.get('/orders?limit=5').catch(() => ({ data: { orders: [] } })),
            ]);
            setStats(statsRes.data.data);
            setRecentOrders(ordersRes.data.orders || []);
        } catch (error: any) {
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const statCards = stats
        ? [
            {
                title: 'Total Products',
                value: stats.totalProducts,
                icon: FiShoppingBag,
                color: 'from-blue-500 to-blue-600',
                change: '+12%',
            },
            {
                title: 'Total Orders',
                value: stats.totalOrders,
                icon: FiShoppingCart,
                color: 'from-green-500 to-green-600',
                change: '+8%',
            },
            {
                title: 'Total Revenue',
                value: formatPrice(stats.totalRevenue),
                icon: FiDollarSign,
                color: 'from-yellow-500 to-yellow-600',
                change: '+15%',
            },
            {
                title: 'Pending Orders',
                value: stats.pendingOrders,
                icon: FiClock,
                color: 'from-orange-500 to-orange-600',
                change: '-5%',
            },
            {
                title: 'Completed Orders',
                value: stats.completedOrders,
                icon: FiPackage,
                color: 'from-purple-500 to-purple-600',
                change: '+20%',
            },
            {
                title: 'Total Customers',
                value: stats.totalCustomers,
                icon: FiTrendingUp,
                color: 'from-pink-500 to-pink-600',
                change: '+10%',
            },
        ]
        : [];

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Monitor your store performance</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                                    <div className="flex items-center mt-2 text-sm">
                                        <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                        <span className="text-green-500 font-semibold">{stat.change}</span>
                                        <span className="text-gray-500 ml-1">vs last month</span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Order Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentOrders?.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-semibold text-primary-600">
                                                    {order.orderNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.customerName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{order.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatPrice(order.totalAmount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => router.push(`/en/admin/orders/${order._id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
}
