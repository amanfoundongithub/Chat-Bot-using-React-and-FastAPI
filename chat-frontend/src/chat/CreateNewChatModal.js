import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { Fab, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function CreateNewChatModal(props) {
  const [open, setOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState(false);

  const id = window.localStorage.getItem("id") 

  const { create, setCreate, list_of_chats, setListOfChats } = props;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(false);
    setName('');
  };

  // When user clicks the "Create" button under the form
  const handleCreateClick = () => {
    if (!name.trim()) {
      setError(true);
      return;
    }
    // open confirmation dialog
    setConfirmOpen(true);
  };

  // Actually call API after confirmation
  const handleConfirm = async () => {
    setConfirmOpen(false);
    setCreate(true);
    setOpen(false);

    try {
      const response = await axios.post('http://localhost:8000/chat/create', {
        title: name.trim(),
        user_id : id, 
      });
      const newChat = response.data;
      setListOfChats([
        ...list_of_chats,
        {
          id: newChat.id,
          title: newChat.title,
          created_at: newChat.created_at,
        },
      ]);
    } catch (err) {
      console.error('Failed to create chat:', err);
    } finally {
      setCreate(false);
      setName('');
      setError(false);
    }
  };

  return (
    <div>
      <Fab color="primary" aria-label="add" onClick={handleOpen}>
        <AddIcon />
      </Fab>

      {/* New Chat Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            New Chat
          </Typography>

          <Typography sx={{ mt: 1 }}>
            To add a new chat, enter the name of the chat below:
          </Typography>

          <TextField
            id="new-chat-name"
            label="Name Of Chat"
            variant="standard"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(false);
            }}
            error={error && !name.trim()}
            helperText={error && !name.trim() ? 'Chat name cannot be empty' : ''}
            sx={{ mt: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'end', mt: 4 }} gap={2}>
            <Button variant="contained" color="error" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              variant="outlined"
              color="warning"
              onClick={handleCreateClick}
              disabled={!name.trim()}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          Are you sure you want to create this chat?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Chat name: <strong>{name.trim()}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary" autoFocus>
            Yes, Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateNewChatModal;
