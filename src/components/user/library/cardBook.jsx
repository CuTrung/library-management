import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../../assets/scss/user/library/cardBook.scss";
import { removeDiacritics } from "../../../utils/myUtils";
import { useContext } from "react";
import { ACTION, GlobalContext } from "../../../context/globalContext";


const CardBook = ({ book, rounded = false, disabled }) => {
    const navigate = useNavigate();
    const { state, pathname } = useLocation();

    const { stateGlobal, dispatch } = useContext(GlobalContext);

    function handleClickBook() {
        dispatch({ type: ACTION.SET_DATA_BOOK_BORROWED, payload: book })
        navigate(`details/${removeDiacritics(book.name.split(" ").join("-"), 'LOWER')}`)
    }

    return (
        <>
            <div className="itemBook col-3 position-relative mb-3">
                <button
                    disabled={disabled}
                    className={`btn p-0 w-100 border-0`}
                    onClick={() => handleClickBook()}
                >
                    {disabled &&
                        <span className="badge rounded-pill bg-danger float-end">Đã hết</span>
                    }

                    <img
                        className={`w-100 ${rounded ? 'rounded' : ''}`}
                        src={book?.image ?? `../../../../src/assets/img/default.jpg`}
                        alt=""
                    />
                </button>

                <div className="w-75 h-25 bg-dark bg-opacity-75 text-white position-absolute bottom-0 start-50 translate-middle-x">
                    <p className="m-0 text-center">{book?.name}</p>
                    <p className="float-start">Mã sách: {book?.id}</p>
                    <p className="float-end">Có {+book?.quantity - +book?.borrowed} cuốn</p>
                </div>
            </div>
        </>
    );
};

export default CardBook;
