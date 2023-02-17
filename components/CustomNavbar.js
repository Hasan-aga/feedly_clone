import CustomModal from "@/pages/modal";
import { Button, Navbar, Text, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import Add from "./icons/add";
import Bookmark from "./icons/bookmark";
import Cog from "./icons/cog";
import HomeIcon from "./icons/homeIcon";
import ProfileMenu from "./profileMenu";
import ProfileMenuTiny from "./profileMenuTiny";

export default function CustomNavbar({ session }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Navbar isCompact isBordered variant="sticky">
        <Navbar.Content>
          <ProfileMenu session={session} />
          <ProfileMenuTiny session={session} />
        </Navbar.Content>
        <Navbar.Content variant="underline">
          <Navbar.Item>
            <Link href="/">
              <Tooltip placement="bottom" color="primary" content="Home">
                <HomeIcon />
              </Tooltip>
            </Link>
          </Navbar.Item>
          <Navbar.Item>
            <div onClick={() => setVisible(true)}>
              <Tooltip placement="bottom" color="primary" content="Add">
                <Add />
              </Tooltip>
            </div>
          </Navbar.Item>
          <Navbar.Item>
            <Link href="/settings/">
              <Tooltip placement="bottom" color="primary" content="Settings">
                <Cog />
              </Tooltip>
            </Link>
          </Navbar.Item>
          <Navbar.Item>
            <Link href="/bookmarks">
              <Tooltip placement="bottom" color="primary" content="Bookmarks">
                <Bookmark />
              </Tooltip>
            </Link>
          </Navbar.Item>
        </Navbar.Content>
        <Navbar.Brand hideIn="xs">
          <Text b color="inherit">
            Feedni
          </Text>
        </Navbar.Brand>
      </Navbar>
      <CustomModal visible={visible} closeHandler={() => setVisible(false)} />
    </div>
  );
}
