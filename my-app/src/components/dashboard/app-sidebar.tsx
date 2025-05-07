"use client";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/dashboard/sidebar";
import {
  RiLogoutBoxLine,
  RiHome2Line,
  RiClipboardLine,
  RiBookLine,
  RiChat4Line,
  RiGraduationCapLine,
  RiBriefcaseLine,
  RiQuillPenLine,
} from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Sections",
      url: "#",
      items: [
        {
          title: "Home",
          url: "#",
          icon: RiHome2Line,
          isActive: true,
        },
        {
          title: "Classes",
          url: "#",
          icon: RiClipboardLine,
          isActive: false,
        },
        {
          title: "Courses",
          url: "#",
          icon: RiBookLine,
          isActive: false,
        },
        {
          title: "Assignments",
          url: "#",
          icon: RiBriefcaseLine,
          isActive: false,
        },
        {
          title: "Quizzes",
          url: "#",
          icon: RiQuillPenLine,
          isActive: false,
        },
        {
          title: "Chat",
          url: "#",
          icon: RiChat4Line,
          isActive: false,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = React.useState<string>();

  React.useEffect(() => {
    if (pathname) {
      const segments = pathname.split("/").filter(Boolean);
      const currentFolder = segments[segments.length - 1];

      const found = data.navMain[0].items.find(
        (item) => item.title.toLowerCase() === currentFolder.toLowerCase()
      );

      setActive(found?.title); // or setActive(found) if you want the whole object
    }
  }, [pathname]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="py-4 flex items-center gap-3">
          <Image src={"/end.svg"} alt="logo" width={30} height={30}></Image>
          <h2 className="font-bold text-xl">Liberty School</h2>
        </div>
        <hr className="border-t border-border mx-2 -mt-px" />
      </SidebarHeader>
      <SidebarContent className="pt-20">
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="uppercase text-black font-semibold text-md mb-8">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {item.items.map((item, key) => (
                  <SidebarMenuItem key={key}>
                    <Link href={`/teacher-dashboard/${item.title}`}>
                      <SidebarMenuButton
                        asChild
                        className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-blue-300 hover:from-blue-300 hover:to-blue-200 hover:text-white data-[active=true]:from-blue-500 data-[active=true]:to-blue-300 data-[active=true]:text-white [&>svg]:size-auto text-black"
                        isActive={active === item.title}
                      >
                        <div>
                          {item.icon && (
                            <item.icon
                              className=" group-data-[active=true]/menu-button:text-white text-black group-hover/menu-button:text-white"
                              size={22}
                              aria-hidden="true"
                            />
                          )}
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <hr className="border-t border-border mx-2 -mt-px flex justify-center" />
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton
              onClick={() => {
                fetch("http://localhost:5007/teacher/logout", {
                  method: "GET",
                  credentials: "include",
                });
                router.push("/");
              }}
              className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-lg font-semibold group hidden [@media(min-width:525px)]:block"
            >
              <div className="bg-blue-400 border-2 cursor-pointer border-black height-input rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
                <RiLogoutBoxLine className="text-bold"></RiLogoutBoxLine>
              </div>
              <p className="translate-x-2 font-semibold">Sign out</p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
