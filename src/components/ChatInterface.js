import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, Chip, Stack, Avatar, Fade, Zoom, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { styled } from '@mui/material/styles';

// Styled components for better visuals
const StyledMessageBubble = styled(Paper)(({ theme, type }) => ({
  padding: theme.spacing(2),
  backgroundColor: type === 'user' ? '#1976d2' : '#ffffff',
  color: type === 'user' ? '#ffffff' : '#3a3a3a',
  borderRadius: type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
  whiteSpace: 'pre-wrap',
  maxWidth: '85%',
  position: 'relative',
  '&::after': type === 'user' ? {
    content: '""',
    position: 'absolute',
    bottom: 0,
    right: '-10px',
    width: '20px',
    height: '20px',
    backgroundColor: '#1976d2',
    borderRadius: '0 0 0 20px',
    clipPath: 'polygon(0 0, 0% 100%, 100% 100%)'
  } : undefined
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: '16px 16px 0 0',
  background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
  color: '#ffffff',
  marginBottom: theme.spacing(2)
}));

const SuggestionChip = styled(Chip)(({ theme }) => ({
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  animation: 'fadeIn 0.5s',
  '&:hover': {
    backgroundColor: '#e3f2fd',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  }
}));

const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: '#1976d2',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.7)' },
    '70%': { boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)' }
  }
}));

const InputWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  position: 'sticky',
  bottom: 0,
  backgroundColor: '#ffffff',
  padding: theme.spacing(2),
  borderTop: '1px solid #eaeaea',
  borderRadius: '0 0 16px 16px'
}));

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestionChips = [
    { label: 'Who are you?', icon: <PersonIcon />, query: 'Who are you?' },
    { label: 'Work Experience', icon: <WorkIcon />, query: 'What is your work experience?' },
    { label: 'Skills', icon: <CodeIcon />, query: 'What are your technical skills?' },
    { label: 'Education', icon: <SchoolIcon />, query: 'What is your educational background?' },
    { label: 'Projects', icon: <FolderSpecialIcon />, query: 'Tell me about your projects' },
    { label: 'Certifications', icon: <CardMembershipIcon />, query: 'What certifications do you have?' }
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChipClick = (query) => {
    setInput(query);
    handleSend(query);
  };

  const handleSend = async (customInput) => {
    const messageToSend = customInput || input;
    if (messageToSend.trim()) {
      const userMessage = { type: 'user', content: messageToSend, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Add error logging
        console.log('Sending query:', messageToSend);
        
        const response = await fetch(`https://sincher-ai-server.onrender.com/api/chat?query=${encodeURIComponent(messageToSend)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received response:', data); // Add response logging

        if (!data.response) {
          throw new Error('No response data received');
        }

        setTimeout(() => {
          setMessages(prev => [...prev, { 
            type: 'assistant', 
            content: data.response,
            timestamp: new Date().toISOString()
          }]);
          setIsLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Full error details:', error);
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            type: 'assistant', 
            content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
            timestamp: new Date().toISOString()
          }]);
          setIsLoading(false);
        }, 500);
      }

      setInput('');
    }
  };

  // Format timestamp for messages
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ 
      width: '100vw',  // Changed from maxWidth to width
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f8f9fa',
      overflow: 'hidden'
      // Removed borderRadius and boxShadow
    }}>
      <ChatHeader>
        <AnimatedAvatar sx={{ mr: 2 }}>ES</AnimatedAvatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Er Sin Cher
          </Typography>
          <Typography variant="body2">
            Ask me anything about Sin Cher's experience & projects
          </Typography>
        </Box>
      </ChatHeader>

      <Paper sx={{ 
        flex: 1,
        overflow: 'auto', 
        p: 3, 
        bgcolor: '#f8f9fa',
        boxShadow: 'none',
        backgroundImage: 'radial-gradient(#e1e1e1 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}>
        {messages.length === 0 ? (
          <Fade in={true} timeout={1000}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              p: 3,
              opacity: 0.8
            }}>
              <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: '#1976d2' }}>
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Hello there!
              </Typography>
              <Typography variant="body1" textAlign="center" color="text.secondary">
                I'm Er Sin Cher's virtual assistant. Ask me anything about his qualifications, 
                experience, or projects using the suggestions below or type your own question.
              </Typography>
            </Box>
          </Fade>
        ) : (
          messages.map((message, index) => (
            <Zoom in={true} key={index} style={{ transitionDelay: '50ms' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.type === 'user' ? 'flex-end' : 'flex-start',
                  mb: 3,
                  maxWidth: '100%'
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-end',
                  mb: 0.5
                }}>
                  {message.type === 'assistant' && (
                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#1976d2' }}>
                      ES
                    </Avatar>
                  )}
                  <StyledMessageBubble type={message.type}>
                    <Typography sx={{ lineHeight: 1.6 }}>{message.content}</Typography>
                  </StyledMessageBubble>
                  {message.type === 'user' && (
                    <Avatar sx={{ width: 32, height: 32, ml: 1, bgcolor: '#9c27b0' }}>
                      YOU
                    </Avatar>
                  )}
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 0.5, 
                    ml: message.type === 'user' ? 'auto' : '40px',
                    mr: message.type === 'user' ? '40px' : 'auto',
                    color: 'text.secondary',
                    fontSize: '0.7rem'
                  }}
                >
                  {formatTime(message.timestamp)}
                </Typography>
              </Box>
            </Zoom>
          ))
        )}
        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#1976d2' }}>
              ES
            </Avatar>
            <Paper sx={{ 
              p: 2, 
              borderRadius: '18px 18px 18px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={16} sx={{ mr: 2 }} />
                <Typography>Thinking...</Typography>
              </Box>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      <Stack direction="row" spacing={1} sx={{ 
        p: 2, 
        flexWrap: 'wrap', 
        gap: 1,
        justifyContent: 'center',
        background: 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(248,249,250,1) 100%)'
      }}>
        {suggestionChips.map((chip, index) => (
          <SuggestionChip
            key={index}
            label={chip.label}
            icon={chip.icon}
            onClick={() => handleChipClick(chip.query)}
            clickable
            color="primary"
            variant="outlined"
            disabled={isLoading}
            sx={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </Stack>

      <InputWrapper>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about Er Sin Cher..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              backgroundColor: '#f8f9fa',
              '&.Mui-focused': {
                boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)'
              }
            }
          }}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={() => handleSend()}
          disabled={isLoading}
          sx={{
            borderRadius: '24px',
            minWidth: '100px',
            background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
              boxShadow: '0 4px 8px rgba(33, 150, 243, 0.3)'
            }
          }}
        >
          Send
        </Button>
      </InputWrapper>
    </Box>
  );
};

export default ChatInterface;