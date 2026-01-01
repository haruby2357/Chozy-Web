import AppRouter from "./app/AppRouter";
// import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] flex justify-center">
      <div className="w-[390px] min-h-screen bg-white relative overflow-hidden">
        <AppRouter />
      </div>
    </div>
  );
}
