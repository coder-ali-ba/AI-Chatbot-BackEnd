import express from "express"
import dotenv from "dotenv"
import {
  GoogleGenAI,
} from '@google/genai';
import cors from "cors"

const app =express()
dotenv.config()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

const PORT = process.env.PORT

app.post("/" , async(req , res)=>{
try {
    const userInput = req.body.prompt;
    if (!userInput) {
      return res.status(400).json({ error: "Missing 'prompt' in request body." });
    }

  
    


  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });


  const tools = [
    { codeExecution: {} },
    {
      googleSearch: {
      }
    },
  ];
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    tools,
  };
  const model = 'gemini-2.5-flash';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: userInput,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model : "gemini-2.5-flash",
    config,
    contents,
  });

  
  let output = "No response";
    try {
      const candidates = response?.candidates;
      if (candidates && candidates.length > 0) {
        const parts = candidates[0]?.content?.parts;
        if (Array.isArray(parts)) {
          output = parts.map(p => p?.text || '').join('\n').trim();
        }
      }
    } catch (err) {
      console.log("Parsing error:", err.message);
    }

   
    
   res.status(200).json({ response: output}); 
} catch (error) {
    console.log(error.message);
    res.status(500).json({
        error : "internal server error"
    })
    
}})





app.listen(PORT , ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
    
})


export default app