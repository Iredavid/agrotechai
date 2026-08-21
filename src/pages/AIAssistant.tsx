import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton, Paper, Avatar, useTheme } from '@mui/material';
import  SmartToy  from '@mui/icons-material/SmartToy';
import  Send  from '@mui/icons-material/Send';
import  Person  from '@mui/icons-material/Person';

const AIAssistant: React.FC = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello John! I am your AgroTech AI Assistant. I have analyzed your farm data. How can I help you today?' },
    { sender: 'user', text: 'My maize leaves are turning yellow at the edges. What should I do?' },
    { sender: 'ai', text: 'Yellowing at the leaf edges in maize, especially on older leaves, is typically a sign of Potassium deficiency. Based on your recent soil profile, your Potassium levels are low (30%). I recommend applying a muriate of potash (MOP) fertilizer or a balanced NPK fertilizer with higher potassium content. Would you like me to calculate the exact dosage for your 2-hectare plot?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: 'I am a simulated assistant in this demo. In the real app, I would provide a specific, data-driven answer based on agricultural science and your farm profile.' }]);
    }, 1000);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>AI Assistant</Typography>
        <Typography variant="body1" color="text.secondary">Expert agricultural advice, available 24/7.</Typography>
      </Box>

      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3, bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#F8FAF8' }}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
              <Avatar sx={{ bgcolor: msg.sender === 'ai' ? 'primary.main' : 'secondary.main' }}>
                {msg.sender === 'ai' ? <SmartToy /> : <Person />}
              </Avatar>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  maxWidth: '75%', 
                  borderRadius: '12px',
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                  color: msg.sender === 'user' ? 'white' : 'text.primary',
                  border: msg.sender === 'ai' ? '1px solid' : 'none',
                  borderColor: 'divider',
                  borderTopLeftRadius: msg.sender === 'ai' ? 0 : '12px',
                  borderTopRightRadius: msg.sender === 'user' ? 0 : '12px',
                }}
              >
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>{msg.text}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth
            placeholder="Ask about crops, pests, fertilizers, or market prices..."
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            InputProps={{
              endAdornment: (
                <IconButton color="primary" onClick={handleSend} disabled={!input.trim()}>
                  <Send />
                </IconButton>
              ),
              sx: { borderRadius: '24px', bgcolor: theme.palette.mode === 'dark' ? 'action.hover' : '#f5f5f5' }
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default AIAssistant;
