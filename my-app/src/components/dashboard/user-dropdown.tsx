import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/dashboard/avatar"
import { Button } from "@/components/dashboard/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/dashboard/dropdown-menu"

import { RiLogoutBoxLine, RiSettingsLine, RiTeamLine } from "@remixicon/react"
import { useRouter } from "next/navigation"

export default function UserDropdown({
	firstName,
	lastName,
	email,
}: {
	firstName?: string
	lastName?: string
	email?: string
}) {
	const router = useRouter()
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
					<Avatar className="size-8">
						<AvatarImage
							src="/user.png"
							width={32}
							height={32}
							alt="Profile image"
						/>
						<AvatarFallback>
							{(firstName?.[0] || "") + (lastName?.[0] || "")}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="max-w-64" align="end">
				<DropdownMenuLabel className="flex min-w-0 flex-col">
					<span className="truncate text-sm font-medium text-foreground">
						{firstName + " " + lastName}
					</span>
					<span className="truncate text-xs font-normal text-muted-foreground">
						{email}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<RiSettingsLine
							size={16}
							className="opacity-60"
							aria-hidden="true"
						/>
						<span>Account settings</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<RiTeamLine size={16} className="opacity-60" aria-hidden="true" />
						<span>Affiliate area</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						fetch("http://localhost:5007/teacher/logout", {
							method: "GET",
							credentials: "include",
						})
						router.push("/")
					}}
				>
					<RiLogoutBoxLine
						size={16}
						className="opacity-60"
						aria-hidden="true"
					/>
					<span>Sign out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}