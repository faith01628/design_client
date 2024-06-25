import { Flex } from "antd"
import Banner from "../admin/layout/Banner"
import ProductLists from "../admin/layout/ProductLists"
import SellerLists from "../admin/layout/SellerLists"

const MainContent = () => {
    return (
        <div style={{ flex: 1, marginRight: "20px" }}>
            <Flex vertical gap='2.3rem'>
                <Banner />
                <ProductLists />
                <SellerLists />
            </Flex>
        </div>
    )
}

export default MainContent
