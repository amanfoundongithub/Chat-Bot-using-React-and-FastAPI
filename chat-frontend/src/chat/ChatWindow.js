import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import SendIcon from '@mui/icons-material/Send';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const ChatWindow = ({ details: chat_details }) => {
  const [history, setHistory] = useState([]);
  const [content_loaded, setContentLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [llm_response, setLLMResponse] = useState("");

  const [title, setTitle] = useState("");
  const [title_candidate, setTitleCandidate] = useState("");
  const [editTitle, setEditTitle] = useState(false);
  const [titleError, setTitleError] = useState(false);

  const [titleUpdateSuccess, setTitleUpdateSuccess] = useState(false);
  const [titleUpdateError, setTitleUpdateError] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Load chat details + history
  useEffect(() => {
    setTitle(chat_details.title);
    setTitleCandidate(chat_details.title);

    axios
      .get(`http://localhost:8000/chat/${chat_details.id}/message/all`)
      .then((res) => {
        if (res.status === 200) {
          setHistory(res.data.messages);
          setContentLoaded(false);
          const t = setTimeout(() => setContentLoaded(true), 1000);
          return () => clearTimeout(t);
        }
        throw new Error();
      })
      .catch(console.log);
  }, [chat_details]);

  const Handle_Title_Change = () => {
    if (!editTitle) {
      // Enter edit mode
      setEditTitle(true);
      setTitleError(false);
    } else {
      // Trying to save
      if (!title_candidate.trim()) {
        setTitleError(true);
        return;
      }
      axios
        .put(`http://localhost:8000/chat/${chat_details.id}/edit/name`, {
          title: title_candidate.trim()
        })
        .then((res) => {
          if (res.status === 200) {
            setTitle(title_candidate.trim());
            setEditTitle(false);
            setTitleUpdateSuccess(true);
          } else {
            throw new Error();
          }
        })
        .catch((err) => {
          console.error(err);
          setTitleUpdateError(true);
        })
        .finally(() => {
          setTitleError(false);
        });
    }
  };

  const Handle_Cancel_Change = () => {
    setEditTitle(false);
    setTitleCandidate(title);
    setTitleError(false);
  };

  const Send_Message = () => {
    const newUserMessage = {
      content: message,
      is_user: true,
      date: Date.now().toString()
    };
    const placeholderLLM = {
      content: "",
      is_user: false,
      date: Date.now().toString()
    };
    setHistory((prev) => [...prev, newUserMessage, placeholderLLM]);
    setLLMResponse("");
    setGenerating(true);

    axios
      .post(`http://localhost:8000/chat/${chat_details.id}/message/send`, {
        is_user: true,
        content: message
      })
      .catch(console.log);

    fetch("http://localhost:8000/llm/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message })
    })
      .then((res) => {
        if (res.status !== 200) {
          setHistory((h) => h.slice(0, h.length - 1));
          throw new Error();
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        const chunks = [];
        function read() {
          reader.read().then(({ done, value }) => {
            if (done) {
              const final = chunks.join("");
              setGenerating(false);
              axios
                .post(`http://localhost:8000/chat/${chat_details.id}/message/send`, {
                  is_user: false,
                  content: final
                })
                .catch(console.log);
              return;
            }
            const str = decoder.decode(value, { stream: true });
            chunks.push(str);
            setLLMResponse((prev) => {
              const nc = prev + str;
              setHistory((h) => {
                const copy = [...h];
                copy[copy.length - 1] = { ...copy[copy.length - 1], content: nc };
                return copy;
              });
              return nc;
            });
            read();
          });
        }
        read();
      })
      .catch((err) => {
        console.error(err);
        setShowError(true);
        setGenerating(false);
      });

    setMessage("");
  };

  return (
    <Box sx={{
      display: "flex", flexDirection: "column", height: "100%", width: "100%",
      marginTop : 10,
      marginLeft : 1,
    }}>
      {!content_loaded ? (
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress color="info" />
          <Typography sx={{ ml: 2 }}>Loading chats…</Typography>
        </Box>
      ) : (
        <>
          <Box
         
          >
            <Box sx={{ display: "flex" }}>
              {editTitle ? (
                <TextField
                  value={title_candidate}
                  onChange={(e) => {
                    setTitleCandidate(e.target.value);
                    if (titleError && e.target.value.trim()) {
                      setTitleError(false);
                    }
                  }}
                  variant="outlined"
                  error={titleError}
                  helperText={titleError ? "Chat title cannot be empty" : ""}
                />
              ) : (
                <Typography variant="h4">{title}</Typography>
              )}
              <IconButton onClick={Handle_Title_Change}>
                {editTitle ? <SaveIcon /> : <EditIcon />}
              </IconButton>
              {editTitle && <IconButton onClick={Handle_Cancel_Change}><CloseIcon /></IconButton>}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {history.map((e, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: e.is_user ? "flex-end" : "flex-start",
                  mb: 1
                }}
              >
                <ChatMessage content={e} />
              </Box>
            ))}

            <div ref={messagesEndRef} />
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #ddd",
              display: "flex",
              alignItems: "center"
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !generating && Send_Message()}
            />
            <IconButton onClick={Send_Message} disabled={generating} sx={{ ml: 1 }}>
              {generating ? <PauseCircleIcon /> : <SendIcon />}
            </IconButton>
          </Box>
        </>
      )}

      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: "100%" }}>
          Error generating response. Please try again later.
        </Alert>
      </Snackbar>

      <Snackbar
        open={titleUpdateSuccess}
        autoHideDuration={3000}
        onClose={() => setTitleUpdateSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setTitleUpdateSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Chat title updated successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={titleUpdateError}
        autoHideDuration={3000}
        onClose={() => setTitleUpdateError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setTitleUpdateError(false)} severity="error" sx={{ width: "100%" }}>
          Failed to update chat title.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatWindow;
