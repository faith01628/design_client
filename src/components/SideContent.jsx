import { Flex } from "antd"
import ContentSideBar from "./ContentSideBar"
import Activity from "./Activity"

const SideContent = () => {
    return (
        <Flex vertical gap='2.3rem' style={{ width: 300 }}>
            <ContentSideBar />
            <Activity />
        </Flex>
    )
}

export default SideContent
