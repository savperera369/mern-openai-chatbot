import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import openAIPng from '../../assets/openai.png';
import { useAuth } from '../../context/AuthContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function extractCodeFromString(message: string) {
    if (message.includes("```")) {
        const blocks = message.split("```");
        return blocks;
    }
}

function isCodeBlock(str: string) {
    if (
        str.includes("=") ||
        str.includes(";") ||
        str.includes("[") ||
        str.includes("]") ||
        str.includes("{") ||
        str.includes("}") ||
        str.includes("#") ||
        str.includes("//")
    ) {
        return true;
    }
    return false;
}

const ChatItem = ({ content, role }: { content: string, role: string }) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = useAuth();

  return role === "assistant" ? (
    <Box sx={{
        display: 'flex',
        p: 2,
        bgcolor: '#004d5612',
        my: 2,
        gap: 2
    }}>
        <Avatar sx={{
            ml: "0",
        }}>
            <img src={openAIPng} alt="openaiimg" width={'30px'}/>
        </Avatar>
        <Box>
            {!messageBlocks ? (<Typography fontSize={'20px'}>{content}</Typography>) : null}
            {messageBlocks && messageBlocks.length ? (
                messageBlocks?.map((block, index) => {
                    if (isCodeBlock(block)) {
                        return (
                            <SyntaxHighlighter key={index} style={coldarkDark} language="javascript">
                                {block}
                            </SyntaxHighlighter>
                        );
                    } else {
                        return (<Typography key={index} fontSize={'20px'}>{block}</Typography>);
                    }
                })
            ) : null}
        </Box>
    </Box>
  ) : (
    <Box sx={{
        display: 'flex',
        p: 2,
        bgcolor: '#004d56',
        gap: 2
    }}>
        <Avatar sx={{
            ml: "0",
            bgcolor: "black",
            color: "white"
        }}>
            {auth?.user?.name[0]}
        </Avatar>
        <Box>
            <Typography fontSize={'20px'}>
                {content}
            </Typography>
        </Box>
    </Box>
  )
}

export default ChatItem
