const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// Mock data maps
const providersMap = {
  provider: '--'
};

const projectsMap = {
  projectId1: 'some string',
  projectId2: 'some string2'
};

// Validation middleware
const validateInput = (req, res, next) => {
  const { provider, projectId, token } = req.body;

  // if (!providersMap[provider]) {
  //   return res.status(400).json({ error: 'BAD', message: 'Invalid provider' });
  // }

  // if (!projectsMap[projectId]) {
  //   return res.status(400).json({ error: 'BAD', message: 'Invalid projectId' });
  // }
  if (!provider) {
    return res.status(400).json({ error: 'BAD', message: 'Invalid provider' });
  }

  if (!projectId) {
    return res.status(400).json({ error: 'BAD', message: 'Invalid projectId' });
  }

  if (!token.length > 10) {
    return res.status(401).json({ error: 'BAD', message: 'Invalid token' });
  }

  next();
};

app.post('/get-one-note-readonly', validateInput, async (req, res) => {
  const { provider, projectId, token } = req.body;
  console.log(token)
  try {
    const apiUrl = `${provider}/api/note/${projectId}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    const noteContent = response?.data?.content?.content
    
    if (!noteContent) {
      throw new Error('wrong response')
    }

    console.log(noteContent)
    res.json({
      data: noteContent,
      status: 'OK',
      statusCode: response.status
    });
    
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      res.status(error.response.status).json({
        error: 'BAD',
        message: `API request failed with status ${error.response.status}`,
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({
        error: 'BAD',
        message: 'No response received from API server'
      });
    } else {
      // Something happened in setting up the request
      res.status(500).json({
        error: 'BAD',
        message: error.message
      });
    }
  }
});

const PORT = 3206;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));