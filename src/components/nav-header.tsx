import { NavUser } from "./nav-user";

export default function NavHeader() {
  const user = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }

  return (
    <div className="w-full flex justify-end">
      <div className="w-full md:w-[10vw]">
        <NavUser user={user} />
      </div>
    </div>
  )
}