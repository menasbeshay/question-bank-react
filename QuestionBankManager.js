import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical, ChevronDown, ChevronUp, Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import QuestionBankApi from './QuestionBankApi';

const QuestionBankManager = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);

  useEffect(() => {
    // Fetch courses on component mount
    QuestionBankApi.getCourses().then(setCourses);
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      // Fetch topics for the selected course
      QuestionBankApi.getCourseTopics(selectedCourse.id).then(setTopics);
    }
  }, [selectedCourse]);

  // Topic CRUD operations
  const addTopic = (newTopic) => {
    QuestionBankApi.addTopic(selectedCourse.id, newTopic).then(createdTopic => {
      setTopics([...topics, createdTopic]);
    });
  };

  const updateTopic = (topicId, updatedTopic) => {
    QuestionBankApi.updateTopic(selectedCourse.id, topicId, updatedTopic).then(updatedTopic => {
      setTopics(topics.map(t => t.id === topicId ? updatedTopic : t));
    });
  };

  const deleteTopic = (topicId) => {
    QuestionBankApi.deleteTopic(selectedCourse.id, topicId).then(() => {
      setTopics(topics.filter(t => t.id !== topicId));
    });
  };

  const updateTopicOrder = (topicId, direction) => {
    const newTopics = [...topics];
    const index = newTopics.findIndex(t => t.id === topicId);
    if (direction === 'up' && index > 0) {
      [newTopics[index], newTopics[index - 1]] = [newTopics[index - 1], newTopics[index]];
    } else if (direction === 'down' && index < newTopics.length - 1) {
      [newTopics[index], newTopics[index + 1]] = [newTopics[index + 1], newTopics[index]];
    }
    setTopics(newTopics);
    // Update topic order on the server
    QuestionBankApi.updateTopic(selectedCourse.id, topicId, newTopics[index]).then(() => {
      QuestionBankApi.updateTopic(selectedCourse.id, newTopics[index === 0 ? 1 : index - 1].id, newTopics[index === 0 ? 0 : index - 1]);
    });
  };

  // Question CRUD operations
  const addQuestion = (topicId, newQuestion) => {
    QuestionBankApi.addQuestion(selectedCourse.id, topicId, newQuestion).then(createdQuestion => {
      setTopics(topics.map(t => t.id === topicId ? { ...t, questions: [...t.questions, createdQuestion] } : t));
    });
  };

  const updateQuestion = (topicId, questionId, updatedQuestion) => {
    QuestionBankApi.updateQuestion(selectedCourse.id, topicId, questionId, updatedQuestion).then(updatedQuestion => {
      setTopics(topics.map(t => t.id === topicId ? { ...t, questions: t.questions.map(q => q.id === questionId ? updatedQuestion : q) } : t));
    });
  };

  const deleteQuestion = (topicId, questionId) => {
    QuestionBankApi.deleteQuestion(selectedCourse.id, topicId, questionId).then(() => {
      setTopics(topics.map(t => t.id === topicId ? { ...t, questions: t.questions.filter(q => q.id !== questionId) } : t));
    });
  };

  const bulkMoveQuestions = (topicId, questionIds, destTopicId) => {
    QuestionBankApi.bulkMoveQuestions(selectedCourse.id, topicId, questionIds, destTopicId).then(() => {
      setTopics(topics.map(t => {
        if (t.id === topicId) {
          return { ...t, questions: t.questions.filter(q => !questionIds.includes(q.id)) };
        } else if (t.id === destTopicId) {
          return { ...t, questions: [...t.questions, ...topics.find(x => x.id === topicId).questions.filter(q => questionIds.includes(q.id))] };
        }
        return t;
      }));
    });
  };

  // Drag and drop functionality
  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result.type === 'TOPIC') {
      updateTopicOrder(result.draggableId, result.destination.index > result.source.index ? 'down' : 'up');
    } else {
      bulkMoveQuestions(result.source.droppableId, result.draggableIds, result.destination.droppableId);
    }
  };

  // UI components and rendering logic
  // ...
}

// Other components like TopicForm, QuestionForm, etc.
// ...

export default QuestionBankManager;
