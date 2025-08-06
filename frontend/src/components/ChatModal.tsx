import { useEffect, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { getUserByJwt } from "../server/server";
import { ThemeProvider } from "@emotion/react";
import { theme } from "../theme/theme";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

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
  const {t} = useTranslation()
  const getUser = async () => {
    const data = await getUserByJwt();
    setUser(data);
  };


  useMemo(() => {
    getUser();
  }, []);

  const SERVICE_ID = import.meta.env.VITE_SERVICE_ID
  const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_ID
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
         SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );

      setFeedback({ type: "success", message: t("feedbackSuccess")});
      setMessage("");

      setTimeout(() => {
        setIsOpen(false);
        setFeedback(null);
      }, 2500);
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: t('feedbackFail') });
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
        className="fixed bottom-5 right-5 text-white p-4 rounded-full cursor-pointer shadow-lg"
      >
        💬
      </Box>

      {/* Modal */}
      {isOpen && (
          <div className="fixed bottom-20 right-5 w-80 bg-white p-4 shadow-xl rounded-lg z-50 border">
          <h3 className="text-lg font-semibold mb-2">{t('feedbackTitle')}</h3>

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
            {isSending ? t('sendingFeedback') : t('send')}
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
