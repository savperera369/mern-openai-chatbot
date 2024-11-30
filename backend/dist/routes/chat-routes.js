import { Router } from 'express';
import { verifyToken } from '../utils/token-manager.js';
import { chatCompletionValidator, validate } from '../utils/validators.js';
import { deleteAllChats, generateChatCompletion, getAllChats } from '../controllers/chat-controllers.js';
// Protected API
// only authorized and authenticated users can access this
const chatRoutes = Router();
chatRoutes.post('/new', validate(chatCompletionValidator), verifyToken, generateChatCompletion);
chatRoutes.get('/all-chats', verifyToken, getAllChats);
chatRoutes.delete('/delete', verifyToken, deleteAllChats);
export default chatRoutes;
//# sourceMappingURL=chat-routes.js.map