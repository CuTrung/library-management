import { useState, useEffect, useCallback } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaShoppingCart } from 'react-icons/fa';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useLocation } from "react-router-dom";
import { TfiFaceSad } from 'react-icons/tfi';
import Form from 'react-bootstrap/Form';
import '../../../../assets/scss/user/library/details/cartBooksDetails.scss';
import { $$, fetchData } from "../../../../utils/myUtils";


const CardBooksDetails = (props) => {
    const { state, pathname } = useLocation();
    const [listCart, setListCart] = useState([]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);

    function resetCheckedCart() {
        for (const item of $$('[type="checkbox"]')) {
            if (item.checked) {
                item.checked = false;
            }
        }
    }

    async function handleConfirm() {
        let bookIdsBorrowed = [], itemRemaining = [];
        for (const item of $$('[type="checkbox"]')) {
            if (item.checked) {
                bookIdsBorrowed.push(item.getAttribute('data-id'));
            } else {
                listCart.forEach((itemCart) => {
                    if (+itemCart.id === +item.getAttribute('data-id'))
                        itemRemaining.push(itemCart);
                })
            }
        }

        let studentId = '1';
        let data = await fetchData('POST', `api/histories/${studentId}`, { studentId, bookIdsBorrowed })

        if (data.EC === 0) {
            resetCheckedCart();
            setListCart(itemRemaining);
        }
    }


    function pushToCart(book) {
        setListCart((currentList) => {
            if (currentList.length === 0 || currentList.findIndex((item) => +item.id === +book.id) === -1) {
                return [...currentList, book];
            }

            return currentList;
        });
    }

    useEffect(() => {
        if (state && !state?.pushToCart)
            state.pushToCart = pushToCart;
    }, [state])

    return (
        <>
            <button className='btn btn-outline-secondary px-5' onClick={handleClose} ><FaShoppingCart /> Cart ({listCart.length})</button>

            <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Số sách muốn mượn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {listCart.length > 0 ?
                        <ListGroup>
                            {listCart.length > 0
                                && listCart.map((book, index) => {
                                    return (
                                        <ListGroup.Item key={`bookCart-${index}`} className="position-relative">
                                            <div className="row">
                                                <div className="col-3 text-center ">
                                                    <img src="../../../../src/assets/img/quiz3.jpg" className="rounded-circle w-50" alt="" />
                                                </div>
                                                <div className="col-9 border-start border-3 border-info ">
                                                    <Form.Check
                                                        className="checkBorrowed position-absolute top-0 end-0 "
                                                        type={'checkbox'}
                                                        data-id={book.id}
                                                    />
                                                    <h5>{book.name}
                                                        <span className="badge ms-2 rounded-pill bg-info">{book.Status.name}</span>
                                                    </h5>
                                                    <p className="m-0 mb-2">{book.Categories.findIndex((item) => item.isBorrowed === 1) > -1 ? 'Được mượn về nhà' : 'Chỉ mượn tại chỗ'}</p>
                                                    <p className="m-0">Giá: {book.price}</p>
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    )
                                })}
                        </ListGroup>
                        :
                        <>
                            <h4 className="text-center text-secondary">Cart is empty now! Let's add something <TfiFaceSad /></h4>
                        </>
                    }

                </Modal.Body>
                <Modal.Footer>
                    <p className="fst-italic opacity-75">Please check book you want to borrowed</p>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleConfirm()}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default CardBooksDetails;