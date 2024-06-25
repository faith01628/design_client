import { Flex } from "antd"
import ContentSideBar from "../admin/layout/ContentSideBar"
import Activity from "../admin/layout/Activity"

const SideContent = () => {
    return (
        <Flex vertical gap='2.3rem' style={{ width: 300 }}>
            <ContentSideBar />
            <Activity />
        </Flex>
    )
}

export default SideContent
