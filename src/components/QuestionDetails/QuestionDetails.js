import React from 'react';

const QuestionDetails = ({ question }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-medium mb-2">{question.text}</h2>
      <p className="text-gray-500 mb-4">Category: {question.category}</p>
      <div className="border-t pt-4">
        <p>
          <span className="font-medium">ID:</span> {question.id}
        </p>
        <p>
          <span className="font-medium">Created At:</span>{' '}
          {new Date(question.createdAt).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Updated At:</span>{' '}
          {new Date(question.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default QuestionDetails;