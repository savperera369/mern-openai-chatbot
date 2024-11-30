import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Box, Avatar, Typography, Button, IconButton } from '@mui/material';
import { red } from '@mui/material/colors';
import { useAuth } from '../context/AuthContext';
import ChatItem from '../components/chat/ChatItem';
import { IoMdSend } from 'react-icons/io';
import { deleteAllUserChats, getAllUserChats, sendChatRequest } from '../helpers/api-communicator';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type Message = {
  role: string;
  content: string;
}

// ref will give you a reference to this input element from the dom

const Chat = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    // clear input
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }

    const newMessage: Message = { role: 'user', content};
    setChatMessages((prev) => [...prev, newMessage]);

    // send api request with new message and receive response
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
  };

  const handleClearConversation = async () => {
    try {
      toast.loading("Deleting chats...", {id: "deletechats" });
      const { chats } = await deleteAllUserChats();
      setChatMessages(chats);
      toast.success("Deleted all chats", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Error deleting chats", { id: "deletechats"});
    }
  }

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading chats...", { id: "loadchats" });
      const getChats = async () => {
        await getAllUserChats()
        .then(({ chats }) => {
          setChatMessages([...chats])
          toast.success("Successfully loaded chats", { id: "loadchats" });
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error loading chats", { id: "loadchats" });
        });
      };

      getChats();
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      return navigate("/login");
    }
  }, [auth])

  return (
    <Box sx={{
      display: 'flex',
      flex: 1,
      width: '100%',
      height: '100%',
      mt: 3,
      gap: 3
    }}>
      <Box sx={{
        display: { md: 'flex', xs: 'none', sm: 'none' },
        flex: 0.2,
        flexDirection: 'column'
      }}>
        <Box sx={{
          display: 'flex',
          width: '100%',
          height: '60vh',
          bgcolor: 'rgb(17,29,39)',
          borderRadius: 5,
          flexDirection: 'column',
          mx: 3,
        }}>
          <Avatar sx={{ mx: 'auto', my: 2, bgcolor: 'white', color: 'black', fontWeight: 700}}>
            {auth?.user?.name[0]}
          </Avatar>
          <Typography sx={{
            mx: 'auto',
            fontFamily: 'work sans',
          }}>
            You are talking to a ChatBOT
          </Typography>
          <Typography sx={{
            mx: 'auto',
            fontFamily: 'work sans',
            my: 4,
            p: 3
          }}>
            You can ask some questions related to knowledge, business, advice and education. Avoid sharing personal information.
          </Typography>
          <Button sx={{
            width: '200px',
            my: 'auto',
            color: 'white',
            fontWeight: '700',
            borderRadius: 3,
            mx: 'auto',
            bgcolor: red[300],
            ':hover': {
              bgcolor: red.A400,
            }
          }}
          onClick={handleClearConversation}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flex: { md: 0.8, sm: 1, xs: 1}, flexDirection: 'column', px: 3 }}>
        <Typography sx={{
          fontSize: "40px",
          color: 'white',
          mx: 'auto',
          mb: 2, 
          fontWeight: '600'
        }}>
          Model - GPT 3.5 Turbo
        </Typography>
        <Box sx={{
          width: '100%',
          height: '60vh',
          borderRadius: 3,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'scroll',
          overflowX: 'hidden',
          overflowY: 'auto',
          scrollBehavior: 'smooth'
        }}>
          {chatMessages.map((chat, index) => (
            <ChatItem key={index} content={chat.content} role={chat.role} />
          ))}
        </Box>
        <div style={{
          width: '100%',
          padding: '20px',
          borderRadius: 8,
          backgroundColor: 'rgb(17, 27, 39)',
          display: 'flex',
          margin: 'auto'
        }}>
          <input type="text" style={{ 
            width: '100%', 
            backgroundColor: 'transparent', 
            padding: '10px',
            border: 'none',
            outline: 'none',
            color: 'white',
            fontSize: '20px'
          }}
          ref={inputRef}
          />
          <IconButton sx={{
            ml: 'auto',
            color: 'white'
          }}
            onClick={handleSubmit}
          >
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  )
}

export default Chat
