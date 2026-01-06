'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPackage, FiUser, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/axios';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface OrderItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        images: string[];
    };
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    customerName: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    tax: number;
    totalAmount: number;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchOrder();
        }
    }, [params.id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/orders/${params.id}`);
            setOrder(response.data.order);
        } catch (error) {
            toast.error('Failed to fetch order details');
            console.error('Fetch order error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (newStatus: string) => {
        try {
            setUpdating(true);
            await api.put(`/orders/${params.id}/status`, { status: newStatus });
            toast.success('Order status updated successfully');
            fetchOrder();
        } catch (error) {
            toast.error('Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

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

    if (!order) {
        return (
            <AdminLayout>
                <div className="text-center py-12">
                    <p className="text-gray-500">Order not found</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
                            <p className="text-gray-600 mt-1">{order.orderNumber}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span
                            className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            {order.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <FiPackage className="w-5 h-5 mr-2" />
                                    Order Items
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {order.items?.map((item) => (
                                    <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="h-20 w-20 relative rounded-lg overflow-hidden bg-gray-200">
                                            {item.product?.images?.[0] && (
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{formatPrice(item.price)}</p>
                                            <p className="text-sm text-gray-600">
                                                Total: {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <FiUser className="w-5 h-5 mr-2" />
                                    Customer Information
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-start space-x-3">
                                    <FiUser className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-semibold text-gray-900">{order.customerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <FiMail className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold text-gray-900">{order.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <FiPhone className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-semibold text-gray-900">{order.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                {order.address && (
                                    <div className="flex items-start space-x-3">
                                        <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600">Shipping Address</p>
                                            <p className="font-semibold text-gray-900">
                                                {order.address.street}
                                                <br />
                                                {order.address.city}, {order.address.state} {order.address.zipCode}
                                                <br />
                                                {order.address.country}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order.subtotal || 0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{formatPrice(order.shippingCost || 0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>{formatPrice(order.tax || 0)}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary-600">{formatPrice(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Update Status */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">Update Status</h2>
                            </div>
                            <div className="p-6 space-y-3">
                                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => updateOrderStatus(status)}
                                        disabled={updating || order.status === status}
                                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${order.status === status
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-primary-600 text-white hover:bg-primary-700'
                                            }`}
                                    >
                                        Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">Order Info</h2>
                            </div>
                            <div className="p-6 space-y-3 text-sm">
                                <div>
                                    <p className="text-gray-600">Payment Method</p>
                                    <p className="font-semibold text-gray-900">{order.paymentMethod || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Payment Status</p>
                                    <p className="font-semibold text-gray-900">{order.paymentStatus || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Order Date</p>
                                    <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Last Updated</p>
                                    <p className="font-semibold text-gray-900">{formatDate(order.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
