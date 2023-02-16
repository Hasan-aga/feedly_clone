import { Button, Navbar, Text, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import Bookmark from "./icons/bookmark";
import Cog from "./icons/cog";
import HomeIcon from "./icons/homeIcon";
import ProfileMenu from "./profileMenu";

export default function CustomNavbar({ session }) {
  return (
    <Navbar isCompact isBordered variant="sticky">
      <Navbar.Content>
        <ProfileMenu session={session} />
      </Navbar.Content>
      <Navbar.Content hideIn="xs" variant="underline">
        <Navbar.Item>
          <Link href="/">
            <HomeIcon />
          </Link>
        </Navbar.Item>
        <Navbar.Item>
          <Link href="/settings/">
            <Tooltip color="primary" content={"Settings"}>
              <Cog />
            </Tooltip>
          </Link>
        </Navbar.Item>
        <Navbar.Item>
          <Link href="/bookmarks">
            <Tooltip color="primary" content={"Settings"}>
              <Bookmark />
            </Tooltip>
          </Link>
        </Navbar.Item>
      </Navbar.Content>

      <Navbar.Brand>
        <Text b color="inherit" hideIn="xs">
          Feedni
        </Text>
      </Navbar.Brand>
    </Navbar>
  );
}
