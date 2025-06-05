import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col p-2 flex-1">
      <div className="grid grid-cols-8 grid-rows-5 gap-2 w-full h-full">
        {/* Timers */}
        <Card className="col-span-2 row-span-2 row-start-2 flex flex-col">
          <h2 className="font-bold text-lg mb-2">Bookmarks</h2>
          <div className="flex-1 flex items-center justify-center text-gray-400">
            [Bookmarks List]
          </div>
        </Card>
        {/* Timers */}
        <Card className="col-span-2 row-span-1 row-start-1 flex flex-col">
          <h2 className="font-bold text-lg mb-2">Timers</h2>
          <div className="flex-1 flex items-center justify-center text-gray-400">
            [Timer Controls]
          </div>
        </Card>
        {/* Today's Tasks */}
        <Card className="col-span-2 row-span-3 col-start-7 flex flex-col">
          <h2 className="font-bold text-lg mb-2">Today's Tasks</h2>
          <div className="flex-1 flex items-center justify-center text-gray-400">
            [Tasks List]
          </div>
        </Card>
        {/* Quick Access */}
        <Card className="col-span-1 row-span-1 col-start-6 row-start-1 flex flex-col">
          <h2 className="font-bold text-lg mb-2">Quick Access</h2>
          <div className="flex-1 flex items-center justify-center text-gray-400">
            [Quick Access List]
          </div>
        </Card>
        {/* Projects */}
        <Card className="col-span-2 row-span-2 col-start-7 flex flex-col">
          <h2 className="font-bold text-lg mb-2">Projects</h2>
          <div className="flex-1 flex items-center justify-center text-gray-400">
            [Projects List]
          </div>
        </Card>
      </div>
    </div>
  );
}
