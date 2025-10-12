"use client";
import { useEffect, useState } from 'react';
import { FiEye, FiTruck, FiCheck, FiClock, FiPhone, FiMail, FiMapPin, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [resendLoadingId, setResendLoadingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.ok) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async (order) => {
    try {
      setResendLoadingId(order._id);
      const res = await fetch('/api/orders/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order._id })
      });
      const data = await res.json();
      if (data.ok && data.result?.success) {
        setToast({ type: 'success', message: 'Confirmation email resent successfully.' });
        loadOrders();
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to resend email.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to resend email.' });
    } finally {
      setResendLoadingId(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: orderId, status: newStatus })
      });
      if (res.ok) {
        loadOrders(); // Refresh orders
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="w-4 h-4" />;
      case 'preparing': return <FiTruck className="w-4 h-4" />;
      case 'ready': return <FiCheck className="w-4 h-4" />;
      case 'delivered': return <FiCheck className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  if (loading) {
    return (
      <AdminLayout>
        <AdminSidebar active="Orders" />
        <section className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand)] mx-auto mb-4"></div>
              <p>Loading orders...</p>
            </div>
          </div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminSidebar active="Orders" />
      <section className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Orders Management</h1>
            <div className="flex items-center gap-4">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto border rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 md:p-8 text-center">
              <FiTruck className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-sm md:text-base text-gray-500">
                {statusFilter === 'all' ? 'No orders have been placed yet.' : `No ${statusFilter} orders found.`}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Mobile Card View */}
              <div className="block md:hidden">
                <div className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <div key={order._id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">#{order.reference}</div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || 'pending')}`}>
                          {getStatusIcon(order.status || 'pending')}
                          {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>{order.customer?.name || 'N/A'}</div>
                        <div className="text-xs">{order.customer?.email}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">{order.items?.length || 0} items</div>
                          <div className="font-medium text-gray-900">₦{order.amount?.toFixed(2)}</div>
                          <div className="mt-1">
                            {order.paid ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FiCheckCircle className="w-3 h-3" />
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <FiXCircle className="w-3 h-3" />
                                Unpaid
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 text-[var(--brand)] hover:text-[var(--brand)]/80 text-sm py-2 px-3 border border-[var(--brand)] rounded"
                        >
                          View Details
                        </button>
                        {order.status !== 'delivered' && (
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="text-xs border rounded px-2 py-2 focus:outline-none focus:border-[var(--brand)]"
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-4 lg:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-4 lg:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-4 lg:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 lg:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-4 lg:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 lg:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 lg:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">#{order.reference}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="text-gray-900">{order.customer?.name || 'N/A'}</div>
                          <div className="text-gray-500 text-xs">{order.customer?.email}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="text-gray-900">{order.items?.length || 0} items</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">₦{order.amount?.toFixed(2)}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          {order.paid ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FiCheckCircle className="w-3 h-3" />
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <FiXCircle className="w-3 h-3" />
                              Unpaid
                            </span>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || 'pending')}`}>
                            {getStatusIcon(order.status || 'pending')}
                            {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-[var(--brand)] hover:text-[var(--brand)]/80 p-1"
                              title="View Details"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            {!order.confirmationEmailSent && order.customer?.email && (
                              <button
                                onClick={() => resendEmail(order)}
                                className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                                disabled={resendLoadingId === order._id}
                                title="Resend confirmation email"
                              >
                                {resendLoadingId === order._id ? 'Resending...' : 'Resend Email'}
                              </button>
                            )}
                            {order.status !== 'delivered' && (
                              <select
                                value={order.status || 'pending'}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                className="text-xs border rounded px-2 py-1 focus:outline-none focus:border-[var(--brand)]"
                              >
                                <option value="pending">Pending</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready">Ready</option>
                                <option value="delivered">Delivered</option>
                              </select>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 md:p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg md:text-xl font-bold">Order Details - #{selectedOrder.reference}</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{selectedOrder.customer?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{selectedOrder.customer?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-start gap-2 md:col-span-2">
                      <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="break-words">{selectedOrder.customer?.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b text-sm">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.title || item.name}</div>
                          <div className="text-xs md:text-sm text-gray-500">Qty: {item.qty || item.quantity || 1}</div>
                        </div>
                        <div className="font-medium ml-2">₦{((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center font-bold text-base md:text-lg">
                      <span>Total:</span>
                      <span>₦{selectedOrder.amount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div>
                  <h3 className="font-semibold mb-3">Order Status</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status || 'pending')}`}>
                      {getStatusIcon(selectedOrder.status || 'pending')}
                      {(selectedOrder.status || 'pending').charAt(0).toUpperCase() + (selectedOrder.status || 'pending').slice(1)}
                    </span>
                    {selectedOrder.status !== 'delivered' && (
                      <select
                        value={selectedOrder.status || 'pending'}
                        onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                        className="w-full sm:w-auto border rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    )}
                    {!selectedOrder.confirmationEmailSent && selectedOrder.customer?.email && (
                      <button
                        onClick={() => resendEmail(selectedOrder)}
                        className="text-xs sm:text-sm px-3 py-2 border rounded hover:bg-gray-50"
                        disabled={resendLoadingId === selectedOrder._id}
                      >
                        {resendLoadingId === selectedOrder._id ? 'Resending...' : 'Resend Email'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <h3 className="font-semibold mb-3">Payment Status</h3>
                  <div className="flex items-center gap-2">
                    {selectedOrder.paid ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="w-4 h-4" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <FiXCircle className="w-4 h-4" />
                        Unpaid
                      </span>
                    )}
                    {selectedOrder.paystack_reference && (
                      <span className="text-xs text-gray-500">
                        Ref: {selectedOrder.paystack_reference}
                      </span>
                    )}
                  </div>
                </div>

                {/* Order Date */}
                <div>
                  <h3 className="font-semibold mb-3">Order Date</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </AdminLayout>
  );
}