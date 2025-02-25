// import { OpenAI } from "openai";

// const openai = new OpenAI({
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true,
// });

// export const askAI = async (question: any, travelData: any) => {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // 或 "gpt-3.5-turbo"
//       messages: [
//         {
//           role: "system",
//           content: "你是一個導航助手，根據用戶的行駛紀錄回答問題。",
//         },
//         {
//           role: "user",
//           content: `我的行駛紀錄如下: ${JSON.stringify(
//             travelData
//           )}。請回答: ${question}`,
//         },
//       ],
//     });
//     return response.data.choices[0].message.content;
//   } catch (error) {
//     console.error("AI 回應錯誤:", error);
//     return "發生錯誤，請稍後再試。";
//   }
// };
