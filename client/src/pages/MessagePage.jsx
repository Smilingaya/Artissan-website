import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar, 
  Paper, 
  List, 
  ListItem, 
  Divider, 
  Badge, 
  CircularProgress, 
  AppBar, 
  Toolbar
} from '@mui/material';
import { 
  Send, 
  AttachFile, 
  Search, 
  MoreVert, 
  Mic, 
  EmojiEmotions,
  ArrowBack
} from '@mui/icons-material';

// Mock data for users and conversations
const mockUsers = [
  { id: 1, name: 'John Doe', avatar: '/api/placeholder/40/40', status: 'online', lastSeen: 'now', unread: 3 },
  { id: 2, name: 'Jane Smith', avatar: '/api/placeholder/40/40', status: 'online', lastSeen: '5m ago', unread: 0 },
  { id: 3, name: 'Alex Johnson', avatar: '/api/placeholder/40/40', status: 'offline', lastSeen: '1h ago', unread: 12 },
  { id: 4, name: 'Sarah Williams', avatar: '/api/placeholder/40/40', status: 'offline', lastSeen: 'yesterday', unread: 0 },
  { id: 5, name: 'Michael Brown', avatar: '/api/placeholder/40/40', status: 'online', lastSeen: 'now', unread: 1 },
  { id: 6, name: 'Lisa Anderson', avatar: '/api/placeholder/40/40', status: 'offline', lastSeen: '3d ago', unread: 0 },
];

const mockMessages = [
  { id: 1, senderId: 2, text: 'Hey, how are you doing?', timestamp: '9:30 AM', read: true },
  { id: 2, senderId: 1, text: 'I\'m good thanks! Just working on that project we discussed.', timestamp: '9:32 AM', read: true },
  { id: 3, senderId: 2, text: 'Great! How is it coming along?', timestamp: '9:35 AM', read: true },
  { id: 4, senderId: 1, text: 'Making good progress. I should be able to share a draft by tomorrow.', timestamp: '9:40 AM', read: true },
  { id: 5, senderId: 2, text: 'That sounds perfect. Looking forward to seeing it!', timestamp: '9:42 AM', read: false },
  { id: 6, senderId: 2, text: 'Also, don\'t forget about the meeting at 2pm today.', timestamp: '10:15 AM', read: false },
];

// Simulate fetching data
const useSimulatedFetch = (data, delay = 1000) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, delay));
        setResult(data);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data, delay]);

  return { loading, result, error };
};

