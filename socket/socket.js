import { Server } from "socket.io"; 

let activeUsers = [];

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: `${import.meta.env.VITE_FORANTEND_BASEURL}`,  // Frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Add new user
    socket.on("new-user-add", (newUserId) => {
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
        console.log("New User Connected", activeUsers);
      }
      io.emit("get-users", activeUsers);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("User Disconnected", activeUsers);
      io.emit("get-users", activeUsers);
    });

    // Send message to a specific user
    socket.on("send-message", (data) => {
      const { receiverId } = data;
      const user = activeUsers.find((user) => user.userId === receiverId);
      if (user) {
        io.to(user.socketId).emit("recieve-message", data);
      }
    });
  });

  return io;  
}
