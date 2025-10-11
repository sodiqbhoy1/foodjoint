"use client";
import { useCart } from '@/context/cart';
import { useNotification } from '@/context/notification';

export default function TestNotificationPage() {
  const { add } = useCart();
  const { showCartNotification, addNotification } = useNotification();

  const testCartNotification = () => {
    const testItem = {
      key: 'test-pizza',
      title: 'Test Pizza',
      price: 2500,
      image: '/placeholder.jpg'
    };
    add(testItem, 1);
  };

  const testCustomNotification = () => {
    addNotification('This is a test notification!', 'success');
  };

  const testErrorNotification = () => {
    addNotification('This is an error notification!', 'error');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">🧪 Test Notifications</h1>
          
          <div className="space-y-4">
            <button
              onClick={testCartNotification}
              className="w-full bg-[var(--brand)] text-white px-4 py-3 rounded-lg hover:bg-[var(--brand)]/90 transition-colors"
            >
              Test Cart Notification
            </button>

            <button
              onClick={testCustomNotification}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Test Success Notification
            </button>

            <button
              onClick={testErrorNotification}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Test Error Notification
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ul className="text-sm space-y-1">
              <li>• Click buttons to test different notification types</li>
              <li>• Notifications should appear in top-right corner</li>
              <li>• They should auto-disappear after 3-4 seconds</li>
              <li>• You can manually close them with the X button</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}