const MessagePage = () => {
  const [currentChat, setCurrentChat] = useState(2);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileViewVisible, setIsMobileViewVisible] = useState(false);

  // Simulate fetching users
  const { 
    loading: loadingUsers, 
    result: fetchedUsers 
  } = useSimulatedFetch(mockUsers, 1500);

  // Simulate fetching messages
  const { 
    loading: loadingMessages, 
    result: fetchedMessages 
  } = useSimulatedFetch(mockMessages, 2000);

  useEffect(() => {
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
  }, [fetchedUsers]);

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  const handleSendMessage = () => {
    if (messageText.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      senderId: 1, // Current user
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChatUser = users.find(user => user.id === currentChat) || {};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '350px 1fr' },
      gridTemplateRows: '1fr',
      overflow: 'hidden',
      bgcolor: '#f5f5f5'
    }}>
      {/* Sidebar - User List */}
      <Box sx={{
        display: { xs: isMobileViewVisible ? 'none' : 'flex', md: 'flex' },
        flexDirection: 'column',
        borderRight: '1px solid #e0e0e0',
        bgcolor: '#ffffff'
      }}>
        {/* Sidebar Header */}
        <Box sx={{
          padding: '15px',
          borderBottom: '1px solid #e0e0e0',
          bgcolor: '#f8f8f8',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Avatar sx={{ width: 40, height: 40 }} src="/api/placeholder/40/40" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Messages</Typography>
          <IconButton>
            <MoreVert />
          </IconButton>
        </Box>

        {/* Search Box */}
        <Box sx={{ padding: '15px', borderBottom: '1px solid #e0e0e0' }}>
          <TextField
            fullWidth
            placeholder="Search conversations"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: '#757575', mr: 1 }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                bgcolor: '#f0f2f5',
              },
            }}
          />
        </Box>

        {/* User List */}
        <List sx={{ 
          overflowY: 'auto', 
          flex: 1,
          padding: 0,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdbdbd',
            borderRadius: '4px',
          },
        }}>
          {loadingUsers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <CircularProgress />
            </Box>
          ) : (
            filteredUsers.map((user) => (
              <React.Fragment key={user.id}>
                <ListItem 
                  button 
                  onClick={() => {
                    setCurrentChat(user.id);
                    setIsMobileViewVisible(true);
                  }}
                  sx={{
                    padding: '12px 15px',
                    cursor: 'pointer',
                    bgcolor: currentChat === user.id ? '#f0f2f5' : 'transparent',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                    },
                  }}
                >
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gridTemplateRows: 'auto auto',
                    gap: '5px',
                    width: '100%',
                    alignItems: 'center',
                  }}>
                    <Badge 
                      color={user.status === 'online' ? 'success' : 'error'} 
                      variant="dot"
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      sx={{ 
                        gridColumn: '1',
                        gridRow: '1 / span 2',
                        marginRight: '12px' 
                      }}
                    >
                      <Avatar src={user.avatar} />
                    </Badge>
                    
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: user.unread > 0 ? 'bold' : 'normal',
                        gridColumn: '2',
                        gridRow: '1',
                      }}
                    >
                      {user.name}
                    </Typography>
                    
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#757575',
                        gridColumn: '2',
                        gridRow: '2',
                      }}
                    >
                      {user.lastSeen}
                    </Typography>
                    
                    {user.unread > 0 && (
                      <Badge 
                        badgeContent={user.unread} 
                        color="primary"
                        sx={{ 
                          gridColumn: '3',
                          gridRow: '1 / span 2',
                        }}
                      />
                    )}
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>
      </Box>

      {/* Chat Area */}
      <Box sx={{
        display: { xs: isMobileViewVisible ? 'grid' : 'none', md: 'grid' },
        gridTemplateRows: 'auto 1fr auto',
        height: '100%',
        bgcolor: '#f0f2f5',
      }}>
        {/* Chat Header */}
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'auto 1fr auto', md: '1fr auto' },
            padding: '8px 16px',
            minHeight: '64px',
          }}>
            {/* Back button (only on mobile) */}
            <IconButton 
              edge="start" 
              sx={{ display: { xs: 'block', md: 'none' }, mr: 1 }}
              onClick={() => setIsMobileViewVisible(false)}
            >
              <ArrowBack />
            </IconButton>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '12px' 
            }}>
              <Badge 
                color={currentChatUser.status === 'online' ? 'success' : 'error'} 
                variant="dot"
                overlap="circular"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
              >
                <Avatar src={currentChatUser.avatar} />
              </Badge>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {currentChatUser.name || 'Select a conversation'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#757575' }}>
                  {currentChatUser.status === 'online' ? 'Online' : `Last seen ${currentChatUser.lastSeen}`}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex' }}>
              <IconButton>
                <Search />
              </IconButton>
              <IconButton>
                <MoreVert />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Messages */}
        <Box sx={{
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#e5ded8',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url("/api/placeholder/600/600")',
          backgroundBlendMode: 'overlay',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdbdbd',
            borderRadius: '4px',
          },
        }}>
          {loadingMessages ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.senderId === 1;
              return (
                <Box 
                  key={message.id} 
                  sx={{
                    alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    marginBottom: '10px',
                  }}
                >
                  <Paper 
                    elevation={1} 
                    sx={{
                      padding: '10px 15px',
                      borderRadius: '15px',
                      bgcolor: isCurrentUser ? '#dcf8c6' : '#ffffff',
                      position: 'relative',
                      borderTopRightRadius: isCurrentUser ? '5px' : '15px',
                      borderTopLeftRadius: isCurrentUser ? '15px' : '5px',
                    }}
                  >
                    <Typography variant="body1">{message.text}</Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#757575', 
                        display: 'block', 
                        textAlign: 'right',
                        marginTop: '5px',
                        fontSize: '0.7rem'
                      }}
                    >
                      {message.timestamp}
                    </Typography>
                  </Paper>
                </Box>
              );
            })
          )}
        </Box>

        {/* Input Area */}
        <Box sx={{
          padding: '15px',
          borderTop: '1px solid #e0e0e0',
          bgcolor: '#f0f2f5',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '10px',
          alignItems: 'center',
        }}>
          <Box>
            <IconButton>
              <EmojiEmotions />
            </IconButton>
            <IconButton>
              <AttachFile />
            </IconButton>
          </Box>

          <TextField
            placeholder="Type a message"
            variant="outlined"
            fullWidth
            size="small"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                bgcolor: '#ffffff',
              }
            }}
          />

          <Box>
            {messageText.trim() === '' ? (
              <IconButton>
                <Mic />
              </IconButton>
            ) : (
              <IconButton color="primary" onClick={handleSendMessage}>
                <Send />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MessagePage;