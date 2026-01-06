'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiTrash2, FiCopy, FiCheck } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function UploadPage() {
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append('images', file);
        });

        try {
            setUploading(true);
            const response = await api.post('/upload/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const newFiles = response.data.data.filenames;
            setUploadedFiles([...newFiles, ...uploadedFiles]);
            toast.success(`${newFiles.length} file(s) uploaded successfully`);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const deleteFile = async (filename: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            await api.delete(`/upload/${filename}`);
            setUploadedFiles(uploadedFiles.filter((f) => f !== filename));
            toast.success('File deleted successfully');
        } catch (error) {
            toast.error('Failed to delete file');
        }
    };

    const copyUrl = (filename: string) => {
        const url = getImageUrl(filename);
        navigator.clipboard.writeText(url);
        setCopiedUrl(filename);
        toast.success('URL copied to clipboard');
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">File Upload</h1>
                    <p className="text-gray-600 mt-1">Upload and manage product images</p>
                </div>

                {/* Upload Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                >
                    <div
                        className="border-4 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-500 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <FiUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
                        </h3>
                        <p className="text-gray-600">
                            Support for JPG, PNG, WEBP, GIF (Max 5MB per file)
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    {uploading && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Uploaded Files Grid */}
                {uploadedFiles.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Recently Uploaded ({uploadedFiles.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {uploadedFiles.map((filename, index) => (
                                <motion.div
                                    key={filename}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden group"
                                >
                                    {/* Image Preview */}
                                    <div className="relative h-48 bg-gray-100">
                                        <Image
                                            src={getImageUrl(filename)}
                                            alt={filename}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* File Info */}
                                    <div className="p-4">
                                        <div className="flex items-center text-sm text-gray-600 mb-3">
                                            <FiFile className="w-4 h-4 mr-2" />
                                            <span className="truncate">{filename}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => copyUrl(filename)}
                                                className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm flex items-center justify-center space-x-1"
                                            >
                                                {copiedUrl === filename ? (
                                                    <>
                                                        <FiCheck className="w-4 h-4" />
                                                        <span>Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiCopy className="w-4 h-4" />
                                                        <span>Copy URL</span>
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => deleteFile(filename)}
                                                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upload Tips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-xl p-6"
                >
                    <h3 className="font-bold text-blue-900 mb-2">📸 Upload Tips</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li>• Use high-quality images (at least 1000x1000px) for best results</li>
                        <li>• Keep file sizes under 5MB for faster loading</li>
                        <li>• Use descriptive filenames for better organization</li>
                        <li>• Supported formats: JPG, PNG, WEBP, GIF</li>
                        <li>• Copy the URL to use in product descriptions</li>
                    </ul>
                </motion.div>
            </div>
        </AdminLayout>
    );
}
