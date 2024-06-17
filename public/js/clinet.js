async function sendMessage() {
    const userInput = document.getElementById('user_input');
    const userMessage = userInput.value.trim();

    if (userMessage === '') return;

    const chatBox = document.getElementById('chat-box');
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-message user';
    userDiv.textContent = userMessage;
    chatBox.appendChild(userDiv);

    userInput.value = '';

    const response = await fetch('/submit-qu', {
        method: 'POST',
        body: JSON.stringify({ question: userMessage }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    const finalData = data.qu;
    const links = data.ln;
    console.log(links);

    setTimeout(() => {
        const botMessage = finalData;
        const botDiv = document.createElement('div');
        botDiv.className = 'chat-message bot';
        let currentChar = 0;
        function typewrite() {
            if (currentChar < botMessage.length) {
                botDiv.textContent += botMessage.charAt(currentChar);
                currentChar++;
                setTimeout(typewrite, 1);
            }
        }
        typewrite();
        chatBox.appendChild(botDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        if(links != '0'){
            setTimeout(()=>{
                const link = document.createElement('a');
                link.href = links;
                link.target = '_blank';
                link.innerHTML=links
                botDiv.appendChild(link);
                chatBox.appendChild(botDiv);
            },1000)
        }
        
    }, 1);
}
