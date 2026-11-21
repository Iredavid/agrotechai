import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Chip,
  useTheme,
  keyframes,
} from "@mui/material";
import SmartToy from "@mui/icons-material/SmartToy";
import Send from "@mui/icons-material/Send";
import Person from "@mui/icons-material/Person";
import { useAuth } from "../context/AuthContext";
import { initChat } from "../components/layout/AppLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Removes artifacts models sometimes leak into replies
const cleanReply = (text: string): string =>
  text
    .replace(/<think>[\s\S]*?<\/think>/gi, "") // reasoning blocks
    .replace(/【[^】]*】/g, "") // citation markers like 【1†source】
    .replace(/[\u202f\u00a0]/g, " ") // odd non-breaking spaces
    .replace(/[\u2010\u2011\u2012]/g, "-") // odd hyphens
    .replace(/[ \t]+\n/g, "\n") // trailing spaces
    .replace(/\n{3,}/g, "\n\n") // runaway blank lines
    .trim();

const markdownSx = {
  fontSize: "1rem",
  lineHeight: 1.65,
  wordBreak: "break-word",
  "& > *:first-child": { mt: 0 },
  "& > *:last-child": { mb: 0 },
  "& p": { m: 0, mb: 1.5 },
  "& strong": { fontWeight: 700 },
  "& h1, & h2, & h3, & h4": {
    fontSize: "1.05rem",
    fontWeight: 700,
    mt: 2,
    mb: 0.75,
  },
  "& ul, & ol": { pl: 3, my: 1 },
  "& li": { mb: 0.5 },
  "& li > p": { mb: 0.5 },
  "& blockquote": {
    m: 0,
    my: 1.5,
    pl: 2,
    borderLeft: "3px solid",
    borderColor: "primary.main",
    color: "text.secondary",
  },
  "& hr": { border: 0, borderTop: "1px solid", borderColor: "divider", my: 2 },
  "& code": {
    fontFamily: "monospace",
    fontSize: "0.875em",
    bgcolor: "action.hover",
    px: 0.75,
    py: 0.25,
    borderRadius: "4px",
  },
  "& pre": {
    bgcolor: "action.hover",
    p: 1.5,
    borderRadius: "8px",
    overflowX: "auto",
    "& code": { bgcolor: "transparent", p: 0 },
  },
  "& table": { borderCollapse: "collapse", width: "100%", fontSize: "0.9rem" },
  "& th, & td": {
    border: "1px solid",
    borderColor: "divider",
    px: 1.5,
    py: 0.75,
    textAlign: "left",
  },
  "& th": { bgcolor: "action.hover", fontWeight: 600 },
  "& a": { color: "primary.main", textDecoration: "underline" },
};

type Message = { sender: "ai" | "user"; text: string };

class SessionExpiredError extends Error {}

// Vite: VITE_API_BASE_URL in .env | CRA: use process.env.REACT_APP_API_BASE_URL instead
const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// Example conversation shown until the user sends their first message
const DEMO_MESSAGES: Message[] = [
  {
    sender: "ai",
    text: "Hello John! I am your AgroTech AI Assistant. I have analyzed your farm data. How can I help you today?",
  },
  {
    sender: "user",
    text: "My maize leaves are turning yellow at the edges. What should I do?",
  },
  {
    sender: "ai",
    text: "Yellowing at the leaf edges in maize, especially on older leaves, is typically a sign of Potassium deficiency. Based on your recent soil profile, your Potassium levels are low (30%). I recommend applying a muriate of potash (MOP) fertilizer or a balanced NPK fertilizer with higher potassium content. Would you like me to calculate the exact dosage for your 2-hectare plot?",
  },
];

const SUGGESTIONS = [
  "Why are my maize leaves turning yellow?",
  "Which fertilizer suits my soil?",
  "How do I control fall armyworm?",
  "When is the best time to plant tomatoes?",
];

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const sendChatMessage = async (
  message: string,
  sessionId: string,
): Promise<string> => {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ session_id: sessionId, message }),
  });
  if (res.status === 404) throw new SessionExpiredError();
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  const data = await res.json();
  const reply = data.reply ?? data.response ?? data.message;
  if (!reply) throw new Error("Empty response from server");
  return reply;
};

