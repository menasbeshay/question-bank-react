import React, { useState } from 'react';
const QuestionForm = ({ onCreateQuestion }) => {
    const [text, setText] = useState('');
    const [category, setCategory] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onCreateQuestion({ text, category });
      setText('');
      setCategory('');
    };
  
    return (
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4">
        <div className="mb-4">
          <label htmlFor="text" className="block text-gray-700 font-medium mb-2">
            Question Text
          </label>
          <input
            type="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Create Question
        </button>
      </form>
    );
  };
  
  export default QuestionForm;