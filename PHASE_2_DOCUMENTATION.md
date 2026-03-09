# Phase 2: Service-Based API Integration Documentation

## Overview

Phase 2 adds intelligent service routing to the AI assistant. The system now detects user intent and routes requests to specialized services like image generation, web search, and code generation.

## Architecture

### Components

1. **serviceRouter.ts** - Backend service handlers
   - Image Generation (Hugging Face API)
   - Web Search (Perplexity API)
   - Code Generation (DeepSeek API)
   - Intent Detection

2. **aiRouterEnhanced.ts** - Enhanced AI router with service integration
   - Smart chat endpoint that routes to services
   - Service call analysis
   - Fallback to general AI chat

3. **FloatingChatEnhanced.tsx** - Enhanced UI component
   - Service mutation handlers
   - Real-time service execution
   - Image and code display

## Services

### 1. Image Generation
**Trigger Keywords:** "generate image", "create image", "draw", "picture of"

**Example:**
```
User: "Generate an image of a sunset over the ocean"
System: Calls Hugging Face Stable Diffusion API
Response: Displays generated image in chat
```

**Environment Variable:** `HUGGING_FACE_API_KEY`

### 2. Web Search
**Trigger Keywords:** "search for", "find information", "what is", "tell me about", "latest news"

**Example:**
```
User: "Search for information about Bangladesh National ID"
System: Calls Perplexity API for real-time search
Response: Displays search results with sources
```

**Environment Variable:** `PERPLEXITY_API_KEY`

### 3. Code Generation
**Trigger Keywords:** "write code", "generate code", "create function", "python script"

**Example:**
```
User: "Write a Python function to reverse a string"
System: Calls DeepSeek Coder API
Response: Displays code in formatted code block
```

**Environment Variable:** `DEEPSEEK_API_KEY`

## API Endpoints

### Smart Chat (Enhanced)
```typescript
POST /api/trpc/ai.smartChat
Input: {
  messages: Message[],
  model?: string
}
Output: {
  type: "service_call" | "chat",
  content?: string,
  service?: "image" | "search" | "code",
  data?: ServiceCall
}
```

### Image Generation
```typescript
POST /api/trpc/services.generateImage
Input: { prompt: string }
Output: { success: boolean, image?: string, message: string }
```

### Web Search
```typescript
POST /api/trpc/services.searchWeb
Input: { query: string }
Output: { success: boolean, results: string }
```

### Code Generation
```typescript
POST /api/trpc/services.generateCode
Input: { prompt: string, language?: string }
Output: { success: boolean, code: string }
```

## Environment Variables Required

```bash
# For Image Generation
HUGGING_FACE_API_KEY=your_huggingface_token

# For Web Search
PERPLEXITY_API_KEY=your_perplexity_token

# For Code Generation
DEEPSEEK_API_KEY=your_deepseek_token

# Existing
BUILT_IN_FORGE_API_URL=your_forge_url
BUILT_IN_FORGE_API_KEY=your_forge_key
```

## How It Works

1. **User sends a message** through the chat interface
2. **Smart Chat endpoint receives** the message and all previous messages
3. **Intent Detection analyzes** the message for service keywords
4. **If service detected:**
   - Returns service call instruction to client
   - Client calls appropriate service endpoint
   - Service executes and returns result
   - Result is displayed in chat
5. **If no service detected:**
   - Routes to general AI chat using Gemini/Groq
   - Returns AI response

## Free Tier Limitations

### Hugging Face
- Rate limited to ~10 requests/minute
- Image generation takes 10-30 seconds
- Model: stabilityai/stable-diffusion-2

### Perplexity
- Free tier available with limitations
- Real-time web search capability
- Model: pplx-7b-online

### DeepSeek
- Free tier available
- Specialized for code generation
- Model: deepseek-coder

## Error Handling

Each service has built-in error handling:
- Returns `success: false` on failure
- Provides user-friendly error messages
- Logs detailed errors to console
- Shows toast notifications to user

## Future Enhancements

1. **Multiple Models Support**
   - Add Groq for faster responses
   - Add OpenRouter for model selection
   - Implement model fallback logic

2. **Advanced Intent Detection**
   - Use NLP for better intent classification
   - Support multi-intent requests
   - Context-aware routing

3. **Service Caching**
   - Cache search results
   - Cache generated images
   - Reduce API calls

4. **User Preferences**
   - Save user's favorite services
   - Custom service configurations
   - Usage analytics

## Testing

### Local Testing
```bash
# Start the development server
npm run dev

# Test image generation
# Type: "Generate an image of a cat"

# Test web search
# Type: "Search for latest AI news"

# Test code generation
# Type: "Write a Python function to sort a list"
```

## Troubleshooting

### Image Generation Fails
- Check HUGGING_FACE_API_KEY is set
- Verify token has API access
- Check rate limits haven't been exceeded

### Web Search Returns No Results
- Check PERPLEXITY_API_KEY is set
- Verify query is specific enough
- Check internet connection

### Code Generation Produces Poor Results
- Be more specific in your prompt
- Specify the programming language
- Provide context or requirements

## Integration with Phase 3

Phase 3 will add:
- RAG (Retrieval-Augmented Generation) for document chat
- Advanced service orchestration
- Multi-model routing
- Service composition
