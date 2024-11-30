import React from 'react'
import { Box } from '@mui/material';
import robotImg from '../assets/robot.png';
import openAiImg from '../assets/openai.png';
import chatImg from '../assets/chat.png';
import TypeAnim from '../components/typer/TypeAnim';

const Home = () => {
  return (
    <Box
      width={'100%'}
      height={'100%'}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          mx: 'auto',
          mt: 3
        }}
      >
        <Box>
          <TypeAnim />
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { md: 'row', xs: 'column', sm: 'column' },
            gap: 5,
            my: 10
          }}
        >
          <img src={robotImg} alt="robotImg" style={{ width: '200px', margin: 'auto' }} />
          <img src={openAiImg} className="image-inverted rotate" alt="openaiimg" style={{ width: '200px', margin: 'auto' }} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            mx: 'auto'
          }}
        >
          <img src={chatImg} alt="chat" style={{ display:'flex', margin: 'auto', width: '60%', borderRadius: '20px', boxShadow: "-5px -5px 105px #64f3d5", marginTop: 20, marginBottom: 20 }}/>
        </Box>
      </Box>
    </Box>
  )
}

export default Home
