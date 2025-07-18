import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { getUserByJwt } from "../server/server";
import { ThemeProvider } from "@emotion/react";
import { theme } from "../theme/theme";
import { Box, Button } from "@mui/material";

interface User {
  id: number;
  username: string;
  email: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [user, setUser] = useState<User>();

  const getUser = async () => {
    const data = await getUserByJwt();
    setUser(data);
  };


  useEffect(() => {
    getUser();
  }, []);

  console.log(user);
  const handleSend = async () => {
    if (!message.trim() || !user) return;

    setIsSending(true);
    setFeedback(null);

    const templateParams = {
      user_message: message,
      to_name: "Admin",
      user_email: user.email,
    };

    try {
      await emailjs.send(
         "service_5te0f1w",
        "template_w94unbm",
        templateParams,
        "ypHcmya_Z890b9Gva"     // replace with your real public key
      );

      setFeedback({ type: "success", message: "Thanks for your feedback!" });
      setMessage("");

      setTimeout(() => {
        setIsOpen(false);
        setFeedback(null);
      }, 2500); // auto-close after 2.5 seconds
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to send. Please try again." });
    } finally {
      setIsSending(false);
    }
  };

  return (
        <ThemeProvider theme={theme}>
    <div>

      {/* Chat Icon */}
      <Box
        onClick={() => setIsOpen(!isOpen)}
        sx={{bgcolor:"primary.main"}}
        className="fixed bottom-5 right-5 bg-blue-600 hover:primary.main text-white p-4 rounded-full cursor-pointer shadow-lg"
      >
        💬
      </Box>

      {/* Modal */}
      {isOpen && (
          <div className="fixed bottom-20 right-5 w-80 bg-white p-4 shadow-xl rounded-lg z-50 border">
          <h3 className="text-lg font-semibold mb-2">Send us your feedback</h3>

          <textarea
            rows={4}
            className="w-full p-2 border rounded"
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            />

          <Button
          sx={{bgcolor:'primary.main', color:"white", ":hover":{bgcolor:"primary.dark"}}}
            className="mt-2 w-full bg- hover:bg-blue-700 text-white py-2 rounded"
            onClick={handleSend}
            disabled={isSending}
            >
            {isSending ? "Sending..." : "Send"}
          </Button>

          {/* Feedback message */}
          {feedback && (
            <p className={`mt-2 text-sm ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {feedback.message}
            </p>
          )}
        </div>
      )}
    </div>
      </ThemeProvider>
  );
}
