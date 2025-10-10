import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function CredentialsPage() {
  const credentials = [
    {
      friendlyName: "Postgres AWS",
      slug: "postgres-aws-847123ANSq83hrjas374",
      iconPath: "./aws.png",
    },
    {
      friendlyName: "Postgres AWS",
      slug: "postgres-aws-847123ANSq83hrjas374",
      iconPath: "./aws.png",
    },
    {
      friendlyName: "Postgres AWS",
      slug: "postgres-aws-847123ANSq83hrjas374",
      iconPath: "./aws.png",
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col text-white">
      {/* Users from Workspace Section */}
      <div className="px-5 flex justify-start">
        <div className="mr-1">
          <Image
            src="https://github.com/96vini.png"
            alt="User Profile"
            width={128}
            height={128}
            className="w-8 h-8 rounded-3xl"
          />
        </div>
        <div className="mr-1">
          <Image
            src="https://github.com/96vini.png"
            alt="User Profile"
            width={128}
            height={128}
            className="w-8 h-8 rounded-3xl"
          />
        </div>
        <div className="mr-1">
          <Image
            src="https://github.com/96vini.png"
            alt="User Profile"
            width={128}
            height={128}
            className="w-8 h-8 rounded-3xl"
          />
        </div>
      </div>
      <div className="flex flex-1 p-4">
        <div className="w-full h-[80vh] flex-1 grid grid-cols-5 rounded-2xl shadow-xl bg-[#111] p-4 gap-5">
          {credentials.map((credential) => (
            <Card
              key={credential.slug}
              className="w-full h-72 border-1 p-5 pt-3 border-dashed"
            >
              <CardTitle className="text-md">
                {credential.friendlyName}
              </CardTitle>
              <CardContent></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
