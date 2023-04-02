import { useContext, useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { GlobalContext } from '../../../../context/globalContext';
import '../../../../assets/scss/user/library/details/topListBooks.scss';
import CardBook from '../cardBook';
import _ from 'lodash';
import { useSessionStorage } from '../../../../hooks/useStorage';

// Có thể phát triển dựa vào 'Lượt mượn'
const TopListBooks = (props) => {
    const { stateGlobal, dispatch } = useContext(GlobalContext);
    const [topList, setTopList] = useSessionStorage('topList');
    const [topListBooks, setTopListBooks] = useState([]);


    useEffect(() => {
        setTopListBooks(stateGlobal.dataBooksHomeLibrary?.listBooksHomeLibrary ? stateGlobal.dataBooksHomeLibrary?.listBooksHomeLibrary : topList)
    }, [])

    return (
        <Tabs
            defaultActiveKey="month"
            id="uncontrolled-tab-example"
            className=""
        >
            <Tab eventKey="month" title="Top tháng">
                <ul className="topList list-group overflow-auto w-100">
                    {topListBooks?.length > 0 && topListBooks?.map((book, index) => {
                        return (
                            <li key={`bookItem-${index}`} className="list-group-item list-group-item-action list-group-item-info py-0 py-1">
                                <CardBook
                                    rounded={true}
                                    book={book}
                                    disabled={+book.quantityReality - +book.borrowed === 0}
                                    contentInline={true}
                                />
                            </li>
                        )
                    })}
                </ul>
            </Tab>
            <Tab eventKey="week" title="Top tuần">
                tuần
            </Tab>
            <Tab eventKey="day" title="Top ngày">
                ngày
            </Tab>
        </Tabs>
    )

}

export default TopListBooks;