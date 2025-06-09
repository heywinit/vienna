import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user";
import { Plus } from "lucide-react";

export default function TopBar() {
  const user = useUserStore();

  return (
    <div className="flex flex-row w-full justify-between items-center">
      <div className="text-2xl font-bold">alo, {user.user.name}</div>
      <div className="flex flex-row">
        <Button variant="outline" size="icon">
          <Plus />
        </Button>
      </div>
    </div>
  );
}
