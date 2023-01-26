import Accordion from 'react-bootstrap/Accordion';
import CUDBook from "./CUDBook";
import IndexApprove from './approve/indexApprove';
import IndexHistories from './histories/indexHistories';

const IndexBooks = () => {
    return (
        <>
            <Accordion className='my-3'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>CUD Book</Accordion.Header>
                    <Accordion.Body>
                        <CUDBook />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Approve to borrow books</Accordion.Header>
                    <Accordion.Body>
                        <IndexApprove />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Histories borrow books</Accordion.Header>
                    <Accordion.Body>
                        <IndexHistories />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

        </>
    )
}

export default IndexBooks;