const MessageBubble: React.FC<{ msg: Message; animate?: boolean }> = ({
  msg,
  animate = true,
}) => (
  <Box
    sx={{
      display: "flex",
      gap: 2,
      flexDirection: msg.sender === "user" ? "row-reverse" : "row",
      animation: animate ? `${fadeInUp} 0.3s ease` : "none",
    }}
  >
    <Avatar
      sx={{
        bgcolor: msg.sender === "ai" ? "primary.main" : "secondary.main",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}
    >
      {msg.sender === "ai" ? <SmartToy /> : <Person />}
    </Avatar>
    <Paper
      elevation={0}
      sx={{
        p: 2,
        maxWidth: "75%",
        borderRadius: "12px",
        bgcolor: msg.sender === "user" ? "primary.main" : "background.paper",
        color: msg.sender === "user" ? "white" : "text.primary",
        border: msg.sender === "ai" ? "1px solid" : "none",
        borderColor: "divider",
        borderTopLeftRadius: msg.sender === "ai" ? 0 : "12px",
        borderTopRightRadius: msg.sender === "user" ? 0 : "12px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {msg.sender === "ai" ? (
        <Box sx={markdownSx}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
              table: ({ node, ...props }) => (
                <Box sx={{ overflowX: "auto", my: 1.5 }}>
                  <table {...props} />
                </Box>
              ),
            }}
          >
            {cleanReply(msg.text)}
          </ReactMarkdown>
        </Box>
      ) : (
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {msg.text}
        </Typography>
      )}
    </Paper>
  </Box>
);

const TypingIndicator: React.FC = () => (
  <Box sx={{ display: "flex", gap: 2, animation: `${fadeInUp} 0.3s ease` }}>
    <Avatar
      sx={{
        bgcolor: "primary.main",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}
    >
      <SmartToy />
    </Avatar>
    <Paper
      elevation={0}
      sx={{
        px: 2,
        py: 1.75,
        borderRadius: "12px",
        borderTopLeftRadius: 0,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        gap: 0.75,
      }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "primary.main",
            animation: `${bounce} 1.2s infinite ease-in-out`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </Paper>
  </Box>
);

const AIAssistant: React.FC = () => {
  const { userProfile } = useAuth();

  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const showDemo = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      // If init failed earlier, try again now
      let id = localStorage.getItem("chat_session_id");
      if (!id) {
        id = await initChat(userProfile);
        localStorage.setItem("chat_session_id", id);
      }

      let reply: string;
      try {
        reply = await sendChatMessage(text, id);
      } catch (err) {
        if (!(err instanceof SessionExpiredError)) throw err;
        // Server restarted or session expired: start a fresh one and retry once
        id = await initChat(userProfile);
        localStorage.setItem("chat_session_id", id);
        reply = await sendChatMessage(text, id);
      }

      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I couldn't reach the server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 140px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          AI Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Expert agricultural advice, available 24/7.
        </Typography>
      </Box>

      <Paper
        sx={{
          flexGrow: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            bgcolor:
              theme.palette.mode === "dark" ? "background.default" : "#F8FAF8",
          }}
        >
          {showDemo && (
            <>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Chip
                  size="small"
                  label="Example conversation. Send a message to begin"
                  sx={{
                    bgcolor: "action.hover",
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  opacity: 0.8,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {DEMO_MESSAGES.map((msg, index) => (
                  <MessageBubble key={`demo-${index}`} msg={msg} />
                ))}
              </Box>
            </>
          )}

          {messages.map((msg, index) => (
            <MessageBubble key={index} msg={msg} />
          ))}

          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          {showDemo && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
              {SUGGESTIONS.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  variant="outlined"
                  color="primary"
                  clickable
                  onClick={() => handleSend(s)}
                  sx={{ borderRadius: "16px" }}
                />
              ))}
            </Box>
          )}

          <TextField
            fullWidth
            placeholder="Ask about crops, pests, fertilizers, or market prices..."
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            slotProps={{
              input: {
                sx: {
                  borderRadius: "24px",
                  bgcolor:
                    theme.palette.mode === "dark" ? "action.hover" : "#f5f5f5",
                },
                endAdornment: (
                  <IconButton
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": { bgcolor: "primary.dark" },
                      "&.Mui-disabled": {
                        bgcolor: "action.disabledBackground",
                        color: "action.disabled",
                      },
                    }}
                  >
                    <Send fontSize="small" />
                  </IconButton>
                ),
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default AIAssistant;
