
export const isEmpty = (value) => {
    return !value.trim();
};

export const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(email);
};

export const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return !passwordRegex.test(password);
};


export const passwordcheck = (pass, conf) => {
    return pass !== conf;
}
