import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, Card, InputGroup, FormControl } from "react-bootstrap";
import { FaMoon, FaSun, FaRegSmile, FaTimes, FaRobot, FaPaperPlane, FaVolumeMute, FaVolumeUp, FaArrowDown } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';

const Chatbot = () => {
  const [show, setShow] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([{ type: "bot", text: "Hi, I am Sai" }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true); // New state to track scroll position
  
  const chatIconRef = useRef(null);
  const chatEndRef = useRef(null); // Reference for scrolling to the bottom
  const chatMessagesRef = useRef(null); // Reference for chat messages
  const recentUpdates = ["HR Portal", "Cultural Events", "Ceo Talks", "Recent Updates"];

  const senderSound = new Audio('https://audio-previews.elements.envatousercontent.com/files/472198703/preview.mp3');
  const receiverSound = new Audio('https://audio-previews.elements.envatousercontent.com/files/472198703/preview.mp3');

  const handleShow = () => {
    setShow(!show);
    if (!show) {
      setMessages([{ type: "bot", text: "Hi, I am Sai. How can I help you ?" }]);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSilentMode = () => setSilentMode(!silentMode);

  const validateInput = (input) => {
    if (!input.trim()) {
      alert("Message cannot be empty!");
      return false;
    }
    if (input.length > 200) {
      alert("Message cannot exceed 200 characters!");
      return false;
    }
    return true;
  };

  const sendMessage = () => {
    if (!validateInput(input)) return;

    const userMessage = { type: "user", text: input, time: new Date() };
    setMessages([...messages, userMessage]);
    setInput('');

    if (!silentMode) {
      senderSound.play().catch(error => console.error("Error playing sender sound:", error));
    }

    setIsLoading(true);
    setTimeout(() => {
      const botMessage = { type: "bot", text: "This is a response from the API", time: new Date() };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsLoading(false);
      if (!silentMode) {
        receiverSound.play().catch(error => console.error("Error playing receiver sound:", error));
      }
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleUpdateClick = async (update) => {
    const userMessage = { type: "user", text: update, time: new Date() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    if (!silentMode) {
      senderSound.play().catch(error => console.error("Error playing sender sound:", error));
    }

    try {
      const response = await fetch('https://example.com/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ update }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const apiMessage = { type: "bot", text: data.message || "No response from server.", time: new Date() };

      setMessages((prevMessages) => [...prevMessages, apiMessage]);
      if (!silentMode) {
        receiverSound.play().catch(error => console.error("Error playing receiver sound:", error));
      }
    } catch (error) {
      console.error("Error sending update to the API:", error);
      const errorMessage = { type: "bot", text: "Error communicating with the server.", time: new Date() };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    setInput((prevInput) => prevInput + emojiObject.emoji);
    setShowEmoji(false);
  };

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      setIsAtBottom(true); // Set to true when scrolled to bottom
    }
  };

  const handleScroll = () => {
    const chatMessages = chatMessagesRef.current;
    if (chatMessages) {
      const { scrollTop, clientHeight, scrollHeight } = chatMessages;
      setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 10); // Check if near the bottom
    }
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom on new messages
  }, [messages]);

  return (
    <>
      {/* Chat Button */}
      <div ref={chatIconRef} className="chat-button">
        <FaRobot size={40} onClick={handleShow} />
      </div>

      {/* Chat Modal */}
      <Modal show={show} onHide={handleShow} dialogClassName={darkMode ? "dark-mode" : ""} centered>
        <Modal.Header className={`chat-header ${darkMode ? 'dark' : 'light'}`}>
          <Modal.Title className="text-white">Compass</Modal.Title>
          <div className="chat-controls">
            {silentMode ? (
              <FaVolumeMute className="text-white mx-2" onClick={toggleSilentMode} title="Sound On" />
            ) : (
              <FaVolumeUp className="text-white mx-2" onClick={toggleSilentMode} title="Sound Off" />
            )}
            {darkMode ? (
              <FaMoon className="text-white mx-2" onClick={toggleDarkMode} title="Switch to Light Mode" />
            ) : (
              <FaSun className="text-white mx-2" onClick={toggleDarkMode} title="Switch to Dark Mode" />
            )}
            <FaTimes className="text-white mx-2" onClick={handleShow} />
          </div>
        </Modal.Header>

        <Modal.Body className={`chat-body ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
          <p className="request-updates">Recent Updates</p>

          {/* Recent Updates Cards */}
          <div className="d-flex flex-wrap justify-content-center">
            {recentUpdates.map((update, index) => (
              <Card key={index} className="m-2 update-card" style={{ backgroundColor: '#54C392', color: 'white', border: 'none' }} onClick={() => handleUpdateClick(update)}>
                <Card.Body>
                  <Card.Text>{update}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="chat-messages mt-3" ref={chatMessagesRef} onScroll={handleScroll}>
            {messages.map((msg, index) => (
              <div key={index} className={`message-container ${msg.type === 'user' ? 'align-right' : 'align-left'}`}>
                <span className="message-time">
                  {msg.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <Card className={msg.type === "user" ? "user-message" : "bot-message"}>
                  <Card.Body>
                    <Card.Text>{msg.text}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
            {isLoading && <div className="text-center">Loading...</div>}
            {/* Scroll to Bottom Marker */}
            <div ref={chatEndRef} />
          </div>

          {/* Scroll Down Icon - only appears if not at the bottom */}
          {!isAtBottom && (
            <div className="text-center">
              <FaArrowDown size={30} className="scroll-down-icon" onClick={scrollToBottom} title="Scroll to Bottom" />
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className={`chat-footer ${darkMode ? 'bg-dark' : 'bg-light'}`}>
          <InputGroup>
            <FormControl
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button className="emoji-button" onClick={() => setShowEmoji(!showEmoji)} style={{ backgroundColor: '#54C392', border: 'none', color: 'white' }}>
              <FaRegSmile />
            </Button>
            <Button className="send-button" onClick={sendMessage} style={{ backgroundColor: '#54C392', color: 'white', border: 'none' }}>
              <FaPaperPlane />
            </Button>
          </InputGroup>

          {/* Emoji Picker */}
          {showEmoji && <EmojiPicker onEmojiClick={onEmojiClick} />}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Chatbot;