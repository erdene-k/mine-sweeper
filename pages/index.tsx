import GameBoard from "@/MineSweeper/GameBoard";


export default function Home() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">MineSweeper</h1>
        <GameBoard rows={4} cols={4} mineCount={3} />
      </div>
  );
}
