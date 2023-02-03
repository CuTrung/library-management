import { useState, useEffect, useCallback, useContext } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaShoppingCart } from 'react-icons/fa';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TfiFaceSad } from 'react-icons/tfi';
import Form from 'react-bootstrap/Form';
import '../../../../assets/scss/user/library/details/cartBooksDetails.scss';
import { $$, fetchData } from "../../../../utils/myUtils";
import useToggle from "../../../../hooks/useToggle";
import { ACTION, GlobalContext } from "../../../../context/globalContext";
import _ from 'lodash';

const CardBooksDetails = (props) => {
    const [listCart, setListCart] = useState([]);
    const [show, toggleShow] = useToggle(false);
    const MAX_BOOKS_CAN_BORROW = import.meta.env.VITE_MAX_BOOKS_CAN_BORROW;

    const { stateGlobal, dispatch } = useContext(GlobalContext);
    const navigate = useNavigate();

    const [isDisabled, setIsDisabled] = useState(false);

    function resetCheckedCart() {
        for (const item of $$('[type="checkbox"]')) {
            if (item.checked) {
                item.checked = false;
            }
        }
    }

    async function handleConfirm() {
        if (_.isEmpty(stateGlobal.user)) return navigate('/login')

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

        if (bookIdsBorrowed.length > MAX_BOOKS_CAN_BORROW) {
            alert(`Bạn chỉ được mượn tối đa ${MAX_BOOKS_CAN_BORROW} cuốn`);
            return;
        }

        if (bookIdsBorrowed.length === 0) {
            alert(`Bạn chưa chọn sách muốn mượn`);
            return;
        }

        setIsDisabled(true);
        let data = await fetchData('POST', `api/histories`, { bookIdsBorrowed })

        if (data.EC === 0 || data.EC === 1) {
            if (data.EC === 1) {
                alert("Bạn đã đăng kí mượn tối đa, ko thể mượn thêm");
                setIsDisabled(false);
                return;
            }
            resetCheckedCart();
            setListCart(itemRemaining);
            setIsDisabled(false);
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
        dispatch({ type: ACTION.ADD_FN_PUSH_TO_CART, payload: pushToCart })

    }, [])

    return (
        <>
            <button className='btn btn-outline-secondary px-5' onClick={toggleShow} ><FaShoppingCart /> Cart ({listCart.length})</button>

            <Modal show={show} onHide={toggleShow} backdrop="static" size="lg">
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
                                                    <img src={book?.image ?? `../../../../src/assets/img/default.jpg`} className="rounded-circle w-50" alt="" />
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
                    <p className="fst-italic opacity-75">Please check book you want to borrowed <strong className="text-danger">(Max = {MAX_BOOKS_CAN_BORROW})</strong></p>
                    <Button variant="secondary" onClick={toggleShow}>
                        Close
                    </Button>
                    <Button disabled={isDisabled} variant="primary" onClick={() => handleConfirm()}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default CardBooksDetails;