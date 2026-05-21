export default function ChatPage() {
  return (
    <div className="bg-white border border-gray-200 h-[70vh] flex flex-col shadow-sm">
      <div className="p-5 border-b border-gray-200 font-bold bg-gray-50 text-black">
        Direct Support Chat
      </div>
      
      <div className="flex-1 p-6 flex flex-col justify-end space-y-4 bg-gray-50/50">
         {/* Message Bubbles */}
         <div className="bg-white border border-gray-200 p-4 self-start max-w-md shadow-sm">
           <p className="text-sm text-black">Hello! The latest iteration of the dashboard UI is ready for your review.</p>
           <span className="text-xs text-gray-400 mt-2 block">10:00 AM</span>
         </div>
         <div className="bg-black text-white p-4 self-end max-w-md shadow-sm">
           <p className="text-sm">Looks great. The sharp edges and light theme are exactly what we requested.</p>
           <span className="text-xs text-gray-300 mt-2 block">10:05 AM</span>
         </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 flex space-x-3 bg-white">
        <input 
          type="text" 
          placeholder="Type your message..." 
          className="flex-1 border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors text-black" 
        />
        <button className="bg-black text-white px-8 font-semibold hover:bg-gray-800 transition-colors">
          Send
        </button>
      </div>
    </div>
  );
}