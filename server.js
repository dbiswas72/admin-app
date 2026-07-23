const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let items = [
  { id: 1, name: 'Item 1', description: 'First item' },
  { id: 2, name: 'Item 2', description: 'Second item' },
  { id: 3, name: 'Item 3', description: 'Third item' }
];

let nextId = 4;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json(item);
});

app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const newItem = {
    id: nextId++,
    name,
    description: description || ''
  };
  
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  
  const itemIndex = items.findIndex(i => i.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  items[itemIndex] = {
    ...items[itemIndex],
    name: name !== undefined ? name : items[itemIndex].name,
    description: description !== undefined ? description : items[itemIndex].description
  };
  
  res.json(items[itemIndex]);
});

app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(i => i.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const deletedItem = items[itemIndex];
  items.splice(itemIndex, 1);
  
  res.json({ 
    success: true, 
    message: 'Item deleted successfully',
    item: deletedItem 
  });
});

app.listen(PORT, () => {
  console.log(`Admin app server running on http://localhost:${PORT}`);
});

module.exports = app;
