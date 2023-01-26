import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// Có thể phát triển dựa vào 'Lượt mượn'
const TopListBooks = (props) => {
    return (
        <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className=""
        >
            <Tab eventKey="home" title="Top tháng">
                <ul className="list-group">
                    <li className="list-group-item">An item</li>
                    <li className="list-group-item">A second item</li>
                </ul>
            </Tab>
            <Tab eventKey="profile" title="Top tuần">
                tuần
            </Tab>
            <Tab eventKey="contact" title="Top ngày">
                ngày
            </Tab>
        </Tabs>
    )

}

export default TopListBooks;