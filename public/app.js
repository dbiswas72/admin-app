const API_BASE = '/api';

async function fetchItems() {
    try {
        const response = await fetch(`${API_BASE}/items`);
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }
        const items = await response.json();
        renderItems(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        showNotification('Failed to load items', 'error');
    }
}

function renderItems(items) {
    const itemsList = document.getElementById('itemsList');
    
    if (items.length === 0) {
        itemsList.innerHTML = '<div class="empty-state">No items yet. Add one above!</div>';
        return;
    }
    
    itemsList.innerHTML = items.map(item => `
        <div class="item-card" data-id="${item.id}">
            <div class="item-info">
                <div class="item-name">${escapeHtml(item.name)}</div>
                <div class="item-description">${escapeHtml(item.description)}</div>
                <div class="item-id">ID: ${item.id}</div>
            </div>
            <div class="item-actions">
                <button class="btn-delete" onclick="deleteItem(${item.id})">Delete Fx</button>
            </div>
        </div>
    `).join('');
}

async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/items/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete item');
        }
        
        const result = await response.json();
        showNotification('Item deleted successfully', 'success');
        
        await fetchItems();
    } catch (error) {
        console.error('Error deleting item:', error);
        showNotification(error.message || 'Failed to delete item', 'error');
    }
}

async function addItem(name, description) {
    try {
        const response = await fetch(`${API_BASE}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add item');
        }
        
        const newItem = await response.json();
        showNotification('Item added successfully', 'success');
        
        await fetchItems();
        
        return newItem;
    } catch (error) {
        console.error('Error adding item:', error);
        showNotification(error.message || 'Failed to add item', 'error');
        throw error;
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

document.getElementById('addItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('itemName');
    const descriptionInput = document.getElementById('itemDescription');
    
    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (!name) {
        showNotification('Please enter an item name', 'error');
        return;
    }
    
    try {
        await addItem(name, description);
        nameInput.value = '';
        descriptionInput.value = '';
        nameInput.focus();
    } catch (error) {
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
});
