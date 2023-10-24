const userDto = (user) => {
    return {
        id: user.id,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
    }
}; 

module.exports = { userDto };