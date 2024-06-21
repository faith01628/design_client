import { Flex, Typography, Button, List, Avatar } from "antd"

const data = [
    {
        name: "Huy",
        orderTime: 1,
    },
    {
        name: "Bảo",
        orderTime: 2,
    },
    {
        name: "Ngân",
        orderTime: 3,
    },
    {
        name: "Tài",
        orderTime: 4,
    },
    {
        name: "Khôi",
        orderTime: 5,
    },
]
const Activity = () => {
    return (
        <Flex vertical gap='small'>
            <Flex align="center" justify="space-between" gap='large'>
                <Typography.Title level={3} strong className="primary--color">
                    Recent Activity
                </Typography.Title>
                <Button type="link" className="gray--color">
                    View All
                </Button>
            </Flex>

            <List pagination dataSource={data} renderItem={(user, index) => (
                <List.Item>
                    <List.Item.Meta avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />} title={<a href="#">{user.name}</a>}
                    description='Ordered a new plant'></List.Item.Meta>
                    <span className="gray--color">
                        {user.orderTime} {user.orderTime == 1 ? 'day ago' : 'days ago'}
                    </span>
                </List.Item>
            )} />
        </Flex>
    )
}

export default Activity
