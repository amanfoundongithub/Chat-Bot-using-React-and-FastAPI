import React, { useEffect, useState } from 'react';

import { Backdrop, Box, CircularProgress, Divider, Fab, Grid, Typography } from '@mui/material';

import TopBar from '../components/TopBar';
import ChatBox from '../chat/ChatBox';
import CreateNewChatModal from '../chat/CreateNewChatModal';
import ChatWindow from '../chat/ChatWindow';
import axios from 'axios';


const ChatPage = () => {

    // We really want to use the list of the history of chats
    
    useEffect(() => {
        const id = window.localStorage.getItem("id")
        axios.get("http://localhost:8000/chat/" + id + "/all")
        .then((res) => {
            if(res.status == 200) {
                setListOfChats(res.data) 
            } else {
                throw Error();
            }
        })
    }, [])

    const [list_of_chats, setListOfChats] = useState([])

    // Variable to store if the created or not
    const [create, setCreate] = useState(false)

    // Variable that stores the index from the list
    const [selectedIdx, setSelectedIdx] = useState(-1)
    const [selectedDetails, setSelectedDetails] = useState({})

    const Select_Chat = (idx) => {
        setSelectedIdx(idx) 
        setSelectedDetails(list_of_chats[idx])
    }

    return (
        <Box
            height="90vh"
            width="99vw"
        >
            {
                create == true ?
                    <Box>
                        <Backdrop
                            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 , display : 'flex', flexDirection : 'column'})}
                            open={true}
                            
                        >
                            
                            <CircularProgress color="inherit" />
                            <Typography>
                                Please wait while your chat is being created... 
                                Do not close or restart the window...
                            </Typography>
                        </Backdrop>
                    </Box>
                    :
                    <Box>
                        <TopBar />

                        <Grid container width="100%" height="100%" direction="row">

                            <Grid item size={3} marginLeft={2}>

                                <Typography variant="h4" marginBottom={3}
                                marginTop = {2}
                                sx = {{
                                    display : 'flex',
                                    justifyContent : 'center'
                                }}>
                                    My Recent Chats
                                </Typography>
                                {
                                    list_of_chats.length == 0 ?
                                        <Box sx={{
                                            height: '60%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Typography variant="h6">
                                                No Chats Available!
                                            </Typography>
                                            <Typography variant="subtitle2">
                                                Please start a new chat to begin your conversation
                                            </Typography>
                                        </Box>
                                        :
                                        list_of_chats.map((e, i) => {
                                            return <ChatBox 
                                            details= {e} 
                                            index  = {i}
                                            action = {Select_Chat}/>
                                        })
                                }


                                <Box sx={{
                                    position: 'fixed',
                                    bottom: '2rem',

                                    display: 'flex',
                                    justifyContent: 'flex-end', // Push items to the right
                                    marginRight: '3px'
                                }}>
                                    <CreateNewChatModal 
                                    create = {create} 
                                    setCreate = {setCreate}
                                    list_of_chats = {list_of_chats} 
                                    setListOfChats = {setListOfChats}/>
                                </Box>



                            </Grid>

                            <Divider orientation="vertical" flexItem />

                            <Grid item size={8}>
                                {
                                    "title" in selectedDetails ? 
                                    <Box sx = {{
                                        height : '100%',
                                        width : '100%'
                                    }}>
                                        <ChatWindow 
                                        details = {selectedDetails}/>
                                    </Box>
                                    
                                    :
                                    <Box sx = {{
                                        display : 'flex',
                                        flexDirection  :'column',

                                        justifyContent : 'center',
                                        alignItems : 'center',


                                    }}>
                                        <Typography variant = "h5">
                                            No Chat Selected
                                        </Typography>

                                        <Typography variant = "subtitle1">
                                            Select or create a new chat to start chatting with the agent!
                                        </Typography>

                                    </Box>

                                }
                            </Grid>
                        </Grid>
                    </Box>
            }




        </Box>
    )
}

export default ChatPage
