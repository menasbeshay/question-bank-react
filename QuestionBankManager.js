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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Course Question Bank Manager</h1>
        <div className="mt-4">
          <label className="block text-sm font-medium">Select Course</label>
          <select
            className="mt-1 w-full rounded-md border p-2"
            value={selectedCourse?.id}
            onChange={e => setSelectedCourse(courses.find(c => c.id === parseInt(e.target.value)))}
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedCourse && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="space-y-4">
            <Droppable droppableId="topics" type="TOPIC">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {topics.map((topic, index) => (
                    <Draggable key={topic.id} draggableId={topic.id.toString()} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps}>
                          <Card className="relative">
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2" {...provided.dragHandleProps}>
                                  <GripVertical className="h-5 w-5 text-gray-400" />
                                  <CardTitle>{topic.name}</CardTitle>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateTopicOrder(topic.id, 'up')}
                                    disabled={index === 0}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateTopicOrder(topic.id, 'down')}
                                    disabled={index === topics.length - 1}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => {
                                    setSelectedTopic(topic);
                                    setIsTopicModalOpen(true);
                                  }}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => deleteTopic(topic.id)}>
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 mb-4">{topic.description}</p>
                              
                              <Droppable droppableId={topic.id.toString()} type="QUESTION">
                                {(provided) => (
                                  <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {topic.questions.map((question, index) => (
                                      <Draggable key={question.id} draggableId={question.id.toString()} index={index}>
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="p-3 bg-gray-50 rounded-lg mb-2"
                                          >
                                            <p className="font-medium">{question.title}</p>
                                            <div className="mt-2 space-y-1">
                                              {question.answers.map(answer => (
                                                <div key={answer.id} className="flex items-center space-x-2">
                                                  <div className={`w-4 h-4 rounded-full ${answer.isCorrect ? 'bg-green-500' : 'bg-red-500'}`} />
                                                  <p className="text-sm">{answer.answerText}</p>
                                                </div>
                                              ))}
                                            </div>
                                            <div className="flex justify-end mt-2 space-x-2">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                  setQuestionToEdit(question);
                                                  setIsQuestionModalOpen(true);
                                                }}
                                              >
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteQuestion(topic.id, question.id)}
                                              >
                                                <Trash className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>

                              <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
                                <DialogTrigger asChild>
                                  <Button className="mt-4" variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Question
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      {questionToEdit ? 'Edit Question' : 'Add New Question to '}{topic.name}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <QuestionForm
                                    topic={topic}
                                    question={questionToEdit}
                                    onSave={(newQuestion) => {
                                      if (questionToEdit) {
                                        updateQuestion(topic.id, questionToEdit.id, newQuestion);
                                      } else {
                                        addQuestion(topic.id, newQuestion);
                                      }
                                      setIsQuestionModalOpen(false);
                                      setQuestionToEdit(null);
                                    }}
                                  />
                                </DialogContent>
                              </Dialog>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      )}

      <Dialog open={isTopicModalOpen} onOpenChange={setIsTopicModalOpen}>
        <DialogTrigger asChild>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Topic
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTopic ? 'Edit Topic' : 'Add New Topic'}</DialogTitle>
          </DialogHeader>
          <TopicForm
            topic={selectedTopic}
            onSave={(data) => {
              if (selectedTopic) {
                updateTopic(selectedTopic.id, data);
              } else {
                addTopic(data);
              }
              setIsTopicModalOpen(false);
              setSelectedTopic(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const TopicForm = ({ topic, onSave }) => {
  const [formData, setFormData] = useState(topic || { name: '', description: '' });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border p-2"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          className="mt-1 w-full rounded-md border p-2"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <Button onClick={() => onSave(formData)}>Save Topic</Button>
    </div>
  );
};

const QuestionForm = ({ topic, question, onSave }) => {
  const [formData, setFormData] = useState(question || {
    title: '',
    questionTypeId: 1,
    answers: [{ answerText: '', isCorrect: false }]
  });

  const addAnswer = () => {
    setFormData({
      ...formData,
      answers: [...formData.answers, { answerText: '', isCorrect: false }]
    });
  };

  const saveQuestion = () => {
    onSave(formData);
  };

export default QuestionBankManager;
