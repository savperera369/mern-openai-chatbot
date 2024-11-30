import { Router } from 'express';
import { getAllUsers, userLogin, userLogout, userSignup, verifyUser } from '../controllers/user-controllers.js';
import { loginValidator, signUpValidator, validate } from '../utils/validators.js';
import { verifyToken } from '../utils/token-manager.js';
const userRoutes = Router();
userRoutes.get("/", getAllUsers);
userRoutes.post('/signup', validate(signUpValidator), userSignup);
userRoutes.post('/login', validate(loginValidator), userLogin);
userRoutes.get('/auth-status', verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogout);
export default userRoutes;
// user logins or signs up -> generate a token
// token is like an id card for a user to access some resource
// Authentication step: authentication is user verifying identity by 
// providing same email and password it signed up with
// if this auth process succeeds user is given a token
// Authorization: once user authenticates, he is given a token
// to access a resource, user needs to show the token that was sent during auth
// which ensures that a user is entitled to a resource
// JSON Web Token (JWT) is used to encrypt a payload that has
// all the users permissions and authorities into a signed token
// HTTP only cookies -> type of web cookie that comes with the special attribute
// that restricts cookies from being accessed by javascript in the web browser -> reduce XSS attacks
//# sourceMappingURL=user-routes.js.map