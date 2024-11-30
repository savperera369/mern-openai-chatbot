import axios from 'axios';

export const loginUser = async (email: string, password: string) => {
    const response = await axios.post('/user/login', { email, password });
    if (response.status !== 200) {
        throw new Error("Unable to Login");
    }

    const data = response.data;
    return data;
}

export const signUpUser = async (name: string, email: string, password: string) => {
    const response = await axios.post('/user/signup', { name, email, password });

    if (response.status !== 201) {
        throw new Error("Unable to signup");
    }

    const data = response.data;
    return data;
}

export const checkAuthStatus = async () => {
    const response = await axios.get('/user/auth-status');
    if (response.status !== 200) {
        throw new Error("Unable to authenticate");
    }
    const data = response.data;
    return data;
}

export const sendChatRequest = async (message: string) => {
    const response = await axios.post('/chats/new', {
        message
    });

    if (response.status !== 200) {
        throw new Error("Unable to send chat");
    }

    const data = response.data;
    return data;
}

export const getAllUserChats = async () => {
    const response = await axios.get('/chats/all-chats');

    if (response.status !== 200) {
        throw new Error("Unable to get all chats");
    }

    const data = response.data;
    return data;
}

export const deleteAllUserChats = async () => {
    const response = await axios.delete('/chats/delete');

    if (response.status !== 200) {
        throw new Error("Unable to delete user chats");
    }

    const data = response.data;
    return data;
}

export const logoutUser = async () => {
    const response = await axios.get('/user/logout');

    if (response.status !== 200) {
        throw new Error("Unable to log out user");
    }

    const data = response.data;
    return data;
}