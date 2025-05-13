import { Box, Paper, Typography } from "@mui/material"
import React from "react"
import ReactMarkDown from 'react-markdown'


const ChatMessage = (props) => {

    // Content
    const message_content = props.content

    // Message
    const message = message_content.content 

    // Is a bot?
    const is_a_user = message_content.is_user 

    return (
        <Box my={1} px={2}>
            <Paper
                elevation={3}
                sx={{
                    maxWidth: "100%",
                    padding: 1.5,
                    backgroundColor: is_a_user ? "#ffe0e0" : "#fff9c4",
                    borderRadius: 2,
                    borderTopRightRadius: is_a_user ? 0 : 16,
                    borderTopLeftRadius: is_a_user ? 16 : 0,
                }}
            >
                {
                    is_a_user ? 
                    <Typography variant="body1" color="text.primary">
                        {message}
                    </Typography>
                    :
                    <ReactMarkDown>
                        {message} 
                    </ReactMarkDown>

                }
                
            </Paper>
        </Box>
    );
}

export default ChatMessage