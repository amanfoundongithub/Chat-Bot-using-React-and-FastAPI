import { Box, Button, Grid, IconButton, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


const ChatBox = (props) => {

    // Chat details
    const details = props.details

    // Action to be taken
    const action = props.action 

    // Index 
    const index = props.index 

    // Display or hide
    const [selected, setSelected] = useState(false);

    const Select_Box   = () => {
        setSelected(true) 
    }

    const Unselect_Box = () => {
        setSelected(false) 
    }

    const Handle_Click = () => {
        action(index) 
    }


    // Return the box
    return (
        <Box marginBottom={2} width="95%" sx={{
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'scale(1.05)',
                cursor: 'pointer',
                backgroundColor: "lightgreen"
            },
        }}
            onMouseOver={Select_Box}
            onMouseOut={Unselect_Box}
        >
            <Paper elevation="4" sx={{
                backgroundColor: 'transparent'
            }}>
                <Grid container direction="row">
                    <Grid item size = {10}>
                        <Typography variant="h6" marginLeft={2}>
                            {details.title}
                        </Typography>

                        <Typography variant="subtitle1" marginLeft={2}>
                            {new Date(details.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}
                        </Typography>
                    </Grid>

                    <Grid item size = {2} sx = {{
                        display : 'flex',
                        alignItems : 'center',
                        justifyContent : 'center',
                    }}>
                        
                        {
                            selected ? 
                            <IconButton color = "secondary" onClick = {Handle_Click}>
                                <ChevronRightIcon />
                            </IconButton>
                            :
                            <></>
                        }
                        
                    </Grid>
                </Grid>



            </Paper>
        </Box>
    )
}

export default ChatBox