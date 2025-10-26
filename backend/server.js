// backend/server.js
import express from "express";
import cors from "cors";
import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

// Blockscout API configuration
const BLOCKSCOUT_API_URL = process.env.BLOCKSCOUT_API_URL || 'https://eth.blockscout.com/api/v2';

// Helper function to get transaction data from Blockscout
async function getTransactionData(txHash) {
  try {
    // Validate transaction hash format
    if (!txHash || !txHash.match(/^0x[a-fA-F0-9]{64}$/)) {
      throw new Error('Invalid transaction hash format. Must be a 64-character hexadecimal string starting with 0x');
    }

    console.log(`Fetching transaction data for hash: ${txHash}`);
    console.log(`API URL: ${BLOCKSCOUT_API_URL}/transactions/${txHash}`);
    
    const response = await axios.get(`${BLOCKSCOUT_API_URL}/transactions/${txHash}`, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'HashTalk/1.0'
      }
    });
    
    if (!response.data) {
      throw new Error('No data returned from Blockscout API');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction data:', error.message);
    console.error('Full error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error('Transaction not found. Please verify the hash is correct and exists on the blockchain.');
    } else if (error.response?.status === 400) {
      throw new Error('Invalid transaction hash format or parameters.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Blockscout API is taking too long to respond.');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Could not connect to Blockscout API. Please check your internet connection.');
    } else {
      throw new Error(`Could not fetch data from Blockscout: ${error.message}`);
    }
  }
}

// Helper function to translate data using OpenAI
async function translateWithOpenAI(data) {
  try {
    const prompt = `Please translate this blockchain transaction data into human-readable language. 
    Focus on explaining what this transaction does in simple terms. 
    If there are function calls, explain what they do. 
    If there are token transfers, explain the amounts and tokens involved.
    Keep the explanation concise and easy to understand for non-technical users.
    Use numbered lists when describing multiple steps or transfers.
    Format your response with proper line breaks for readability.
    
    Transaction Data: ${JSON.stringify(data, null, 2)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a blockchain expert who translates complex transaction data into simple, human-readable explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error with OpenAI translation:', error.message);
    
    // Check if it's a quota error
    if (error.message.includes('quota') || error.message.includes('429') || error.message.includes('insufficient_quota')) {
      throw new Error('OpenAI quota exceeded - please check billing settings');
    }
    
    throw new Error(`Failed to translate transaction data: ${error.message}`);
  }
}

// Main route to translate transaction hash
app.post("/translate", async (req, res) => {
  try {
    const { hash } = req.body;
    
    if (!hash) {
      return res.status(400).json({ error: "Transaction hash is required" });
    }

    console.log(`Received translation request for hash: ${hash}`);

    // Get transaction data from Blockscout
    const transactionData = await getTransactionData(hash);
    
    // Translate using OpenAI (or mock if quota exceeded)
    let translation;
    try {
      translation = await translateWithOpenAI(transactionData);
    } catch (error) {
      if (error.message.includes('quota') || error.message.includes('429') || error.message.includes('insufficient_quota')) {
        // Fallback to mock translation if OpenAI quota exceeded
        translation = `Mock Translation: This transaction appears to be a blockchain transaction with hash ${hash}. The transaction data has been successfully retrieved from Blockscout, but OpenAI translation is currently unavailable due to quota limits. Please check your OpenAI billing settings.`;
        console.log('Using mock translation due to OpenAI quota exceeded');
      } else {
        throw error;
      }
    }
    
    res.json({
      success: true,
      hash: hash,
      originalData: transactionData,
      translation: translation
    });
    
  } catch (error) {
    console.error('Translation error:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Return appropriate status codes based on error type
    if (error.message.includes('Invalid transaction hash format')) {
      return res.status(400).json({ error: error.message });
    } else if (error.message.includes('Transaction not found')) {
      return res.status(404).json({ error: error.message });
    } else {
      return res.status(500).json({ 
        error: error.message || "Failed to translate transaction hash" 
      });
    }
  }
});

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "Blockchain Hash Translator API is running!",
    status: "healthy"
  });
});

// Health check for dependencies
app.get("/health", async (req, res) => {
  try {
    // Test Blockscout connection
    await axios.get(`${BLOCKSCOUT_API_URL}/stats`);
    
    res.json({
      status: "healthy",
      blockscout: "connected",
      openai: process.env.OPENAI_API_KEY ? "configured" : "not configured"
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Blockchain Hash Translator API running on port ${PORT}`);
  console.log(`Blockscout API: ${BLOCKSCOUT_API_URL}`);
  console.log(`OpenAI configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
});
