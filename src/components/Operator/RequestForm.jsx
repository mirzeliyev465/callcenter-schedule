import React from 'react';

const RequestForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = React.useState({
    type: 'Smen Dəyişimi',
    details: '',
    month: new Date().toISOString().substring(0, 7)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sorğu Növü</label>
        <select 
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="Smen Dəyişimi">Smen Dəyişimi</option>
          <option value="Mezuniyyet">Mezuniyyet</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ay</label>
        <input
          type="month"
          value={formData.month}
          onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Təfərrüatlar</label>
        <textarea
          value={formData.details}
          onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Sorğunuzun təfərrüatlarını ətraflı şəkildə yazın..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || !formData.details.trim()}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Göndərilir...' : 'Sorğunu Göndər'}
      </button>
    </form>
  );
};

export default RequestForm;