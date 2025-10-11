"use client";
import { useState } from 'react';

export default function EmailTestPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testEmail = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ 
        ok: false, 
        error: 'Network error: ' + error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const getEnvironmentInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-email');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ 
        ok: false, 
        error: 'Failed to get environment info: ' + error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">📧 Email System Test</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Test Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to test"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-[var(--brand)]"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={testEmail}
                disabled={loading}
                className="bg-[var(--brand)] text-white px-4 py-2 rounded hover:bg-[var(--brand)]/90 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Test Email'}
              </button>

              <button
                onClick={getEnvironmentInfo}
                disabled={loading}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
              >
                Check Environment
              </button>
            </div>

            {result && (
              <div className={`p-4 rounded ${result.ok ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <h3 className="font-semibold mb-2">
                  {result.ok ? '✅ Success' : '❌ Error'}
                </h3>
                
                {result.message && (
                  <p className="mb-2">{result.message}</p>
                )}

                {result.error && (
                  <p className="text-red-700 mb-2">{result.error}</p>
                )}

                {result.environment && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Environment:</h4>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                      {JSON.stringify(result.environment, null, 2)}
                    </pre>
                  </div>
                )}

                {result.details && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Details:</h4>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                )}

                {result.testOrder && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Test Order:</h4>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                      {JSON.stringify(result.testOrder, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold mb-2">📋 How to use this test:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>First click &quot;Check Environment&quot; to verify email configuration</li>
              <li>Enter your email address in the input field</li>
              <li>Click &quot;Send Test Email&quot; to test the email system</li>
              <li>Check your email inbox (and spam folder) for the test email</li>
              <li>Check the browser console for detailed logs</li>
            </ol>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold mb-2">⚠️ Gmail Setup Requirements:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Make sure you&apos;re using an &quot;App Password&quot; not your regular Gmail password</li>
              <li>Enable 2-Factor Authentication on your Gmail account</li>
              <li>Generate an App Password: Gmail Settings → Security → App passwords</li>
              <li>Use the 16-character app password in your .env.local file</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}