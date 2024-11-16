const QuestionListItem = ({ question, onEdit, onDelete }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{question.text}</h3>
          <p className="text-gray-500">Category: {question.category}</p>
        </div>
        <div className="flex space-x-2">
          <button
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
            onClick={() => onEdit(question)}
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            className="text-red-500 hover:text-red-700 focus:outline-none"
            onClick={() => onDelete(question.id)}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };
  
  export default QuestionListItem;