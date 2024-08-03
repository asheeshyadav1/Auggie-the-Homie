import { useState, useEffect, useRef } from 'react';

const App = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [showPopup, setShowPopup] = useState('info'); // 'info', 'demo', 'how-to', or null

  const openPopup = () => {
    setShowPopup('info');
  };

  const nextPopup = () => {
    if (showPopup === 'info') {
      setShowPopup('demo');
    } else if (showPopup === 'demo') {
      setShowPopup('how-to');
    } else if (showPopup === 'how-to') {
      setShowPopup(null);
      localStorage.setItem('popupsShown', 'true');
    }
  };

  const closePopup = () => {
    setShowPopup(null);
    localStorage.setItem('popupsShown', 'true');
  };

  const getResponse = async () => {
    if (!value) {
      setError('Error! Please enter a question');
      return;
    }
    setLoading(true);
    setChatHistory((oldChatHistory) => [
      ...oldChatHistory,
      { role: 'user', parts: value },
    ]);
    setValue('');
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory.map((chatItem) => ({
            role: chatItem.role,
            parts: [{ text: chatItem.parts }],
          })),
          message: value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch('https://gem-server.vercel.app/gemini', options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.text();
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        { role: 'model', parts: data },
      ]);
    } catch (error) {
      console.error(error);
      setError('Error! Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setValue('');
    setChatHistory([]);
    setError('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    // Check localStorage to determine if the pop-ups have been shown before
    if (!localStorage.getItem('popupsShown')) {
      openPopup();
    }
  }, []);

  const handlePopupClose = () => {
    localStorage.setItem('popupsShown', 'true');
    closePopup();
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Friend Chatlog</h1>
      </div>
      <div className="chat-container">
        {showPopup && (
          <div className="popup-overlay">
            {showPopup === 'info' && (
              <div className="popup">
                <h2> Meet Auggies the Therapist</h2>
                <p>Hello! I’m Asheesh Yadav, and I’ve developed “Auggie the Therapist” using Google’s Gemini AI for my Major Project in the EDUC 240 class here at SFU. “Auggie” is crafted for all students, aiming to create a supportive and inclusive environment for all.
                </p>
                <p>Designed with a modern text message interface, “Auggie” offers a friendly and familiar way to interact. This format enhances the feeling of a casual conversation, making it easier for students to open up and engage. Trained with insights to understand and respond with empathy, “Auggie” is more than just a therapist. It’s a comforting presence and a friendly companion who listens through all of your life’s ups and downs without judgment. Whether you’re experiencing a high, a low, or anything in between, “Auggie” is here to offer support, understanding, and genuine friendship.
                </p>
                <p> Current educational models often miss the mark on inclusivity, leaving out certain groups. With “Auggie,” I aim to bridge that gap by creating a safe space where you can freely share your thoughts and feelings. The text message-like interface is designed to foster a sense of safety and inclusion by simulating an environment you are familiar with when texting a friend—just like Auggie! “Auggie” is here to offer comfort, a listening ear, and a modern, supportive chat whenever you need it.
                </p>
                <button className="popup-next" onClick={nextPopup}>Next</button>
                <button className="popup-close" onClick={handlePopupClose}>Close</button>
              </div>
            )}
            {showPopup === 'demo' && (
              <div className="popup">
                <h2>Disclaimer</h2>
                <p>While “Auggie” is designed to provide support and a listening ear, it is not a substitute for professional therapy. The AI is still in development, and errors may occur. If you have serious or urgent concerns, please seek the assistance of a qualified therapist or mental health professional. Your well-being is important, and professional support is essential for addressing significant issues.</p>
                <p>NOTE: You are perfect the way you are, don't let anyone tell you otherwise :)</p>
                <button className="popup-next" onClick={nextPopup}>Next</button>
                <button className="popup-close" onClick={handlePopupClose}>Close</button>
              </div>
            )}
            {showPopup === 'how-to' && (
              <div className="popup">
                <h2>How to Interact</h2>
                <p>Now before sending you off to Auggie heres a Guide to use Auggie and some pointers</p>
                <p>1. To initiate a conversation enter something in the Text Box showing "Ask me anything..."</p>
                <p>2. Click on the "SEND" button to send your message to Auggie</p>
                <p>3. Auggie will respond to your message with a message of its own which will be displayed on the Chatlog Screen</p>
                <br></br>
                <p>Some Quick Pointers: </p>
                <p>1. Just to reiterate Auggie is a Chatbot and is not a substitute for professional therapy</p>
                <p>2. Auggie is still in development so there might be some errors</p>
                <p>3. If there is an error you will see a red error message on the bottom but not to worry, simply refresh your screen and start over with your convo and you should be set!</p>
                <p>4. Auggie is very hip so no need to use proper english! You are encourage to use slang with him as he can understand it and give you replies back with similar slang terminology</p>
                <p>5. The Only Don'ts with Auggie is using profane language as using them while hes trying to create an uplifting environment hinders with its abilities to give you optimistic responses</p>
                <br></br>
                <p>And thats it! You are all set to start your conversation with Auggie! Have fun and remember Auggie is here to help you out!</p>
                <button className="popup-next" onClick={handlePopupClose}>Go!</button>
                <button className="popup-close" onClick={handlePopupClose}>Close</button>
              </div>
            )}
          </div>
        )}
        <div className="chat-window">
          {chatHistory.length === 0 && !loading && (
            <div className="placeholder">
              <p>Start a conversation by asking a question!</p>
            </div>
          )}
          <div className="search-result">
            {chatHistory.map((chatItem, _index) => (
              <div
                key={_index}
                className={`message-container ${chatItem.role}`}
              >
                <div className={`chat-item ${chatItem.role}`}>
                  <p className={`answer ${chatItem.role}`}>
                    {chatItem.role === 'user' ? 'You' : 'Friend'}: {chatItem.parts}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message-container model">
                <div className="chat-item model">
                  <p className="answer model">Friend: Fetching response...</p>
                </div>
              </div>
            )}
          </div>
          <div ref={chatEndRef} /> {/* Anchor for scrolling */}
        </div>
        <div className="input-container">
          <input
            className="input"
            value={value}
            placeholder="Ask me anything..."
            onChange={(e) => setValue(e.target.value)}
          />
          {!error && (
            <button
              className="ask-button"
              onClick={getResponse}
              disabled={loading}
            >
              SEND
            </button>
          )}
          {error && (
            <button className="clear-button" onClick={clear}>
              Clear
            </button>
          )}
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default App;
