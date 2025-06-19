import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Send,
  Search,
  ArrowLeft,
  Settings,
  Bell,
  Paperclip,
  Smile,
  MoreHorizontal,
  X,
  Image,
  Video,
  FileText,
  Music,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
// Mock data for users and conversations

const mockMessages = [
  {
    id: 1,
    senderId: 2,
    text: "Hi there, How are you?",
    timestamp: "09:00",
    read: true,
    type: "text",
  },
  {
    id: 2,
    senderId: 1,
    text: "Waiting for your reply. As I have to go back soon. I have to travel long distance.",
    timestamp: "09:05",
    read: true,
    type: "text",
  },
  {
    id: 3,
    senderId: 2,
    text: "Hi, I am coming there in few minutes. Please wait! I am in taxi right now.",
    timestamp: "09:10",
    read: true,
    type: "text",
  },
  {
    id: 4,
    senderId: 1,
    text: "Thank you very much, I am waiting here at StarBuck cafe.",
    timestamp: "09:15",
    read: false,
    type: "text",
  },
];

// Emoji data
const emojiCategories = {
  Smileys: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
  ],
  Animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🙈",
    "🙉",
    "🙊",
    "🐒",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🐣",
    "🐥",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
    "🐺",
    "🐗",
    "🐴",
    "🦄",
    "🐝",
    "🐛",
    "🦋",
    "🐌",
    "🐞",
    "🐜",
    "🦟",
    "🦗",
    "🕷️",
    "🦂",
    "🐢",
    "🐍",
    "🦎",
    "🦖",
    "🦕",
    "🐙",
    "🦑",
    "🦐",
    "🦞",
    "🦀",
    "🐡",
    "🐠",
    "🐟",
    "🐬",
    "🐳",
    "🐋",
    "🦈",
    "🐊",
    "🐅",
    "🐆",
    "🦓",
    "🦍",
    "🦧",
    "🐘",
    "🦛",
    "🦏",
    "🐪",
    "🐫",
    "🦒",
    "🦘",
    "🐃",
    "🐂",
    "🐄",
    "🐎",
    "🐖",
    "🐏",
    "🐑",
    "🦙",
    "🐐",
    "🦌",
    "🐕",
    "🐩",
    "🦮",
    "🐕‍🦺",
    "🐈",
    "🐓",
    "🦃",
    "🦚",
    "🦜",
    "🦢",
    "🦩",
    "🕊️",
    "🐇",
    "🦝",
    "🦨",
    "🦡",
    "🦦",
    "🦥",
    "🐁",
    "🐀",
    "🐿️",
    "🦔",
  ],
  Food: [
    "🍏",
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶️",
    "🫑",
    "🌽",
    "🥕",
    "🫒",
    "🧄",
    "🧅",
    "🥔",
    "🍠",
    "🥐",
    "🥖",
    "🍞",
    "🥨",
    "🥯",
    "🧀",
    "🥚",
    "🍳",
    "🧈",
    "🥞",
    "🧇",
    "🥓",
    "🥩",
    "🍗",
    "🍖",
    "🦴",
    "🌭",
    "🍔",
    "🍟",
    "🍕",
    "🥪",
    "🥙",
    "🧆",
    "🌮",
    "🌯",
    "🫔",
    "🥗",
    "🥘",
    "🫕",
    "🍝",
    "🍜",
    "🍲",
    "🍛",
    "🍣",
    "🍱",
    "🥟",
    "🦪",
    "🍤",
    "🍙",
    "🍚",
    "🍘",
    "🍥",
    "🥠",
    "🥮",
    "🍢",
    "🍡",
    "🍧",
    "🍨",
    "🍦",
    "🥧",
    "🧁",
    "🍰",
    "🎂",
    "🍮",
    "🍭",
    "🍬",
    "🍫",
    "🍿",
    "🍩",
    "🍪",
    "🌰",
    "🥜",
    "🍯",
  ],
  Objects: [
    "⌚",
    "📱",
    "📲",
    "💻",
    "⌨️",
    "🖥️",
    "🖨️",
    "🖱️",
    "🖲️",
    "🕹️",
    "🗜️",
    "💽",
    "💾",
    "💿",
    "📀",
    "📼",
    "📷",
    "📸",
    "📹",
    "🎥",
    "📽️",
    "🎞️",
    "📞",
    "☎️",
    "📟",
    "📠",
    "📺",
    "📻",
    "🎙️",
    "🎚️",
    "🎛️",
    "🧭",
    "⏱️",
    "⏲️",
    "⏰",
    "🕰️",
    "⌛",
    "⏳",
    "📡",
    "🔋",
    "🔌",
    "💡",
    "🔦",
    "🕯️",
    "🪔",
    "🧯",
    "🛢️",
    "💸",
    "💵",
    "💴",
    "💶",
    "💷",
    "💰",
    "💳",
    "💎",
    "⚖️",
    "🧰",
    "🔧",
    "🔨",
    "⚒️",
    "🛠️",
    "⛏️",
    "🔩",
    "⚙️",
    "🧱",
    "⛓️",
    "🧲",
    "🔫",
    "💣",
    "🧨",
    "🪓",
    "🔪",
    "🗡️",
    "⚔️",
    "🛡️",
    "🚬",
    "⚰️",
    "⚱️",
    "🏺",
    "🔮",
    "📿",
    "🧿",
    "💈",
    "⚗️",
    "🔭",
    "🔬",
    "🕳️",
    "🩹",
    "🩺",
    "💊",
    "💉",
    "🧬",
    "🦠",
    "🧫",
    "🧪",
    "🌡️",
    "🧹",
    "🧺",
    "🧻",
    "🚽",
    "🚰",
    "🚿",
    "🛁",
    "🛀",
    "🧼",
    "🪒",
    "🧽",
    "🧴",
    "🛎️",
    "🔑",
    "🗝️",
    "🚪",
    "🪑",
    "🛋️",
    "🛏️",
    "🛌",
    "🧸",
    "🖼️",
    "🛍️",
    "🛒",
    "🎁",
    "🎈",
    "🎏",
    "🎀",
    "🎊",
    "🎉",
    "🎎",
    "🏮",
    "🎐",
    "🧧",
    "✉️",
    "📩",
    "📨",
    "📧",
    "💌",
    "📥",
    "📤",
    "📦",
    "🏷️",
    "📪",
    "📫",
    "📬",
    "📭",
    "📮",
    "📯",
    "📜",
    "📃",
    "📄",
    "📑",
    "🧾",
    "📊",
    "📈",
    "📉",
    "🗒️",
    "🗓️",
    "📆",
    "📅",
    "🗑️",
    "📇",
    "🗃️",
    "🗳️",
    "🗄️",
    "📋",
    "📁",
    "📂",
    "🗂️",
    "🗞️",
    "📰",
    "📓",
    "📔",
    "📒",
    "📕",
    "📗",
    "📘",
    "📙",
    "📚",
    "📖",
    "🔖",
    "🧷",
    "🔗",
    "📎",
    "🖇️",
    "📐",
    "📏",
    "🧮",
    "📌",
    "📍",
    "✂️",
    "🖊️",
    "🖋️",
    "✒️",
    "🖌️",
    "🖍️",
    "📝",
    "✏️",
    "🔍",
    "🔎",
    "🔏",
    "🔐",
    "🔒",
    "🔓",
  ],
};
import { UserContext } from "../../../shared/contexts/UserContext";
import { fetchContacts } from "../message";

