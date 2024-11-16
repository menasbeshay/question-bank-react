import { API_BASE_URL } from './config';

const QuestionBankApi = {
  getCourses: () => {
    return fetch(`${API_BASE_URL}/course`)
      .then(response => response.json());
  },

  getCourseTopics: (courseId) => {
    return fetch(`${API_BASE_URL}/course/coursetopic?courseid=${courseId}`)
      .then(response => response.json());
  },

  addTopic: (courseId, topic) => {
    return fetch(`${API_BASE_URL}/course/coursetopic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(topic)
    })
    .then(response => response.json());
  },

  updateTopic: (courseId, topicId, topic) => {
    return fetch(`${API_BASE_URL}/course/coursetopic/${topicId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(topic)
    })
    .then(response => response.json());
  },

  deleteTopic: (courseId, topicId) => {
    return fetch(`${API_BASE_URL}/course/coursetopic/${topicId}`, {
      method: 'DELETE'
    })
    .then(response => response.json());
  },

  addQuestion: (courseId, topicId, question) => {
    return fetch(`${API_BASE_URL}/courses/${courseId}/topics/${topicId}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(question)
    })
    .then(response => response.json());
  },

  updateQuestion: (courseId, topicId, questionId, question) => {
    return fetch(`${API_BASE_URL}/courses/${courseId}/topics/${topicId}/questions/${questionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(question)
    })
    .then(response => response.json());
  },

  deleteQuestion: (courseId, topicId, questionId) => {
    return fetch(`${API_BASE_URL}/courses/${courseId}/topics/${topicId}/questions/${questionId}`, {
      method: 'DELETE'
    })
    .then(response => response.json());
  },

  bulkMoveQuestions: (courseId, topicId, questionIds, destTopicId) => {
    return fetch(`${API_BASE_URL}/courses/${courseId}/topics/${topicId}/questions/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ questionIds, destTopicId })
    })
    .then(response => response.json());
  }
};

export default QuestionBankApi;
