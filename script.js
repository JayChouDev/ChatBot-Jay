window.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById("send-button");
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
  
    function createMessageElement(content, sender) {
      const messageWrapper = document.createElement("div");
      messageWrapper.classList.add("message", sender);
  
      const messageContent = document.createElement("div");
      messageContent.classList.add("bubble");
      messageContent.textContent = content;
  
      messageWrapper.appendChild(messageContent);
      return messageWrapper;
    }
  
    function isMensagemSimples(texto) {
      const mensagensSimples = [
        "oi", "ola", "olá", "e aí", "tudo bem", "tudo bom",
        "bom dia", "boa tarde", "boa noite", "salve", "oii", "oiii"
      ];
      const normalizado = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return mensagensSimples.includes(normalizado);
    }
  
    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;
      userInput.value = "";
  
      const userMsg = createMessageElement(message, "user");
      chatBox.appendChild(userMsg);
  
      const loadingMsg = createMessageElement("Digitando...", "bot");
      chatBox.appendChild(loadingMsg);
      chatBox.scrollTop = chatBox.scrollHeight;
  
      let loadingUpdated = false;
      let changeTypingTimeout;
  
      if (!isMensagemSimples(message)) {
        changeTypingTimeout = setTimeout(() => {
          loadingMsg.querySelector(".bubble").textContent = "Buscando fontes confiáveis...";
          loadingUpdated = true;
        }, 1000);
      }
  
      try {
        const response = await puter.ai.chat("Responda apenas em português: " + message);
        clearTimeout(changeTypingTimeout);
        loadingMsg.querySelector(".bubble").textContent = response;
      } catch (err) {
        clearTimeout(changeTypingTimeout);
        loadingMsg.querySelector(".bubble").textContent = "Erro: " + err.message;
      }
  
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  
    sendButton.addEventListener("click", sendMessage);
  
    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  });
  