const MessagePage = () => {
  const navigat = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [currentChat, setCurrentChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileViewVisible, setIsMobileViewVisible] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState("people");
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChatPartner, setCurrentChatPartner] = useState(null);
  const socketRef = useRef(null);
  const chatPartnerRef = useRef(null);
  const token = localStorage.getItem("jwt");
  useEffect(() => {
    if (!currentUser?._id) return;

    fetchContacts(currentUser._id)
      .then((contacts) => {
        console.log("✅ Raw contacts:", contacts); // fetched from server
        setContacts(contacts);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch contacts:", err.message);
      });
  }, [currentUser]);

  // log after contacts are updated
  useEffect(() => {
    console.log("Contacts updated in state:", contacts);
  }, [contacts]);
  //jwt

  // useEffect(() => {
  //   const jwt = localStorage.getItem("jwt");
  //   if (!jwt) {
  //     navigat("/login"); // or whatever your login route is
  //     return;
  //   }
  //
  //   socket.current = io("http://localhost:3000", { withCredentials: true });
  //
  //   socket.current.emit("register", { token: jwt });
  //
  //   // other socket events...
  // }, []);
  //socket
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:3000", { withCredentials: true });

    socket.current.on("connect", () => {
      console.log("✅ Connected to Socket.IO:", socket.current.id);
    });

    const token = localStorage.getItem("jwt");
    if (token) socket.current.emit("register", { token });
    else console.warn("JWT not found → user not registered on socket");

    // Listen for incoming messages
    socket.current.on("receive_message", (msg) => {
      const partner = chatPartnerRef.current;
      if (
        partner &&
        (msg.sender === partner._id || msg.receiver === partner._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.current.disconnect();
  }, []);

  // Keep partner ref synced
  //  useEffect(() => {
  //    chatPartnerRef.current = currentChatPartner;
  //  }, [currentChatPartner]);
  //
  useEffect(() => {
    if (!socket.current) return;

    socket.current.on("messages_history", (history) => {
      console.log("📜 Received history:", history.length, "messages");
      setMessages(history); // ✅ sets the message state
    });

    return () => socket.current.off("messages_history");
  }, []);

  useEffect(() => {
    if (!currentChat?._id || !socket.current) return;
    socket.current.emit("load_messages", { with: currentChat._id });

    socket.current.emit("mark_read", { with: currentChat._id });
  }, [currentChat]);

  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) return;
    fetchContacts(uid)
      .then(setContacts)
      .catch((err) => console.error(err.message));
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target)
      ) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const currentChatUser = currentChat || {};
  // 🔧 REPLACE your current handleSendMessage with this version
  const handleSendMessage = (text = messageText.trim(), msgType = "text") => {
    if (!text) {
      console.warn("⚠️ Empty message. Skipping send.");
      return;
    }

    if (!currentChat || !currentChat._id) {
      console.warn("⚠️ No chat selected. Cannot send.");
      return;
    }

    if (!socket.current) {
      console.error("❌ Socket not connected.");
      return;
    }

    console.log("📤 Sending to", currentChat._id, ":", text);

    socket.current.emit("private_message", {
      receiverId: currentChat._id,
      text,
      type: msgType,
    });

    setMessageText(""); // clear input
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileType = file.type.split("/")[0];
    let messageType = "file";
    let displayText = file.name;

    if (fileType === "image") {
      messageType = "image";
      displayText = `📷 ${file.name}`;
    } else if (fileType === "video") {
      messageType = "video";
      displayText = `🎥 ${file.name}`;
    } else if (fileType === "audio") {
      messageType = "audio";
      displayText = `🎵 ${file.name}`;
    } else {
      displayText = `📎 ${file.name}`;
    }

    handleSendMessage(displayText, messageType);
    setShowAttachmentMenu(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = (accept = "*/*") => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  const filteredUsers = contacts.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  const openChat = (partner) => {
    setCurrentChat(partner); // the conversation you clicked
    setCurrentChatPartner(partner); // (optional alias)
    // do NOT clear messages here; wait for messages_history
  };
  // useEffect(() => {
  //   if (!socket.current) return;
  //
  //   socket.current.on("messages_history", (history) => {
  //     setMessages(history); // ✅ set chat history
  //   });
  //
  //   return () => socket.current.off("messages_history");
  // }, []);
  const containerStyle = {
    height: "100vh",
    width: "100%",
    display: "grid",
    gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "380px 1fr",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const sidebarStyle = {
    display: window.innerWidth < 768 && isMobileViewVisible ? "none" : "flex",
    flexDirection: "column",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
    height: "100vh",
    overflow: "hidden",
  };

  const headerStyle = {
    padding: "20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const logoStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(45deg, #4ade80, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  };

  const searchBoxStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "25px",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    margin: "20px",
  };

  const inputStyle = {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
    flex: 1,
    fontSize: "14px",
  };

  const navStyle = {
    display: "flex",
    padding: "0 20px",
    marginBottom: "20px",
    gap: "20px",
  };

  const chatAreaStyle = {
    display: !isMobileViewVisible && window.innerWidth < 768 ? "none" : "flex",
    flexDirection: "column",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    height: "100vh",
    overflow: "hidden",
  };

  const chatHeaderStyle = {
    padding: "20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const messagesStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    "&::-webkit-scrollbar": {
      width: "8px",
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: "4px",
    },
  };

  const messageInputContainerStyle = {
    padding: "20px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
  };

  const messageInputWrapperStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const messageInputStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "25px",
    padding: "12px 16px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    position: "relative",
  };

  const textInputStyle = {
    flex: 1,
    background: "transparent",
    color: "white",
    fontSize: "14px",
    border: "none",
    outline: "none",
  };

  const sendButtonStyle = {
    width: "48px",
    height: "48px",
    background: "linear-gradient(45deg, #4ade80, #3b82f6)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
  };

  const iconButtonStyle = {
    padding: "8px",
    background: "transparent",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const emojiPickerStyle = {
    position: "absolute",
    bottom: "70px",
    right: "60px",
    width: "350px",
    height: "400px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    padding: "16px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
  };

  const emojiCategoriesStyle = {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    paddingBottom: "8px",
  };

  const emojiGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    gap: "8px",
    overflowY: "auto",
    flex: 1,
  };

  const emojiButtonStyle = {
    width: "32px",
    height: "32px",
    border: "none",
    background: "transparent",
    fontSize: "20px",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.2s ease",
  };

  const attachmentMenuStyle = {
    position: "absolute",
    bottom: "70px",
    right: "120px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    padding: "8px",
    zIndex: 1000,
    minWidth: "180px",
  };

  const attachmentItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "background-color 0.2s ease",
    fontSize: "14px",
    color: "#333",
  };

  const EmptyState = () => (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255, 255, 255, 0.7)",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Send size={32} color="rgba(255, 255, 255, 0.5)" />
      </div>
      <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>Your Messages</h3>
      <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.5)" }}>
        Select a chat to start messaging
      </p>
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {/* Sidebar - User List */}
      <div style={sidebarStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/home")}
          >
            <div style={logoStyle}>💬</div>
            <span
              style={{ color: "white", fontWeight: "600", fontSize: "18px" }}
            >
              Artisan
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              style={iconButtonStyle}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              <Settings size={20} color="rgba(255,255,255,0.7)" />
            </button>
            <button
              style={iconButtonStyle}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              <Bell size={20} color="rgba(255,255,255,0.7)" />
            </button>
          </div>
        </div>

        {/* Search Box */}
        <div style={searchBoxStyle}>
          <Search size={16} color="rgba(255,255,255,0.5)" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Navigation Tabs */}
        <div style={navStyle}>
          <button
            style={{
              color: "#fb923c",
              borderBottom: "2px solid #fb923c",
              paddingBottom: "8px",
              paddingLeft: "12px",
              paddingRight: "12px",
              fontSize: "14px",
              fontWeight: "500",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            CHAT
          </button>
        </div>

        {/* User List - Made Scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
            },
          }}
        >
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                setCurrentChat(user);
                setCurrentChatPartner(user); // ✅ now your messages will send
                setIsMobileViewVisible(true);
              }}
              style={{
                padding: "16px",
                margin: "0 12px 8px",
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                background:
                  currentChat === user._id
                    ? "rgba(255, 255, 255, 0.15)"
                    : "transparent",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.1)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background =
                  currentChat === user.id
                    ? "rgba(255, 255, 255, 0.15)"
                    : "transparent")
              }
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: user.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {user.initials}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      border: "2px solid white",
                      backgroundColor:
                        user.status === "online"
                          ? "#4ade80"
                          : user.status === "away"
                          ? "#fbbf24"
                          : "#9ca3af",
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <h3
                      style={{
                        color: "white",
                        fontWeight: "500",
                        fontSize: "14px",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.name}
                    </h3>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "12px",
                      }}
                    >
                      {user.time}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "12px",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.lastMessage}
                  </p>
                </div>
                {user.unread > 0 && (
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fb923c",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {user.unread}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={chatAreaStyle}>
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div style={chatHeaderStyle}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                {window.innerWidth < 768 && (
                  <button
                    onClick={() => setIsMobileViewVisible(false)}
                    style={iconButtonStyle}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "rgba(255,255,255,0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "transparent")
                    }
                  >
                    <ArrowLeft size={20} color="white" />
                  </button>
                )}
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: currentChatUser.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {currentChatUser.initials}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      border: "2px solid white",
                      backgroundColor:
                        currentChatUser.status === "online"
                          ? "#4ade80"
                          : currentChatUser.status === "away"
                          ? "#fbbf24"
                          : "#9ca3af",
                    }}
                  />
                </div>
                <div>
                  <h3
                    style={{
                      color: "white",
                      fontWeight: "500",
                      fontSize: "16px",
                      margin: 0,
                    }}
                  >
                    {currentChatUser.name}
                  </h3>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "12px",
                      margin: 0,
                    }}
                  >
                    {currentChatUser.status === "online"
                      ? "Online"
                      : currentChatUser.status === "away"
                      ? "Away"
                      : "Offline"}
                  </p>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <button
                  style={iconButtonStyle}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(255,255,255,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  <Search size={20} color="rgba(255,255,255,0.7)" />
                </button>
                <button
                  style={iconButtonStyle}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(255,255,255,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  <MoreHorizontal size={20} color="rgba(255,255,255,0.7)" />
                </button>
              </div>
            </div>

            {/* Messages - Made Scrollable */}
            <div ref={messagesContainerRef} style={messagesStyle}>
              {messages.map((message) => {
                // 1️⃣  Own‑message test
                const isOwnMessage =
                  String(message.sender) === String(currentUser._id); //  ← change

                // 2️⃣  Lookup the sender contact (for avatar / color)
                const sender = contacts.find(
                  (user) => String(user._id) === String(message.sender) //  ← change
                );

                console.log(isOwnMessage, message.senderId, currentUser._id);
                return (
                  <div
                    key={message._id || message.id}
                    style={{
                      display: "flex",
                      justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                      alignItems: "flex-end",
                      gap: "8px",
                    }}
                  >
                    {!isOwnMessage && (
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: sender?.color || "#ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "12px",
                          flexShrink: 0,
                        }}
                      >
                        {sender?.initials || "U"}
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: "12px 16px",
                        borderRadius: isOwnMessage
                          ? "20px 20px 6px 20px"
                          : "20px 20px 20px 6px",
                        background: isOwnMessage
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontSize: "14px",
                        lineHeight: "1.4",
                        wordBreak: "break-word",
                      }}
                    >
                      <div>{message.text}</div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.6)",
                          marginTop: "4px",
                          textAlign: isOwnMessage ? "right" : "left",
                        }}
                      >
                        {message.timestamp}
                        {isOwnMessage && (
                          <span style={{ marginLeft: "4px" }}>
                            {message.read ? "✓✓" : "✓"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} /> {/* Auto-scroll anchor */}
            </div>

            {/* Message Input - Fixed at Bottom */}
            <div style={messageInputContainerStyle}>
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div ref={emojiPickerRef} style={emojiPickerStyle}>
                  <div style={emojiCategoriesStyle}>
                    {Object.keys(emojiCategories).map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedEmojiCategory(category)}
                        style={{
                          padding: "6px 12px",
                          border: "none",
                          background:
                            selectedEmojiCategory === category
                              ? "rgba(102, 126, 234, 0.2)"
                              : "transparent",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                          color: "#333",
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <div style={emojiGridStyle}>
                    {emojiCategories[selectedEmojiCategory]?.map(
                      (emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiSelect(emoji)}
                          style={emojiButtonStyle}
                          onMouseEnter={(e) =>
                            (e.target.style.background = "rgba(0,0,0,0.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.background = "transparent")
                          }
                        >
                          {emoji}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Attachment Menu */}
              {showAttachmentMenu && (
                <div ref={attachmentMenuRef} style={attachmentMenuStyle}>
                  <div
                    style={attachmentItemStyle}
                    onClick={() => triggerFileUpload("image/*")}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "rgba(0,0,0,0.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "transparent")
                    }
                  >
                    <Image size={16} color="#667eea" />
                    <span>Photo</span>
                  </div>
                  <div
                    style={attachmentItemStyle}
                    onClick={() => triggerFileUpload("video/*")}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "rgba(0,0,0,0.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "transparent")
                    }
                  >
                    <Video size={16} color="#667eea" />
                    <span>Video</span>
                  </div>
                  <div
                    style={attachmentItemStyle}
                    onClick={() => triggerFileUpload("audio/*")}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "rgba(0,0,0,0.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "transparent")
                    }
                  >
                    <Music size={16} color="#667eea" />
                    <span>Audio</span>
                  </div>
                  <div
                    style={attachmentItemStyle}
                    onClick={() => triggerFileUpload("*/*")}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "rgba(0,0,0,0.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "transparent")
                    }
                  >
                    <FileText size={16} color="#667eea" />
                    <span>Document</span>
                  </div>
                </div>
              )}

              <div style={messageInputWrapperStyle}>
                <div style={messageInputStyle}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    // onKeyPress={handleKeyPress}
                    onKeyDown={handleKeyPress}
                    style={textInputStyle}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <button
                      onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                      style={iconButtonStyle}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "rgba(255,255,255,0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "transparent")
                      }
                    >
                      <Paperclip size={16} color="rgba(255,255,255,0.7)" />
                    </button>
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      style={iconButtonStyle}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "rgba(255,255,255,0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "transparent")
                      }
                    >
                      <Smile size={16} color="rgba(255,255,255,0.7)" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  style={sendButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow =
                      "0 6px 20px rgba(59, 130, 246, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow =
                      "0 4px 15px rgba(59, 130, 246, 0.3)";
                  }}
                >
                  <Send size={20} color="white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default MessagePage;
