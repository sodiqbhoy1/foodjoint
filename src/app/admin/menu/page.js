"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FiPlus, FiEdit2, FiTrash, FiImage, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminLayout from '@/components/admin/AdminLayout';
import { getAuthHeaders, getAuthHeadersFormData } from '@/lib/apiHelpers';

export default function AdminMenuPage(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', price: '', category: '', description: '', image: '', status: 'available' });
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState('');

  const load = async () => {
    setMenuLoading(true);
    const res = await fetch('/api/menu');
    const data = await res.json();
    if (data.ok) setItems(data.items);
    setMenuLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Show loading state for image upload
    setForm(f => ({ ...f, imageUploading: true }));
    
    try {
      const fd = new FormData();
      fd.append('file', file);
      
      const res = await fetch('/api/upload', { 
        method: 'POST', 
        headers: getAuthHeadersFormData(),
        body: fd 
      });
      
      const data = await res.json();
      
      if (data.ok) {
        setForm(f => ({ ...f, image: data.url, imageUploading: false }));
      } else {
        alert('Failed to upload image: ' + (data.error || 'Unknown error'));
        setForm(f => ({ ...f, imageUploading: false }));
      }
    } catch (error) {
      alert('Failed to upload image: ' + error.message);
      setForm(f => ({ ...f, imageUploading: false }));
    }
  };

  const save = async () => {
    setLoading(true);
    const method = form.id ? 'PUT' : 'POST';
    const payload = { ...form };
    if (form.id) payload._id = form.id;
    const res = await fetch('/api/menu', { 
      method, 
      headers: getAuthHeaders(), 
      body: JSON.stringify(payload) 
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) { setForm({ id: '', name: '', price: '', category: '', description: '', image: '', status: 'available' }); load(); }
  };

  const edit = (it) => setForm({
    id: it._id || it.id,
    name: it.name,
    price: it.price,
    category: it.category,
    description: it.description,
    image: it.image,
    status: it.status || 'available'
  });
  const del = async (id) => { 
    await fetch('/api/menu?id=' + encodeURIComponent(id), { 
      method: 'DELETE',
      headers: getAuthHeaders()
    }); 
    load(); 
  };

  const toggleStatus = async (item) => {
    setStatusLoading(item._id || item.id);
    const res = await fetch('/api/menu', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        _id: item._id || item.id,
        status: item.status === 'available' ? 'unavailable' : 'available'
      })
    });
    setStatusLoading('');
    load();
  };

  return (
    <AdminLayout activePage="Menu">
      <AdminSidebar active="Menu" />
      <section className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-0">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Manage Menu</h1>

          <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">{form.id ? 'Edit item' : 'Add new item'}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. pizza, drinks" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]" value={form.description} rows={3} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-1">Image</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={onFileChange} 
                    className="text-sm"
                    disabled={form.imageUploading}
                  />
                  {form.imageUploading && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  )}
                  {form.image && !form.imageUploading && (
                    <div className="flex items-center gap-3">
                      <a href={form.image} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[var(--brand)] text-sm hover:underline">
                        <FiImage />Preview
                      </a>
                      <Image
                        src={form.image}
                        alt="Preview"
                        width={48}
                        height={48}
                        unoptimized
                        className="w-12 h-12 object-cover rounded border"
                      />
                      <button 
                        type="button"
                        onClick={() => setForm(f => ({ ...f, image: '' }))}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-6">
              <button onClick={save} disabled={loading} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--brand)] text-white px-6 py-2 rounded text-sm hover:bg-[var(--brand)]/90 disabled:opacity-50">
                <FiPlus /> {loading ? 'Saving...' : (form.id ? 'Update' : 'Add')}
              </button>
            </div>
          </div>      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Menu Items</h2>
        {menuLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-gray-600">
              <FiLoader className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading menu items...</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-600">No items yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Image</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(it => (
                  <tr key={it._id || it.id} className="border-b">
                    <td className="p-2">
                      {it.image ? (
                        <Image
                          src={it.image}
                          alt={it.name}
                          width={48}
                          height={48}
                          unoptimized
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">N/A</div>
                      )}
                    </td>
                    <td className="p-2 font-medium">{it.name}</td>
                    <td className="p-2">{it.category}</td>
                    <td className="p-2 font-semibold">₦{Number(it.price || 0).toFixed(2)}</td>
                    <td className="p-2">
                      <button onClick={() => toggleStatus(it)} disabled={statusLoading === (it._id || it.id)} className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs border">
                        {it.status === 'available' ? (
                          <span className="text-green-600 flex items-center gap-1"><FiCheckCircle /> Available</span>
                        ) : (
                          <span className="text-gray-400 flex items-center gap-1"><FiXCircle /> Unavailable</span>
                        )}
                      </button>
                    </td>
                    <td className="p-2">
                      <button onClick={() => edit(it)} className="p-2 rounded hover:bg-gray-100" title="Edit"><FiEdit2 /></button>
                      <button onClick={() => del(it._id || it.id)} className="p-2 rounded hover:bg-gray-100 text-red-600" title="Delete"><FiTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
        {/* Close max-w-4xl mx-auto container */}
      </div>
      </section>
    </AdminLayout>
  );
}
