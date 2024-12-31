import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./collapsible";

type MenuItem = {
  title: string;
  url: string;
};

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Benificiaries",
    url: "/list/datatable",
  },
  {
    title: "TNA",
    url: "/tna/tna",
  },

  {
    title: "Evaluation",
    url: "/eval/evaluation",
  },
];
const result = [
  {
    title: "TNA",
    url: "/results/allresults/tnaresults",
  },
  {
    title: "TEST",
    url: "/results/allresults/testresults",
  },
];
const tests = [
  {
    title: "Crim",
    url: "/exam/crim",
  },
  {
    title: "Comsci",
    url: "/exam/comsci",
  },
  {
    title: "Educ",
    url: "/exam/educ",
  },
  {
    title: "Foodtech",
    url: "/exam/foodtech",
  },
  {
    title: "Fisheries",
    url: "/exam/fisheries",
  },
];

export function AppSidebar() {
  const isCurrentUri = (arr: MenuItem[]) =>
    arr.some((item) => window.location.pathname.includes(item.url));
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup className="h-full">
          <SidebarGroupLabel className="font-bold text-3xl text-black">
            <div className="flex items-center py-5 -ml-3">
              <div>
                <img src={logo} alt="Logo" className=" w-12 h-12" />
              </div>
              <h1 className="text-2xl font-bold">Seminar Assess</h1>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="font-bold pt-5">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className=" text-black" key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={` hover:bg-amber-600 active:bg-amber-900 hover:text-white py-5 ${
                      window.location.pathname.includes(item.url) &&
                      item.url !== "/" &&
                      "bg-amber-700 text-white"
                    } `}
                  >
                    <a href={item.url}>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Collapsible
                defaultOpen={isCurrentUri(tests)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover:bg-amber-600 text-black hover:text-white active:bg-amber-900">
                      Tests{" "}
                      <ChevronDown className=" ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 text-black " />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {tests.map((item) => (
                        <SidebarMenuSubItem
                          className=" text-black"
                          key={item.title}
                        >
                          <SidebarMenuButton
                            asChild
                            className={` hover:bg-amber-600 hover:text-white active:bg-amber-900 ${
                              window.location.pathname.includes(item.url) &&
                              item.url !== "/" &&
                              "bg-amber-700 text-white"
                            } `}
                          >
                            <a href={item.url}>
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <Collapsible
                defaultOpen={isCurrentUri(result)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover:bg-amber-600 text-black hover:text-white active:bg-amber-900 ">
                      Results{" "}
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 text-black" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {result.map((item) => (
                        <SidebarMenuSubItem
                          className=" text-black"
                          key={item.title}
                        >
                          <SidebarMenuButton
                            asChild
                            className={` hover:bg-amber-600 hover:text-white active:bg-amber-900 ${
                              window.location.pathname.includes(item.url) &&
                              item.url !== "/" &&
                              "bg-amber-700 text-white"
                            } `}
                          >
                            <a href={item.url}>
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="hover:bg-amber-800 font-bold text-black">
              Admin
              <ChevronUp className="ml-auto text-black" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-fit">
            <DropdownMenuItem>
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarContent>
    </Sidebar>
  );
}
