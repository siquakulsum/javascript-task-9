const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let userMessage = null; 
const inputInitHeight = chatInput.scrollHeight;
const darkModeToggle = document.getElementById('dark-mode-toggle');
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  darkModeToggle.checked = true;
}
darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});

const API_URL = 'https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions';
const API_KEY = '110979bef7msh11deeda20e55a42p1cc957jsn06c1261718d7';
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  const chatContent = className === "outgoing" 
      ? `<p></p>` 
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi; 
};
const generateResponse = async (chatElement) => {
  const messageElement = chatElement.querySelector("p");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": "cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ 
        role: "user", 
        content: userMessage 
      }],
      max_tokens: 100,
      temperature: 0.9
    }),
  };
  
  try {
    const response = await fetch(API_URL, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Something went wrong');
    messageElement.textContent = data.choices[0].message.content;
  } catch (error) {
    messageElement.classList.add("error");
    messageElement.textContent = error.message;
  } finally {
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  const incomingChatLi = createChatLi("...", "incoming");
  chatbox.appendChild(incomingChatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);
  
  generateResponse(incomingChatLi);
};

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));



