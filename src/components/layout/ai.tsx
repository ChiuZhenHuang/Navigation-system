// import { useState } from "react";
// import { askAI } from "@/aiConfig";

// const AIChat = ({ travelData }: any) => {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");

//   const handleAsk = async () => {
//     if (!question) return;
//     const response = await askAI(question, travelData);
//     setAnswer(response);
//   };

//   return (
//     <div className="chat-container">
//       <h2>導航 AI 問答</h2>
//       <input
//         type="text"
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//         placeholder="請輸入您的問題..."
//       />
//       <button onClick={handleAsk}>詢問 AI</button>
//       {answer && <p>AI 回答: {answer}</p>}
//     </div>
//   );
// };

// export default AIChat;
