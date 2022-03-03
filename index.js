const io = require('socket.io')(process.env.PORT || 5000, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    socket.join(socket.handshake.query.id);

    socket.on('send-message', (chat) => {
        chat.members.forEach((member) => {
            socket.broadcast.to(member._id).emit('recieve-message', chat);
        });
    });

    socket.on('check-message', (chat) => {
        chat && chat.members.forEach((member) => {
            socket.broadcast.to(member._id).emit('checked-message', chat);
        });
    });

    socket.on('create-chat', (chat) => {
        chat && chat.members.forEach((member) => {
            socket.broadcast.to(member._id).emit('created-chat', chat);
        });
    });

    socket.on('leave-chat', (chat) => {
        chat && chat.members.forEach((member) => {
            socket.broadcast.to(member._id).emit('leaved-chat', chat);
        });
    });

    socket.on('kick-member', ({ updatedChat, kickedMember }) => {
        updatedChat && [...updatedChat.members, kickedMember].forEach((member) => {
            socket.broadcast.to(member._id).emit('kicked-member', updatedChat);
        });
    });

    socket.on('promote-member', (chat) => {
        chat && chat.members.forEach((member) => {
            socket.broadcast.to(member._id).emit('promoted-member', chat);
        });
    });

    socket.on('lock-chat', (chat) => {
        chat && chat.members.forEach((member) => {
            socket.broadcast.to(member._id).emit('locked-chat', chat);
        });
    });

    socket.on('add-new-members', (chat) => {
        chat && chat.members.forEach((member) => {
            socket.broadcast.to(member._id).emit('added-new-members', chat);
        });
    });

    socket.on('delete-message', (chat) => {
        chat && chat.members.forEach((member) => {
            socket.broadcast.to(member._id).emit('deleted-message', chat);
        });
    });

    socket.on('update-image', (chat) => {
        chat && chat.members.forEach((member) => {
            socket.broadcast.to(member._id).emit('image-updated', chat);
        });
    });

    socket.on('user-online', ({ chats, users }) => {
        (users && chats) && users.forEach((user) => {
            socket.broadcast.to(user._id).emit('user-connected', [...chats
                .filter((chat) => user.chats.includes(chat._id) && !chat.is_group)]);
        });
    });

    socket.on('user-offline', (users) => {
        users && users.forEach((user) => {
            socket.broadcast.to(user._id).emit('user-disconnected');
        });
    });

    socket.on('edit-user', ({ chats, users }) => {
        users && users.forEach((user) => {
            socket.broadcast.to(user._id).emit('edited-user', { chats, users });
        });
    });
});
