
import { useState, useEffect } from "react";
import "./styles.css";

export default function WomensHealthChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [animateTitle, setAnimateTitle] = useState(false);
  
  // Create background bubbles when component mounts
  useEffect(() => {
    createBackgroundElements();
    
    // Clean up function to remove background elements when component unmounts
    return () => {
      const elements = document.querySelectorAll('.background-element');
      elements.forEach(el => el.remove());
    };
  }, []);

  // Function to create decorative background elements
  const createBackgroundElements = () => {
    const body = document.body;
    const colors = ['#ffccf9', '#ffe6f0', '#ffd6e7', '#ffc2d1'];
    
    // Create decorative shapes
    for (let i = 0; i < 15; i++) {
      const element = document.createElement('div');
      element.className = 'background-element';
      
      // Randomize properties
      const size = Math.random() * 60 + 20;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 10 + 10;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const opacity = Math.random() * 0.2 + 0.1;
      
      // Apply styles
      element.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${posX}%;
        top: ${posY}%;
        background-color: ${color};
        opacity: ${opacity};
        border-radius: 50%;
        filter: blur(${Math.random() * 5 + 2}px);
        pointer-events: none;
        animation: float ${duration}s ease-in-out ${delay}s infinite;
        z-index: 1;
      `;
      
      body.appendChild(element);
    }
    
    // Add a few symbols related to women's health
    const symbols = [
      { symbol: '♀', size: 50 },
      { symbol: '❤', size: 50 },
      { symbol: '+', size: 30 }
    ];
    
    symbols.forEach(symbol => {
      const element = document.createElement('div');
      element.className = 'background-element symbol';
      
      const posX = Math.random() * 90 + 5;
      const posY = Math.random() * 90 + 5;
      const delay = Math.random() * 3;
      const duration = Math.random() * 10 + 15;
      
      element.style.cssText = `
        position: absolute;
        font-size: ${symbol.size}px;
        left: ${posX}%;
        top: ${posY}%;
        color: rgba(214, 51, 132, 0.1);
        pointer-events: none;
        animation: float ${duration}s ease-in-out ${delay}s infinite;
        z-index: 1;
      `;
      
      element.textContent = symbol.symbol;
      body.appendChild(element);
    });
  };

  // Animation for the title
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateTitle(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Typing effect for answers
  useEffect(() => {
    if (answer && isTyping) {
      let index = 0;
      setTypedAnswer(""); // Start with an empty string to avoid duplication
  
      const interval = setInterval(() => {
        if (index < answer.length) { // Ensure all characters are added correctly
          setTypedAnswer((prev) => prev + answer.charAt(index));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 30);
  
      return () => clearInterval(interval);
    }
  }, [answer, isTyping]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    setTypedAnswer("");
    setIsTyping(true);
  
    try {
      const response = await fetch("https://3fc2-34-173-133-241.ngrok-free.app/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data && data.answer) {
        setAnswer(data.answer);
        setTypedAnswer(""); // Reset typedAnswer to trigger the typing effect
        setIsTyping(true);
      } else {
        setAnswer("No response received. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setAnswer("Failed to fetch response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h1 className={`chat-title ${animateTitle ? 'pulse' : ''}`}>
        Women's Health AI Chat
      </h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Ask a question about women's health..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
          className="question-input"
        />
        <button onClick={handleAsk} className="ask-button">
          <span className="button-text">Ask Question</span>
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      )}

      {typedAnswer && (
        <div className="answer-box">
          {typedAnswer}
          {isTyping && <span className="cursor">|</span>}
        </div>
      )}
    </div>
  );
}