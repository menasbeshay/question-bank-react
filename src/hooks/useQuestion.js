import { useState, useEffect } from 'react';
import { fetchQuestions, createQuestion, updateQuestion, deleteQuestion } from '../utils/api';

const useQuestions = () => {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchQuestions();
      setQuestions(data);
    };
    fetchData();
  }, []);

  const addQuestion = async (question) => {
    const newQuestion = await createQuestion(question);
    setQuestions([...questions, newQuestion]);
  };

  const editQuestion = async (question) => {
    const updatedQuestion = await updateQuestion(question);
    setQuestions(
      questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

  const removeQuestion = async (questionId) => {
    await deleteQuestion(questionId);
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  return { questions, addQuestion, editQuestion, removeQuestion };
};

export default useQuestions;