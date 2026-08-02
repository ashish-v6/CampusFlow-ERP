const forgetPassowrdTemplete = (resetUrl : string) =>{
    return `
    <!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
</head>
<body>
    <h2>Reset your password</h2>
    <p>Click the button below:</p>
    <a href="${resetUrl}">Reset Password</a>
</body>
</html>
    `
}
export default  forgetPassowrdTemplete;