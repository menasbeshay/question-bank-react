import React from 'react';
import QuestionListItem from './QuestionListItem';

const QuestionList = ({ questions, onEditQuestion, onDeleteQuestion }) => {
  return (
    <div>
      {questions.map((question) => (
        <QuestionListItem
          key={question.id}
          question={question}
          onEdit={onEditQuestion}
          onDelete={onDeleteQuestion}
        />
      ))}
    </div>
  );
};

export default QuestionList;