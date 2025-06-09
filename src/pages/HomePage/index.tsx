import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopBar from "./TopBar";

export default function HomePage() {
  const timezones = [
    { name: "HERE", zone: "LOCAL" },
    { name: "HONG KONG", zone: "Asia/Hong_Kong" },
  ];

  return (
    <div className="w-full h-full p-6 py-16 flex flex-row items-center justify-center">
      <div className="flex flex-col h-full w-[100rem]">
        <TopBar />
        <div className="flex flex-row w-full gap-32">
          <div className="flex flex-col w-3/5">
            <div className="flex flex-row w-full">
              {timezones.map((timezone) => (
                <div className="flex flex-col w-max">
                  <Card className="">
                    <CardHeader>
                      <CardTitle>{timezone.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {new Date().toLocaleString("en-US", {
                          timeZone:
                            timezone.zone === "LOCAL"
                              ? undefined
                              : timezone.zone,
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col w-2/5"></div>
        </div>
      </div>
    </div>
  );
}
