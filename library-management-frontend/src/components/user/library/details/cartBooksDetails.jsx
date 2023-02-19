import { useState, useEffect, useCallback, useContext, useRef } from "react";
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
import { toast } from "react-toastify";
import { AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai';
import { BsBookmarkDashFill } from "react-icons/bs";


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
        if (_.isEmpty(stateGlobal.user)) return navigate('/login');

        let dataBorrowed = [], itemRemaining = [], totalQuantity = 0;
        for (const item of $$('[type="checkbox"]')) {
            if (item.checked) {
                dataBorrowed.push({
                    bookIdBorrowed: +item.getAttribute('data-id'),
                    quantityBookBorrowed: +item.getAttribute('data-quantity')
                });
                totalQuantity += +item.getAttribute('data-quantity');
            } else {
                listCart.forEach((itemCart) => {
                    if (+itemCart.id === +item.getAttribute('data-id'))
                        itemRemaining.push(itemCart);
                })
            }
        }

        if (dataBorrowed.length > MAX_BOOKS_CAN_BORROW || totalQuantity > MAX_BOOKS_CAN_BORROW) {
            return toast.error(`Bạn chỉ được mượn tối đa ${MAX_BOOKS_CAN_BORROW} cuốn`);
        }

        if (dataBorrowed.length === 0) {
            return toast.error(`Bạn chưa chọn sách muốn mượn`);;
        }


        setIsDisabled(true);
        let data = await fetchData('POST', `api/histories`, { dataBorrowed })

        if (data.EC === 0 || data.EC === 1) {
            if (data.EC === 1) {
                setIsDisabled(false);
                return toast.error(data.EM);
            }
            resetCheckedCart();
            setListCart(itemRemaining);
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
        setIsDisabled(false);
    }


    function pushToCart(book) {
        let maxQuantityBookCanBorrowed = +book.quantityReality - +book.borrowed;
        setListCart((currentList) => {
            let startItem = _.cloneDeep(book);
            let itemIndex = currentList.findIndex((item) => +item.id === +book.id)
            if (itemIndex > -1) {
                // Vượt quá giới hạn số lượng sách hiện có
                if (+currentList[itemIndex].quantity >= maxQuantityBookCanBorrowed) {
                    toast.error("Đã vượt quá số sách hiện có !");
                    return currentList;
                }

                currentList[itemIndex].quantity = +currentList[itemIndex].quantity + 1;
                toast.success("Add book successful !");
                return currentList;
            } else {
                startItem.quantity = 1;
            }

            toast.success("Add book successful !");
            return [...currentList, startItem];
        });

    }

    function handleChangeQuantity(type, book) {
        let maxQuantityCanBorrowed = +stateGlobal.dataBookBorrowed.quantityReality - +stateGlobal.dataBookBorrowed.borrowed;
        setListCart((currentList) => {
            let itemIndex = currentList.findIndex((item) => +item.id === +book.id)
            if (itemIndex > -1) {
                // Số lương đã vượt quá giới hạn
                if (type === 'INCREASE' && +currentList[itemIndex].quantity >= maxQuantityCanBorrowed) {
                    toast.error("Đã vượt quá số sách hiện có !");
                    return currentList;
                }

                currentList[itemIndex].quantity = +currentList[itemIndex].quantity + (type === 'INCREASE' ? 1 : -1);

                currentList = currentList.filter((item) => item.quantity > 0);
                toast.success(`${type === 'INCREASE' ? 'Add' : 'Remove'} book successful !`);
                return currentList;
            }
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
                                                    <img src={book?.image ?? stateGlobal.defaultImgUrl} className="rounded-circle w-50" alt="" />
                                                </div>
                                                <div className="col-9 border-start border-3 border-info ">

                                                    <Form.Check
                                                        className="checkBorrowed position-absolute top-0 end-0 d-flex"
                                                        type={'checkbox'}
                                                        data-id={book.id}
                                                        data-quantity={book.quantity}
                                                    />

                                                    <h5>{book.name}
                                                        <span className="badge ms-2 rounded-pill bg-info">{book.Status.name}</span>
                                                    </h5>
                                                    <p className="m-0 mb-2">{book.Categories.findIndex((item) => item.isBorrowed === 1) > -1 ? 'Được mượn về nhà' : 'Chỉ mượn tại chỗ'}</p>
                                                    <p className="m-0">Giá: {book.price}
                                                        <span className="float-end border border-2 d-flex gap-2 fs-5">
                                                            <AiFillMinusCircle size={30} color="red"
                                                                className="decrease"
                                                                onClick={() => handleChangeQuantity('DECREASE', book)}
                                                            /> {book.quantity} <AiFillPlusCircle size={30} color="green"
                                                                className="increase"
                                                                onClick={() => handleChangeQuantity('INCREASE', book)}
                                                            />
                                                        </span>
                                                    </p>
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