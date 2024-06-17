const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/submit-qu', async (req, res) => {
    const { question } = req.body;
    if(question == "what is your name" || question == "what is your name ?"){
        res.json({ qu: "My name is Doraemon Developed by Lucifer ", ln: 'https://github.com/Luciferair'})
    }
    else{
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContentStream(question);
            let generatedText = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                generatedText += chunkText.replace(/\*/g, "");
            }
            console.log("Sucefull");
            res.json({ qu: generatedText, ln: '0'});
        } catch (error) {
            if(error.response && error.response.promptFeedback && error.response.promptFeedback.blockReason === 'SAFETY'){
                link_sub = question.replace(/ /g, '+');
                const user_out_link = `https://www.google.com/search?q=${link_sub}`
                res.json({ qu: "Sorry I can't help with this info but I can give you a link - ",ln: user_out_link });
                console.error('Gemini API error: SAFETY block reason');
            }
            else{
                res.json({ qu: "This is server error please try again", ln: '0'});
                console.log('Sorry, there is a server problem:');
                
            }
        }
    }
    
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
